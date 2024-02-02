import { Chessboard } from "./Chessboard";
import DragAndDrop from "./DragAndDrop";
import { Chess } from "chess.js";
import { Game, Move } from "./Game";
import Playlist from "./Playlist";

export class GameController{
    private chessboard:Chessboard;
    private dragAndDrop:DragAndDrop | undefined;
    private animationTimeoutId:NodeJS.Timeout | undefined;
    private autoplayTimeoutId:NodeJS.Timeout | undefined;
    private playlist:Playlist | undefined;
    onGameStartCallback:Function;
    onMoveStartCallback:Function;
    onGameEndCallback:Function;

    constructor(boardElement: HTMLElement, fen:string, dragType:string | undefined, onGameStartCallback:Function, onMoveStartCallback:Function, onGameEndCallback:Function){
        this.chessboard = new Chessboard(boardElement, fen);
        if (dragType && ["white", "black", "both"].includes(dragType)){
            this.dragAndDrop = new DragAndDrop(this.chessboard, dragType,
                // Callback on drop
                (from:string, to:string) => {
                    this.move(from, to);
                });
        }
        this.onGameStartCallback = onGameStartCallback;
        this.onMoveStartCallback = onMoveStartCallback;
        this.onGameEndCallback = onGameEndCallback;
    }
    setFen(fen:string){
        this.chessboard.setFen(fen);
    }
    createPlaylist(games:Game[]){
        this.stopTimers();
        this.playlist = new Playlist(games);
    }
    stopTimers(){
        clearTimeout(this.animationTimeoutId);
        clearTimeout(this.autoplayTimeoutId);
    }
    goToThisMoveInPlaylist(moveIndex:number){
        if (this.playlist){
            let game = this.playlist.games[this.playlist.gameIndex];
            let move = game.moves[moveIndex];

        }
    }
    skipStart(){
        if (this.playlist){
            this.stopTimers();
            
        }
    }
    skipPrevious(){
        let chess = this.playlist?.chess;
        let history = chess?.history({verbose:true});
        debugger;
    }
    startPlaylist(){
        if (this.playlist){
            this.playlist.isPaused = false;
            this.showGames(this.playlist);
        }
    }
    pausePlaylist(){
        this.stopTimers();
        if (this.playlist){
            this.playlist.isPaused = true;
        }
    }
    showGames(playlist:Playlist){
        if (playlist !== this.playlist || playlist.isPaused)
            return;
        else{
            let game = playlist.games[playlist.gameIndex];
            if (!game.movetext)
                alert("Could not find the moves in the file");
            else if (game.moves.length === 0)
            {
                playlist.chess = new Chess();
                this.chessboard.setFen(playlist.chess.fen());
                game.movetext.split(" ").forEach((chunk, index) =>{
                    if (chunk.length > 0){
                        let notation = chunk.substring(chunk.indexOf(".") +1);
                        let result = playlist.chess.move(notation);
                        let from = result.from;
                        let to = result.to;
                        let promotion = result.promotion as string;
                        let captured = result.captured as string;
                        let color = result.color;
                        let move = new Move(index + 1, color, from, to, notation, promotion, captured)
                        game.moves.push(move);
                    }
                });
                if (game.moves.length === 0){
                    alert("Failed to parse the moves");
                    this.playlist = undefined;
                    return;
                }
                this.playlist.moveIndex = 0;
                this.onGameStartCallback(game);
            }
            if (this.dragAndDrop){
                this.dragAndDrop.preparePieces();
            }
            this.showMoves(playlist);
        }
    }
    showMoves(playlist:Playlist)
    {
        if (playlist !== this.playlist || playlist.isPaused)
            return;
        else{
            let game = playlist.games[playlist.gameIndex];
            let move = game.moves[playlist.moveIndex];
            this.onMoveStartCallback(move);
            this.animateMove(playlist, () =>
            {
                if (playlist !== this.playlist)
                    return;
                else
                {
                    // OnAnimationEnd: Don't show next move right away
                    this.autoplayTimeoutId = setTimeout(() => {
                        if (playlist.moveIndex === game.moves.length -1)
                        {
                            this.onGameEndCallback(game);
                            if (playlist.gameIndex < playlist.games.length -1){
                                playlist.gameIndex++;
                                this.showGames(playlist);
                            }
                        }
                        else
                        {
                            this.showMoves(playlist);
                        }
                    }, 1000);
                }
            });
        }
    }
    animateMove(playlist:Playlist, onAnimationEndCallback: Function){
        this.chessboard.removeAllHighlights();
        let game = playlist.games[playlist.gameIndex];
        let move = game.moves[playlist.moveIndex];
        let sourceSquare = this.chessboard.squares[move.from].element;
        let targetSquare = this.chessboard.squares[move.to].element;
        if (sourceSquare && targetSquare)
        {
            let piece = sourceSquare.firstChild as HTMLElement;
            let fenChar = piece.getAttribute("data-type");
            let moves = [{piece: piece, from: move.from, to: move.to, sourceSquare: sourceSquare, targetSquare: targetSquare}];
            let castlingInfo = this.getCastlingInfo(fenChar!, move.from, move.to);
            if (castlingInfo.isCastling)
            {
                let rookSourceSquare = this.chessboard.squares[castlingInfo.rookFrom!].element;
                let rookTargetSquare = this.chessboard.squares[castlingInfo.rookTo!].element;
                let rook = rookSourceSquare.firstChild as HTMLElement;
                moves.push({piece: rook, from: castlingInfo.rookFrom!, to: castlingInfo.rookTo!, sourceSquare: rookSourceSquare, targetSquare: rookTargetSquare});
            }
            // If castling, there will be 2 moves - king and rook
            moves.forEach(move =>{
                move.sourceSquare.classList.add("source");
                move.targetSquare.classList.add("target");
                let startPosition = move.piece.getBoundingClientRect();
                // Calculate endposition of drag
                let rect = move.targetSquare.getBoundingClientRect();
                let x = rect.left + (rect.width / 2);
                let y = rect.top + (rect.height / 2);
                let endPosition = { x: x, y: y };
                move.piece.style.transitionProperty = "left, top";
                move.piece.style.transitionDuration = "0.7s";
                move.piece.style.left = endPosition.x - startPosition.x + "px";
                move.piece.style.top = endPosition.y - startPosition.y + "px";
                move.piece.classList.add("dragging");
            });
            piece.addEventListener('transitionend', () => {
                moves.forEach(move =>{
                    move.piece.style.transitionProperty = "";
                    move.piece.style.left = "";
                    move.piece.style.top = "";
                    move.piece.classList.remove("dragging");
                });
                this.move(move.from, move.to, move.promotion);//this function will take care of castling so we don't need to call it for the rook
                playlist.moveIndex++;
                onAnimationEndCallback();
            }, { once: true });
        }
    }
    /** Example 1 - from: "e2" to: "e4" Example 2:  from: "a7" to: "a8" promotion: "q" Promotion can be queen (q), bishop (b), knight (n) or rook (r) */
    move(from:string, to: string, promotion?:string){
        let piece = this.chessboard.squares[from].element.firstChild as HTMLImageElement;
        let fenChar = piece.getAttribute("data-type");
        this.moveSimple(from, to);
        let castlingInfo = this.getCastlingInfo(fenChar!, from, to);
        if (castlingInfo.isCastling){
            this.chessboard.squares[castlingInfo.rookFrom!].element.classList.add("drag-source");
            this.moveSimple(castlingInfo.rookFrom!, castlingInfo.rookTo!);
        }
        if (promotion){
            let currentFenChar = piece.getAttribute("data-type");
            let isWhite = currentFenChar === currentFenChar!.toUpperCase();
            let newFenChar = isWhite ? promotion.toUpperCase() : promotion.toLowerCase();
            piece.setAttribute("data-type", newFenChar);
            piece.src = this.chessboard.getPieceUrl(newFenChar);
        }
    }
    private moveSimple(from:string, to:string)
    {
        let piece = this.chessboard.squares[from].element.firstChild as HTMLElement;
        let targetSquare = this.chessboard.squares[to].element;
        targetSquare.innerHTML = "";
        targetSquare.appendChild(piece);
        targetSquare.classList.add("target");
    }
    private getCastlingInfo(fenChar:string, from:string, to:string)
    {
        if (fenChar === "K" && from === "e1"){
            if (to === "g1")
                return {isCastling:true, rookFrom:"h1", rookTo:"f1"};
            else if (to === "c1")
                return {isCastling:true, rookFrom:"a1", rookTo:"d1"};
        }
        else if (fenChar === "k" && from === "e8")
        {
            if (to === "g8")
                return {isCastling:true, rookFrom:"h8", rookTo:"f8"};
            else if (to === "c8")
                return {isCastling:true, rookFrom:"a8", rookTo:"d8"};
        }
        return {isCastling:false}
    }
}
import { Chessboard } from "./Chessboard";
import DragAndDrop from "./DragAndDrop";
import { Chess, Move } from "chess.js";
import { Game, GameState } from "./Game";

export class GameController{
    private chessboard:Chessboard;
    private dragAndDrop:DragAndDrop | undefined;
    private animationTimeoutId:NodeJS.Timeout | undefined;
    private autoplayTimeoutId:NodeJS.Timeout | undefined;
    currentGame: Game | undefined;
    onGameStateChangedCallback:Function;
    onMoveStartCallback:Function;
    onGameEndCallback:Function;
    animationDuration:number = 0.7;
    animationFastDuration:number = 0.2;
    delayBetweenMoves:number = 1;
    shortDelayBetweenMoves:number = 0.1;

    constructor(boardElement: HTMLElement, fen:string, dragType:string | undefined, onGameStateChangedCallback:Function, onMoveStartCallback:Function, onGameEndCallback:Function){
        this.chessboard = new Chessboard(boardElement, fen);
        if (dragType && ["white", "black", "both"].includes(dragType)){
            this.dragAndDrop = new DragAndDrop(this.chessboard, dragType,
                // Callback on drop
                (from:string, to:string) => {
                    this.move(from, to, undefined, undefined);
                });
        }
        this.onGameStateChangedCallback = onGameStateChangedCallback;
        this.onMoveStartCallback = onMoveStartCallback;
        this.onGameEndCallback = onGameEndCallback;
    }
    setFen(fen:string){
        this.chessboard.setFen(fen);
    }
    stopTimers(){
        clearTimeout(this.animationTimeoutId);
        clearTimeout(this.autoplayTimeoutId);
    }
    startGame(game:Game){
        this.stopTimers();
        this.currentGame = game;
        this.currentGame.init();
        this.updateGameState(GameState.Play);
        this.showGame(game);
    }
    goToThisMove(moveIndex:number){
        if (this.currentGame){
            if (moveIndex === -1){
                this.chessboard.setFen("start");
                this.currentGame.moveIndex = 0;
            }
            else{
                let chess = this.currentGame.chess;
                let history = chess?.history({verbose:true})!;
                let move = history[moveIndex];
                this.chessboard.setFen(move.after);
                this.currentGame.moveIndex = moveIndex;
            }
            this.updateGameState(GameState.Pause);
        }
    }
    goToStart(){
        if (this.currentGame){
            this.goToThisMove(-1);
        }
    }
    rewind(){
        if (this.currentGame){
            this.currentGame.state = GameState.Rewind;
            let historyLength = this.currentGame.chess?.history().length!;
            if (this.currentGame.moveIndex >= historyLength -1){
                this.updateGameState(GameState.Rewind);
                if (this.currentGame.moveIndex === historyLength -1){
                    this.currentGame.moveIndex++;
                }
                this.showAnimatedMoves(this.currentGame);
            }
        }
    }
    play(){
        if (this.currentGame){
            this.updateGameState(GameState.Play);
            this.showAnimatedMoves(this.currentGame);
        }
    }
    pause(){
        this.stopTimers();
        this.updateGameState(GameState.Pause);
    }
    forward(){
        if (this.currentGame){
            this.updateGameState(GameState.Forward)
            if (this.currentGame.moveIndex === 0)
                this.showAnimatedMoves(this.currentGame);
        }
    }
    goToEnd(){
        if (this.currentGame){
            let history = this.currentGame.chess?.history();
            if (this.currentGame.moveIndex !== history?.length! -1){
                this.goToThisMove(history?.length! -1);
            }
        }
    }
    updateGameState(state: GameState){
        if (this.currentGame){
            this.currentGame.state = state;
            this.onGameStateChangedCallback(state);
        }
    }
    showGame(game: Game){
        if (game.chess && game.chess.fen() && game.chess.history().length > 0)
        {
            this.chessboard.setFen("start");
            this.updateGameState(GameState.Play);
            this.showAnimatedMoves(game);
        }
    }
    showAnimatedMoves(game:Game){
        if (game.state === GameState.Pause){
            return;
        }
        let forward = game.state !== GameState.Rewind;
        let history = game.chess!.history({verbose:true});
        let historyMove = forward ? history[game.moveIndex] : history[game.moveIndex -1];
        if (forward && game.moveIndex === history.length){
            this.updateGameState(GameState.Pause);
            return;
        }
        else if (!forward && game.moveIndex === 0){
            this.updateGameState(GameState.Pause);
            return;
        }
        setTimeout(()=>{
            this.onMoveStartCallback(game);
        },0);
        let from = forward ? historyMove.from : historyMove.to;
        let to = forward ? historyMove.to : historyMove.from;
        let piece = this.chessboard.squares[from].element.firstChild as HTMLImageElement;
        let undoPromotion = forward ? "" : (historyMove.promotion || "");
        if (undoPromotion){
            let fenChar = historyMove.color === "w" ? "P" : "p";
            piece.setAttribute("data-type", fenChar);
            piece.src = this.chessboard.getPieceUrl(fenChar);
        }
        let moves:{from:string, to:string}[] = [];
        moves.push({from, to});
        let fenChar = piece.getAttribute("data-type")!;
        let castlingInfo = this.getCastlingInfo(fenChar, historyMove.from, historyMove.to);
        if (castlingInfo.isCastling)
        {
            let from = forward ? castlingInfo.rookFrom : castlingInfo.rookTo;
            let to = forward ? castlingInfo.rookTo : castlingInfo.rookFrom;
            moves.push({from: from!, to: to!});
        }
        if (!forward && historyMove.captured){
            let undoCaptureFenChar = historyMove.captured as string;
            if (historyMove.color === "b"){
                undoCaptureFenChar = undoCaptureFenChar.toUpperCase();
            }
            let sourceSquare = this.chessboard.squares[moves[0].from].element;
            let piece = this.chessboard.createPiece(undoCaptureFenChar);
            sourceSquare.appendChild(piece);
        }
        this.animateMoves(moves, historyMove.color, game.state, undoPromotion, () =>{
            // OnAnimationEndCallback
            moves.forEach(move =>{
                if (forward && historyMove.promotion)
                    this.moveSimple(move.from, move.to, historyMove.promotion);
                else
                    this.moveSimple(move.from, move.to, undefined);
            })
            if (forward)
                game.moveIndex++;
            else
                game.moveIndex--;
            // OnAnimationEnd: Don't show next move right away
            let delayBetweenMoves = game.state === GameState.Play ? this.delayBetweenMoves : this.shortDelayBetweenMoves;
            this.autoplayTimeoutId = setTimeout(() => {
                if (game.moveIndex === game.chess!.history().length)
                {
                    this.onGameEndCallback(game);
                    this.updateGameState(GameState.Pause);
                }
                else
                {
                    this.showAnimatedMoves(game);
                }
            }, delayBetweenMoves * 1000);
        });
    }
    animateMoves(moves:{from:string, to:string}[], color:string, gameState:GameState, undoPromotion:string, onAnimationEndCallback:Function){
        this.chessboard.removeAllHighlights();
        let forward = gameState !== GameState.Rewind;
        moves.forEach((move,index) =>{
            let sourceSquare = this.chessboard.squares[move.from].element as HTMLElement;
            let targetSquare = this.chessboard.squares[move.to].element as HTMLElement;
            let piece = sourceSquare.firstChild as HTMLImageElement;
            sourceSquare.classList.add(forward ? "source" : "target");
            targetSquare.classList.add(forward ? "target" : "source");
            let startPosition = piece.getBoundingClientRect();
            let rect = targetSquare.getBoundingClientRect();
            let x = rect.left + (rect.width / 2);
            let y = rect.top + (rect.height / 2);
            let endPosition = { x: x, y: y };
            piece.style.transitionProperty = "left, top";
            let animationDuration = gameState === GameState.Play ? this.animationDuration : this.animationFastDuration;
            piece.style.transitionDuration = animationDuration + "s";
            piece.style.left = endPosition.x - startPosition.x + "px";
            piece.style.top = endPosition.y - startPosition.y + "px";
            piece.classList.add("dragging");
            if (index === 0){
                piece.addEventListener('transitionend', () => {
                    moves.forEach(move =>{
                        let sourceSquare = this.chessboard.squares[move.from].element as HTMLElement;
                        let piece = sourceSquare.firstChild as HTMLImageElement;
                        piece.style.transitionProperty = "";
                        piece.style.left = "";
                        piece.style.top = "";
                        piece.classList.remove("dragging");
                    });
                    onAnimationEndCallback();
                }, { once: true });
            }
        });
    }
    /** Example 1 - from: "e2" to: "e4" Example 2:  from: "a7" to: "a8" promotion: "q" Promotion can be queen (q), bishop (b), knight (n) or rook (r) */
    move(from:string, to: string, promotion:string | undefined, undoPromotion:string | undefined){
        let piece = this.chessboard.squares[from].element.firstChild as HTMLImageElement;
        let fenChar = piece.getAttribute("data-type");
        this.moveSimple(from, to, promotion);
        let castlingInfo = this.getCastlingInfo(fenChar!, from, to);
        if (castlingInfo.isCastling){
            this.chessboard.squares[castlingInfo.rookFrom!].element.classList.add("drag-source");
            this.moveSimple(castlingInfo.rookFrom!, castlingInfo.rookTo!, undefined);
        }
    }
    private moveSimple(from:string, to:string, promotion:string|undefined)
    {
        let piece = this.chessboard.squares[from].element.firstChild as HTMLImageElement;
        let targetSquare = this.chessboard.squares[to].element;
        targetSquare.innerHTML = "";
        targetSquare.appendChild(piece);
        targetSquare.classList.add("target");
        if (promotion){
            let currentFenChar = piece.getAttribute("data-type");
            let isWhite = currentFenChar === currentFenChar!.toUpperCase();
            let newFenChar = promotion;
            newFenChar = isWhite ? newFenChar!.toUpperCase() : newFenChar!.toLowerCase();
            piece.setAttribute("data-type", newFenChar);
            piece.src = this.chessboard.getPieceUrl(newFenChar);
        }
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
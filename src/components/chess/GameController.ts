import { Chessboard } from "./Chessboard";
import DragAndDrop from "./DragAndDrop";
import { Move } from "chess.js";
import { MoveInfo } from "./MoveInfo";
import { Game, GameState } from "./Game";
import { Callbacks } from "./Callbacks";

export class GameController{
    private chessboard:Chessboard;
    private animationTimeoutId:NodeJS.Timeout | undefined;
    private autoplayTimeoutId:NodeJS.Timeout | undefined;
    currentGame: Game | undefined;
    callbacks = new Callbacks();
    animationDuration:number = 0.7;
    animationFastDuration:number = 0.1;
    delayBetweenMoves:number = 1;
    shortDelayBetweenMoves:number = 0;
    private cancelAnimation = false;

    constructor(boardElement: HTMLElement, fen:string, dragType:string | undefined, useArrows:boolean){
        this.chessboard = new Chessboard(boardElement, fen, useArrows);
        if (dragType && ["white", "black", "both"].includes(dragType)){
            new DragAndDrop(this.chessboard, dragType,
                // Callback on drop
                (from:string, to:string) => {
                    this.onDrop(from, to);
                });
        }
    }
    private clearTimeouts(){
        this.cancelAnimation = true;
        clearTimeout(this.animationTimeoutId);
        clearTimeout(this.autoplayTimeoutId);
    }
    startGame(game:Game, whiteName:string|undefined, blackName:string|undefined){
        this.clearTimeouts();
        this.currentGame = game;
        game.moveIndex = -1;
        this.chessboard.setFen("start", true);
        this.chessboard.setPlayerNames(blackName || "Black", whiteName || "White");
        this.updateGameState(GameState.Play);
    }
    private updateGameState(newState: GameState){
        if (this.currentGame && this.currentGame.state !== newState){
            if (this.currentGame.state === GameState.Start){
                if ([GameState.Rewind, GameState.Pause].includes(newState)){
                    return;
                }
            }
            else if (this.currentGame.state === GameState.End && this.currentGame.moveIndex === this.currentGame.moves.length -1){
                if ([GameState.Play, GameState.Pause, GameState.Forward].includes(newState)){
                    return;
                }
            }
            let lastState = this.currentGame.state;
            this.currentGame.state = newState;
            if (this.callbacks.onGameStateChanged){
                this.callbacks.onGameStateChanged(newState);
            }
            if ([GameState.Start, GameState.Pause, GameState.End].includes(lastState)){
                if ([GameState.Rewind, GameState.Play, GameState.Forward].includes(newState)){
                    this.showAnimatedMoves();
                }
            }
        }
    }
    goToMove(moveIndex:number){
        if (this.currentGame){
            let game = this.currentGame;
            if (moveIndex !== game.moveIndex){
                if ([GameState.Rewind, GameState.Play, GameState.Forward].includes(game.state)){
                    this.clearTimeouts();
                }
                game.moveIndex = moveIndex;
                if (moveIndex === -1){
                    this.chessboard.setFen("start", true);
                    this.updateGameState(GameState.Start);
                }
                else{
                    if (moveIndex === game.moves.length -1){
                        this.updateGameState(GameState.End);
                    }
                    else{
                        this.updateGameState(GameState.Pause);
                    }
                    let move = game.moves[moveIndex];
                    this.chessboard.setFen(move.after, true);
                    debugger;
                    this.chessboard.squares[move.from].element.classList.add("source");
                    this.chessboard.squares[move.to].element.classList.add("target");
                }
            }
        }
    }
    goToStart= () =>{
        this.goToMove(-1);
    }
    rewind= () => {
        this.updateGameState(GameState.Rewind);
    }
    play= () => {
        this.updateGameState(GameState.Play);
    }
    pause= () => {
        this.updateGameState(GameState.Pause);
    }
    forward= () => {
        this.updateGameState(GameState.Forward)
    }
    goToEnd= () => {
        if (this.currentGame){
            this.goToMove(this.currentGame.moves.length -1);
        }
    }
    private showAnimatedMoves(){
        if (!this.currentGame || this.currentGame.state === GameState.Pause){
            return;
        }
        let game = this.currentGame;
        let gameState = game.state;//set this variable here so it doesn't change if user clicks during animation
        let rewind = gameState === GameState.Rewind;
        let animationMoveIndex = rewind ? game.moveIndex : game.moveIndex + 1;
        let move = game.moves[animationMoveIndex];
        if (this.callbacks.onMoveStart){
            this.callbacks.onMoveStart(move, animationMoveIndex, rewind);
        }
        let moveInfo = new MoveInfo(this.chessboard, move, rewind);
        this.chessboard.removeAllHighlights();
        moveInfo.sourceSquare.classList.add("source");
        moveInfo.targetSquare.classList.add("target");
        if (moveInfo.castling){
            moveInfo.castling.rookSourceSquare.classList.add("source");
            moveInfo.castling.rookTargetSquare.classList.add("target");
        }
        else if (rewind){
            // Undo promotion and capture before animation starts
            if (move.promotion){
                let fenChar = move.color === "b" ? "p" : "P";
                moveInfo.piece.setAttribute("data-type", fenChar);
                moveInfo.piece.src = this.chessboard.getPieceUrl(fenChar);
            }
            if (move.captured){
                let piece = this.chessboard.undoCapture(move.color, move.captured);
                moveInfo.targetSquare.appendChild(piece);
            }
        }
        this.animateMove(moveInfo, move, gameState, () =>
        {
            // OnAnimationEndCallback 
            if (!rewind && move.captured && this.callbacks.onCapture){
                let captureSquare = moveInfo.partialMoves[0].destination;
                let piece = captureSquare.firstChild as HTMLImageElement;
                this.chessboard.addCapture(move.color, move.captured, piece);
                // let rect = capturedPiece.getBoundingClientRect();
                // captureSquare.removeChild(capturedPiece);
                // this.callbacks.onCapture(move.color, move.captured, capturedPiece, rect);
            }
            // There may be 2 moves due to castling
            moveInfo.partialMoves.forEach(move =>{
                move.destination.innerHTML = "";
                move.destination.appendChild(move.piece);
            });
            
            if (this.callbacks.onMoveEnd){
                this.callbacks.onMoveEnd(move, game.moveIndex, rewind);
            }
            game.moveIndex += rewind ? -1 : 1;
            if (!rewind && move.promotion){
                let fenChar = move.color === "b" ? move.promotion : move.promotion.toUpperCase();
                moveInfo.piece.setAttribute("data-type", fenChar);
                moveInfo.piece.src = this.chessboard.getPieceUrl(fenChar);
            }
            if (!rewind && game.moveIndex === game.moves.length -1){
                this.updateGameState(GameState.End);
                return;
            }
            if (rewind && game.moveIndex === -1){
                this.updateGameState(GameState.Start);
                return;
            }
   
            // Animation ended and position updated but don't show next move right away
            let delayBetweenMoves = game.state === GameState.Play ? this.delayBetweenMoves : this.shortDelayBetweenMoves;
            this.autoplayTimeoutId = setTimeout(() => 
            {
                this.showAnimatedMoves();
            }, delayBetweenMoves * 1000);
        });
    }
    private animateMove(moveInfo:MoveInfo, move:Move, gameState:GameState, onAnimationEndCallback:Function)
    {
        // Again: Due to castling there can be 2 moves
        try{
            moveInfo.partialMoves.forEach(move =>{
                let startPosition = move.piece.getBoundingClientRect();
                let rect = move.destination.getBoundingClientRect();
                let x = rect.left + (rect.width / 2);
                let y = rect.top + (rect.height / 2);
                let endPosition = { x: x, y: y };
                move.piece.style.transitionProperty = "left, top";
                let animationDuration = gameState === GameState.Play ? this.animationDuration : this.animationFastDuration;
                move.piece.style.transitionDuration = animationDuration + "s";
                move.piece.style.left = endPosition.x - startPosition.x + "px";
                move.piece.style.top = endPosition.y - startPosition.y + "px";
                move.piece.classList.add("dragging");
            });
            this.cancelAnimation = false;
            moveInfo.piece.addEventListener('transitionend', () => {
                if (!this.cancelAnimation){
                    // Again: Due to castling there can be 2 moves
                    moveInfo.partialMoves.forEach(move =>{
                        move.piece.style.transitionProperty = "";
                        move.piece.style.left = "";
                        move.piece.style.top = "";
                        move.piece.classList.remove("dragging");
                    });
                    onAnimationEndCallback();
                }
            }, { once: true });
        }
        catch(ex){
            console.log(ex);
            let a = moveInfo;
            let b = move;
            let c = gameState;
            debugger;
        }
    }
    /** Example 1 - from: "e2" to: "e4" Example 2:  from: "a7" to: "a8" promotion: "q" Promotion can be queen (q), bishop (b), knight (n) or rook (r) */
    private onDrop(from:string, to: string){
        let piece = this.chessboard.squares[from].element.firstChild as HTMLImageElement;
        let fenChar = piece.getAttribute("data-type");
        this.moveSimple(from, to);
        let castlingInfo = this.getCastlingInfo(fenChar!, from, to);
        if (castlingInfo.isCastling){
            this.chessboard.squares[castlingInfo.rookFrom!].element.classList.add("drag-source");
            this.moveSimple(castlingInfo.rookFrom!, castlingInfo.rookTo!);
        }
    }
    private moveSimple(from:string, to:string)
    {
        let piece = this.chessboard.squares[from].element.firstChild as HTMLImageElement;
        let targetSquare = this.chessboard.squares[to].element;
        targetSquare.innerHTML = "";
        targetSquare.appendChild(piece);
        targetSquare.classList.add("target");
    }
    // This function should be deprecated. Try to use getCastlingInfoFromSANcode
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
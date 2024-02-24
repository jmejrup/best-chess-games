import Chessboard from "../chessboard/Chessboard";
import Shared from "../chessboard/Shared";
import { Move } from "chess.js";
import PlayerInfo from "./PlayerInfo";
import MoveTransitions from "./MoveTransitions";
import Game from "./Game";
import Transition from "./Transition";
import "./gameBrowser.css";

type State = "start" | "rewind" | "previous" | "play" | "pause" | "next" | "forward" | "end";

export default class GameBrowser{
    chessboard:Chessboard;
    isRotated:boolean;
    playerInfo:PlayerInfo;
    moves:Move[] = [];
    currentMoveIndex = 0;
    moveTransitions:MoveTransitions;
    state:State = "start";
    shortDelayBetweenMoves = 200;
    longDelayBetweenMoves = 1000;
    shortTransitionDuration = "500ms";
    longTransitionDuration = "2000ms";
    timeoutId:NodeJS.Timeout|undefined;

    constructor(container:HTMLElement, fen:string, isRotated:boolean){
        this.chessboard = new Chessboard(container, fen, isRotated);
        this.playerInfo = new PlayerInfo(container, fen, isRotated);
        this.moveTransitions = new MoveTransitions(this.chessboard, isRotated);
        this.isRotated = isRotated;
        setTimeout(() => {
            this.goToMove(7);
        }, 10);
    }
    rotate(){
        this.isRotated = !this.isRotated;
        this.chessboard.rotate();
        this.playerInfo.rotate(this.isRotated);
        if (this.moveTransitions.currentTransition){
            this.moveTransitions.cancelTransition("rotate");
        }
        this.moveTransitions.rotate();
    }
    loadGame(game:Game){
        this.chessboard.setFen(Shared.startFEN, true);
        this.playerInfo.setPlayerNames(game.blackPlayer, game.whitePlayer);
        this.playerInfo.setScoreAndCaputereByFen(Shared.startFEN);
        this.moves = game.moves;
        this.currentMoveIndex = -1;
    }
    rewind(){
        this.state = "rewind";
        this.moveBack();
    }
    previous(){
        this.state = "pause";
        this.moveBack();
    }
    play(){
        this.state = "play";
        this.moveForward();
    }
    pause(){
        this.state = "pause";
    }
    next(){
        this.state = "pause";
        this.moveForward();
    }
    forward(){
        this.state = "forward";
        this.moveForward();
    }
    goToMove(index:number){
        this.currentMoveIndex = index;
        if (index === -1){
            this.state = "start";
            let move = this.moves[0];
            this.chessboard.setFen(move.before, true);
            this.chessboard.clearSourceAndTargetHighlights();
        }
        else{
            if (index === this.moves.length -1){
                this.state = "end";
            }
            else{
                this.state = "pause";
            }
            let move = this.moves[index];
            this.chessboard.setFen(move.after, true);
            this.playerInfo.setScoreAndCaputereByFen(move.after);
            this.chessboard.highlightSourceAndTarget(move.from, move.to);
        }
    }
    private moveForward(){
        clearTimeout(this.timeoutId);
        if (this.moveTransitions.currentTransition){
            this.moveTransitions.cancelTransition("moveForward");
        }
        else if (this.currentMoveIndex < this.moves.length -1){
            let move = this.moves[this.currentMoveIndex +1];
            let piece = this.chessboard.getPiece(move.from)!;
            let castling = this.getCastling(move, true);
            // this.chessboard.clearSourceAndTargetHighlights();
            this.chessboard.highlightSource(move.from);
            if (castling){
                this.chessboard.highlightTarget(castling.from);
            }
            let transitionInfo:Transition.Info = {
                cancelReason:undefined,
                direction:"forward", 
                piece,
                from:move.from,
                to:move.to,
                castling
            }
            let duration = this.state === "play" ? this.longTransitionDuration : this.shortTransitionDuration;
            this.moveTransitions.move(transitionInfo, duration, () =>{
                //OnTransitionEnd
                this.finishMoveForward(transitionInfo, move, false);
            }, () =>{
                //OnTransitionCancel
                if (transitionInfo.cancelReason === "moveForward" || transitionInfo.cancelReason === "rotate"){
                    this.finishMoveForward(transitionInfo, move, true);
                }
                else if (this.state === "rewind"){
                    this.moveBack();
                }
            });
        }
    }
    private finishMoveForward(info:Transition.Info, move:Move, jumpToNextMove:boolean){
        if (info.castling){
            this.chessboard.setPiecePosition(info.castling.rook, info.castling.to);
            this.chessboard.highlightSource(info.castling.to);
        }
        else if (move.captured){
            let capturedPiece = this.chessboard.getPiece(move.to)!;
            this.chessboard.removePiece(move.to);
            this.playerInfo.addCapture(capturedPiece.fenChar)
        }
        this.chessboard.setPiecePosition(info.piece, info.to);
        if (move.promotion){
            this.chessboard.removePiece(move.to);
            let promotionFenChar = move.color === "b" ? move.promotion : move.promotion.toUpperCase();
            this.chessboard.addPiece(promotionFenChar, move.to);
        }
        this.chessboard.highlightTarget(move.to);
        this.currentMoveIndex++;
        if (this.currentMoveIndex < this.moves.length -1){
            if (jumpToNextMove){
                this.moveForward();
            }
            else if(this.state === "play" || this.state === "forward"){
                this.timeoutId = setTimeout(()=>{
                    if (this.state === "play" || this.state === "forward"){
                        this.moveForward();
                    }
                }, this.state === "play" ? this.longDelayBetweenMoves : this.shortDelayBetweenMoves);
            }
        }
    }
    private moveBack(){
        clearTimeout(this.timeoutId);
        if (this.moveTransitions.currentTransition){
            this.moveTransitions.cancelTransition("moveBack");
        }
        else if (this.currentMoveIndex === -1){
            this.chessboard.clearSourceAndTargetHighlights();
            this.state = "start";
        }
        else{
            if (this.state === "play" || this.state === "forward"){
                this.state = "pause";
            }
            let move = this.moves[this.currentMoveIndex];
            let piece = this.chessboard.getPiece(move.to);
            if (move.promotion){
                this.chessboard.removePiece(move.to);
                let fenChar = move.color === "b" ? move.piece : move.piece.toUpperCase();
                piece = this.chessboard.addPiece(fenChar, move.to);
            }
            if (move.captured){
                let captureFenChar = move.color === "w" ? move.captured : move.captured.toUpperCase();
                this.playerInfo.removeCapture(captureFenChar);
                this.chessboard.addPiece(captureFenChar, move.to);
            }
            
            // this.chessboard.clearSourceAndTargetHighlights();
            this.chessboard.highlightTarget(move.to);
            
            let castling = this.getCastling(move, false);
            if (castling){
                this.chessboard.highlightSource(castling.to);
            }
            let transitionInfo:Transition.Info = {
                cancelReason:undefined,
                direction:"back", 
                piece:piece!,
                from:move.from,
                to:move.to,
                castling: castling
            }
            this.moveTransitions.move(transitionInfo, this.shortTransitionDuration, () =>{
                //OnTransitionEnd
                this.finishMoveBack(transitionInfo, false);
            }, () =>{
                //OnTransitionCancel
                // If cancelled by click back then finish moving back
                if (transitionInfo.cancelReason === "moveBack" || transitionInfo.cancelReason === "rotate"){
                    this.finishMoveBack(transitionInfo, true);
                }
                // If cancelled by click forward then redo capture and promotion
                else{
                    if (move.captured){
                        let captureFenChar = move.color === "w" ? move.captured : move.captured.toUpperCase();
                        this.chessboard.removePiece(move.to);
                        this.playerInfo.addCapture(captureFenChar);
                        this.chessboard.setPiecePosition(transitionInfo.piece, move.to);
                    }
                    if (move.promotion){
                        this.chessboard.removePiece(move.from);
                        let fenChar = move.color === "b" ? move.piece : move.piece.toUpperCase();
                        piece = this.chessboard.addPiece(fenChar, move.to);
                    }
                    if (this.state === "play" || this.state === "forward"){
                        this.moveForward();
                    }
                }
            });
        }
    }
    private finishMoveBack(info:Transition.Info, jumpToNextMove:boolean){
        this.chessboard.setPiecePosition(info.piece, info.from);
        this.chessboard.highlightSource(info.from);
        if (info.castling){
            this.chessboard.setPiecePosition(info.castling.rook, info.castling.from);
            this.chessboard.highlightTarget(info.castling.from);
        }
        if (this.currentMoveIndex > -1){
            this.currentMoveIndex--;
            if (jumpToNextMove){
                this.moveBack();
            }
            else if (this.state === "rewind"){
                this.timeoutId = setTimeout(()=>{
                    if (this.state === "rewind"){
                        this.moveBack();
                    }
                }, this.shortDelayBetweenMoves);
            }
        }
    }
    private getCastling(move:Move, isForward:boolean){
        if (move.san[0] === "O"){
            let from = move.color === "w" ? (move.san === "O-O" ? "h1" : "a1") : (move.san === "O-O" ? "h8" : "a8");
            let to = move.color === "w" ? (move.san === "O-O" ? "f1" : "d1") : (move.san === "O-O" ? "f8": "d8");
            let rook = this.chessboard.getPiece(isForward ? from : to)!;
            return {rook, from, to};
        }
        return undefined;
    }
}
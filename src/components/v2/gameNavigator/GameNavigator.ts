import Chessboard from "../chessboard/Chessboard";
import Shared from "../chessboard/Shared";
import PlayerInfo from "./PlayerInfo";
import {Transitions, TransitionInfo} from "./Transitions";
import PieceFactory from "../chessboard/PieceFactory";
import Piece from "../chessboard/Piece";
import { Castling, getCastling } from "./Castling";
import { Move } from "chess.js";
import Game from "./Game";
import "./gameNavigator.css";
import { Callbacks } from "./Callbacks";

type State = "start" | "rewind" | "play" | "pause" | "forward" | "end";

export default class GameNavigator{
    chessboard:Chessboard;
    callbacks = new Callbacks();
    moves:Move[] = [];
    private isRotated:boolean;
    private playerInfo:PlayerInfo;
    private transitions:Transitions;
    private state:State = "start";
    private moveIndex = 0;
    private shortDelayBetweenMoves = 100;
    private longDelayBetweenMoves = 1000;
    private shortTransitionDuration = "300ms";
    private longTransitionDuration = "1000ms";
    private timeoutId:NodeJS.Timeout|undefined;

    constructor(container:HTMLElement, fen:string, isRotated:boolean){
        let boardContainer = document.createElement("div");
        container.appendChild(boardContainer);
        this.chessboard = new Chessboard(boardContainer, fen, isRotated);
        this.playerInfo = new PlayerInfo(container, fen, isRotated);
        this.transitions = new Transitions(this.chessboard, isRotated);
        this.isRotated = isRotated;
    }
    addMove(move:Move){
        this.moves.push(move);
        this.moveIndex = this.moves.length -1;
        if (this.callbacks.onMoveAdded){
            this.callbacks.onMoveAdded(move, this.moves.length -1);
        }
    }
    rotate(){
        this.isRotated = !this.isRotated;
        let stateBefore = this.state;
        this.state = "pause";
        if (stateBefore === "play" || stateBefore === "forward"){
            this.move(false);
        }
        else if (stateBefore === "rewind"){
            this.move(true);
        }
        this.chessboard.rotate();
        this.playerInfo.rotate();
        this.transitions.rotate();
        this.state = stateBefore;
        if (stateBefore === "play" || stateBefore === "forward"){
            this.move(true);
        }
        else if (stateBefore === "rewind"){
            this.move(false);
        }
    }
    loadGame(game:Game){
        this.chessboard.setFen(Shared.startFEN, true);
        this.playerInfo.setPlayerNames(game.blackPlayer, game.whitePlayer);
        this.playerInfo.setScoreAndCaputereByFen(Shared.startFEN);
        this.moves = game.moves;
        this.moveIndex = -1;
        this.state = "start";
        if (this.callbacks.onGameLoaded){
            this.callbacks.onGameLoaded(this.moves);
        }
    }
    rewind(){
        this.state = "rewind";
        this.move(false);
    }
    previous(){
        if (this.state === "forward"){
            this.state = "pause";
        }
        this.move(false);
    }
    play(){
        this.state = "play";
        this.move(true);
    }
    pause(){
        this.state = "pause";
    }
    next(){
        if (this.state === "rewind"){
            this.state = "pause";
        }
        this.move(true);
    }
    forward(){
        this.state = "forward";
        this.move(true);
    }
    goToMove(index:number){
        clearTimeout(this.timeoutId);
        if (this.transitions.current){
            this.transitions.cancel();
        }
        this.moveIndex = index;
        if (index === -1){
            this.state = "start";
            let move = this.moves[0];
            this.chessboard.setFen(move.before, true);
            this.playerInfo.setScoreAndCaputereByFen(move.before);
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
            let castling = getCastling(this.chessboard, move, true);
            if (castling){
                this.chessboard.highlightSource(castling.to);
            }
        }
        if (this.callbacks.onGoToMove){
            this.callbacks.onGoToMove(index);
        }
    }
    private async move(isForward:boolean){
        clearTimeout(this.timeoutId);
        if (this.transitions.current){
            let transition = this.transitions.current;
            let piece = transition.piece;
            let move = transition.move;
            let castling = transition.castling;
            this.transitions.cancel();
            if (isForward === transition.isForward){ // If direction has not changed
                this.finishMove(isForward, piece, move, castling);
            }
            else if (isForward){//Moving back was cancelled so recapture and repromote if necessary
                if (move.captured){//recapture
                    this.chessboard.removePieceBySquareKey(move.to);
                    this.playerInfo.addCapture(move);
                    this.chessboard.setPiecePosition(piece, move.to);
                }
                if (move.promotion){
                    let promotionFenChar = move.color === "b" ? move.promotion : move.promotion.toUpperCase();
                    this.chessboard.removePieceBySquareKey(move.to);
                    this.chessboard.addPiece(promotionFenChar, move.to);
                }
            }
            else{//Moving forward was cancelled so undo moveIndex++
                this.moveIndex--;
            }
        }
        if (isForward && this.moveIndex === this.moves.length -1){
            this.state = "end";
            return;
        }
        else if (!isForward && this.moveIndex === -1){
            this.chessboard.clearSourceAndTargetHighlights();
            this.state = "start";
            return;
        }
        if (isForward){
            this.moveIndex++;
        }
        if (this.callbacks.onMoveStart){
            this.callbacks.onMoveStart(this.moveIndex);
        }
        let move = this.moves[this.moveIndex];
        let piece = this.chessboard.getPiece(isForward ? move.from : move.to)!;
        let castling = getCastling(this.chessboard, move, isForward);
        if (isForward){
            this.chessboard.highlightSource(move.from);
            if (castling){
                this.chessboard.highlightTarget(castling.from);
            }
        }
        else{
            this.chessboard.highlightTarget(move.to);
            if (castling){
                this.chessboard.highlightSource(castling.to);
            }
            if (move.promotion){
                this.chessboard.removePieceBySquareKey(move.to);
                let fenChar = move.color === "b" ? move.piece : move.piece.toUpperCase();
                piece = PieceFactory.get(fenChar);
                Shared.setPosition(piece.element, move.to, this.isRotated);
            }
            if (move.captured){
                this.playerInfo.undoCapture(move);
                let capturedFenChar = move.color === "b" ? move.captured.toUpperCase() : move.captured;
                this.chessboard.addPiece(capturedFenChar, move.to);
            }
        }
        let transitionInfo:TransitionInfo = { isForward, piece, move, castling }

        let duration = this.state === "play" ? this.longTransitionDuration : this.shortTransitionDuration;
        await this.transitions.move(transitionInfo, duration, () =>{
            //OnTransitionEnd
            this.finishMove(isForward, piece, move, castling);
        });
    }
    finishMove(isForward:boolean, piece:Piece, move:Move, castling:Castling|undefined){
        if (castling){
            this.chessboard.setPiecePosition(castling.rook, isForward ? castling.to : castling.from);
            this.chessboard.setPiecePosition(piece, isForward ? move.to : move.from);
            this.chessboard.highlightSource(isForward ? castling.to : castling.from);
            this.chessboard.highlightTarget(isForward ? move.to : move.from);
        }
        else if (isForward){
            if (move.captured){
                this.chessboard.removePieceBySquareKey(move.to);
                this.playerInfo.addCapture(move)
            }
            if (move.promotion){
                let promotionFenChar = move.color === "b" ? move.promotion : move.promotion.toUpperCase();
                this.chessboard.removePieceBySquareKey(move.from);
                this.chessboard.addPiece(promotionFenChar, move.to);
            }
            else{
                this.chessboard.setPiecePosition(piece, move.to);
                this.chessboard.highlightTarget(move.to);
            }
        }
        else{
            this.chessboard.setPiecePosition(piece, move.from);
            this.chessboard.highlightSource(move.from);
        }
        if (!isForward){
            this.moveIndex--;
        }
        if (this.callbacks.onMoveEnd){
            this.callbacks.onMoveEnd(this.moveIndex, move, isForward);
        }
        if(this.state === "play" || this.state === "forward" || this.state === "rewind"){
            this.timeoutId = setTimeout(()=>{
                if (this.state === "play" || this.state === "forward" || this.state === "rewind"){
                    this.move(isForward);
                }
            }, this.state === "play" ? this.longDelayBetweenMoves : this.shortDelayBetweenMoves);
        }
    }
}
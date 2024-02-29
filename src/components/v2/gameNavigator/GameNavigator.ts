import Chessboard from "../chessboard/Chessboard";
import PieceLayer from "../chessboard/Layers/PieceLayer";
import PieceElementFactory from "../chessboard/PieceElementFactory";
import Piece from "../chessboard/Piece";
import Shared from "../chessboard/Shared";
import PlayerInfo from "./PlayerInfo";
import Game from "./Game";
import { Transitions, TransitionInfo } from "./Transitions";
import { Castling, getCastling } from "./Castling";
import { Chess, Move } from "chess.js";
import { Callbacks } from "./Callbacks";
import "./gameNavigator.css";

type State = "start" | "rewind" | "play" | "pause" | "forward" | "end";

export default class GameNavigator{
    chessboard:Chessboard;
    boardContainer:HTMLElement;
    callbacks = new Callbacks();
    game:Game;
    pieceLayer:PieceLayer;
    private isRotated:boolean;
    private playerInfo:PlayerInfo;
    private isResultShowing = false;
    private transitions:Transitions;
    private state:State = "start";
    private moveIndex = 0;
    private shortDelayBetweenMoves = 100;
    private longDelayBetweenMoves = 1000;
    private shortTransitionDuration = "100ms";
    private longTransitionDuration = "1000ms";
    private timeoutId:NodeJS.Timeout|undefined;

    constructor(container:HTMLElement, fen:string, isRotated:boolean){
        this.boardContainer = Shared.addChild(container, "div", "board");
        this.chessboard = new Chessboard(this.boardContainer, fen, isRotated);
        this.playerInfo = new PlayerInfo(container, fen, isRotated);
        this.transitions = new Transitions(this.chessboard, isRotated);
        this.isRotated = isRotated;
        this.pieceLayer = this.chessboard.pieceLayer;
        if (fen === "" || fen === "start"){
            fen = Shared.startFEN;
        }
        let moves = new Chess(fen).history({verbose:true});
        this.game = {blackPlayer: "Black player", whitePlayer: "White player", moves: moves};
    }
    addMove(move:Move){
        this.game.moves.push(move);
        this.moveIndex = this.game.moves.length -1;
        if (this.callbacks.onMoveAdded){
            this.callbacks.onMoveAdded(move, this.game.moves.length -1);
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
        this.state = "pause";
        if (this.transitions.current){
            this.transitions.cancel();
        }
        this.chessboard.clearSourceAndTargetHighlights();
        this.game = game;
        this.chessboard.setFen(Shared.startFEN, true);
        this.playerInfo.setPlayerNames(game.blackPlayer, game.whitePlayer);
        this.playerInfo.setScoreAndCaputereByFen(Shared.startFEN);
        this.moveIndex = -1;
        this.state = "start";
        this.hideGameResult();
        if (this.callbacks.onGameLoaded){
            this.callbacks.onGameLoaded(this.game.moves);
        }
    }
    rewind(){
        this.state = "rewind";
        this.move(false);
    }
    previous(){
        if (this.state === "play" || this.state === "forward"){
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
        this.hideGameResult();
        clearTimeout(this.timeoutId);
        if (this.transitions.current){
            this.transitions.cancel();
        }
        this.moveIndex = index;
        if (index === -1){
            this.state = "start";
            let move = this.game.moves[0];
            this.chessboard.setFen(move.before, true);
            this.playerInfo.setScoreAndCaputereByFen(move.before);
            this.chessboard.clearSourceAndTargetHighlights();
        }
        else{
            let move = this.game.moves[index];
            this.chessboard.setFen(move.after, true);
            this.playerInfo.setScoreAndCaputereByFen(move.after);
            this.chessboard.highlightSourceAndTarget(move.from, move.to);
            let castling = getCastling(this.chessboard, move, true);
            if (castling){
                this.chessboard.highlightSource(castling.to);
            }
            if (index === this.game.moves.length -1){
                this.state = "end";
                this.showGameResult();
            }
            else{
                this.state = "pause";
            }
        }
        if (this.callbacks.onGoToMove){
            this.callbacks.onGoToMove(index);
        }
    }
    private async move(isForward:boolean){
        if (!isForward || this.moveIndex !== this.game.moves.length -1){
            this.hideGameResult();
        }
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
                    this.removePieceBySquareKey(move.to);
                    this.playerInfo.addCapture(move);
                    this.pieceLayer.setPosition(piece);
                }
                if (move.promotion){
                    let promotionFenChar = move.color === "b" ? move.promotion : move.promotion.toUpperCase();
                    this.promoteOrUnpromote(piece, promotionFenChar);
                }
                if (this.state === "play" || this.state === "forward"){
                    this.move(true);
                }
            }
            else{//Moving forward was cancelled so undo moveIndex++
                this.moveIndex--;
                if (this.state === "rewind"){
                    this.move(false);
                }
            }
        }
        else{
            if (isForward && this.moveIndex === this.game.moves.length -1){
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
            let move = this.game.moves[this.moveIndex];
            let piece = this.pieceLayer.getPiece(isForward ? move.from : move.to)!;
            this.putOnTop(piece);
            let castling = getCastling(this.chessboard, move, isForward);
            if (castling){
                this.putOnTop(castling.rook);
            }
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
                else{
                    if (move.captured){
                        this.removeFromPositionRecord(move.to);//Remove piece from position record before animation so captured piece can be restored
                        let capturedFenChar = move.color === "b" ? move.captured.toUpperCase() : move.captured;
                        this.pieceLayer.addPiece(capturedFenChar, move.to);
                        this.playerInfo.undoCapture(move);
                    }
                    if (move.promotion){
                        let fenChar = move.color === "b" ? move.piece : move.piece.toUpperCase();
                        this.pieceLayer.group.removeChild(piece.element);
                        piece.element = PieceElementFactory.get(fenChar);
                        this.pieceLayer.group.appendChild(piece.element);
                        Shared.setPosition(piece.element, move.to, this.isRotated);
                    }
                }
            }
            let transitionInfo:TransitionInfo = { isForward, piece, move, castling }
    
            let duration = this.state === "play" ? this.longTransitionDuration : this.shortTransitionDuration;
            await this.transitions.move(transitionInfo, duration, () =>{
                //OnTransitionEnd
                this.finishMove(isForward, piece, move, castling);
            });
        }
    }
    finishMove(isForward:boolean, piece:Piece, move:Move, castling:Castling|undefined){
        let source = isForward ? move.from : move.to;
        let target = isForward ? move.to : move.from;
        piece.squareKey = target;
        if (castling){
            castling.rook.squareKey = isForward ? castling.to : castling.from;
            this.removeFromPositionRecord(source);
            this.removeFromPositionRecord(isForward ? castling.from : castling.to);
            this.pieceLayer.setPosition(piece);
            this.pieceLayer.setPosition(castling.rook);
            this.chessboard.highlightSource(isForward ? castling.to : castling.from);
            this.chessboard.highlightTarget(isForward ? move.to : move.from);
        }
        else{
            if (isForward){
                if (move.captured){
                    this.removePieceBySquareKey(move.to);
                    this.playerInfo.addCapture(move)
                }
                if (move.promotion){
                    let promotionFenChar = move.color === "b" ? move.promotion : move.promotion.toUpperCase();
                    this.promoteOrUnpromote(piece, promotionFenChar);
                    this.playerInfo.setScoreAndCaputereByFen(move.after);
                }
                this.removeFromPositionRecord(move.from);
                this.pieceLayer.setPosition(piece);
                this.chessboard.highlightTarget(move.to);
            }
            else{//Finish move backward
                if (!move.captured){
                    this.removeFromPositionRecord(move.to);
                }
                this.pieceLayer.setPosition(piece);
                this.chessboard.highlightSource(move.from);
            }
        } 
        if (!isForward){
            this.moveIndex--;
        }
        if (this.callbacks.onMoveEnd){
            this.callbacks.onMoveEnd(this.moveIndex, move, isForward);
        }
        if (this.moveIndex === this.game.moves.length -1){
            this.showGameResult();
        }
        else if(this.state === "play" || this.state === "forward" || this.state === "rewind"){
            this.timeoutId = setTimeout(()=>{
                if (this.state === "play" || this.state === "forward" || this.state === "rewind"){
                    this.move(isForward);
                }
            }, this.state === "play" ? this.longDelayBetweenMoves : this.shortDelayBetweenMoves);
        }
    }
    private showGameResult(){
        if (this.game.result){
            this.chessboard.showGameResult(this.game.result);
            this.isResultShowing = true;
        }
    }
    private hideGameResult(){
        if (this.isResultShowing){
            this.isResultShowing = false;
            this.chessboard.hideGameResult();
        }
    }
    private putOnTop(piece:Piece){
        this.pieceLayer.group.appendChild(piece.element);
    }
    private removeFromPositionRecord(squareKey:string){
        this.pieceLayer.positions[squareKey] = undefined;
    }
    private removePieceBySquareKey(squareKey:string){
        let piece = this.pieceLayer.positions[squareKey]!;
        this.pieceLayer.group.removeChild(piece.element);
        this.pieceLayer.positions[squareKey] = undefined;
        return piece;
    }
    private promoteOrUnpromote(piece:Piece, newFenChar:string){
        this.pieceLayer.group.removeChild(piece.element);
        piece.element = PieceElementFactory.get(newFenChar);
        this.pieceLayer.group.appendChild(piece.element);
        piece.fenChar = newFenChar;
    }
}
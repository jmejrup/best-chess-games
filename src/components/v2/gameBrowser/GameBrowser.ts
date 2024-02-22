import Chessboard from "../chessboard/Chessboard";
import Shared from "../chessboard/Shared";
import { Move } from "chess.js";
import PlayerInfo from "./PlayerInfo";
import MoveTransitions from "./MoveTransitions";
import "./gameBrowser.css";
import Game from "./Game";
import { CastlingInfo } from "./CastlingInfo";
import Piece from "../chessboard/Piece";
import TransitionInfo from "./TransitionInfo";

export default class GameBrowser{
    chessboard:Chessboard;
    isRotated:boolean;
    playerInfo:PlayerInfo;
    moves:Move[] = [];
    currentMoveIndex = 0;
    moveTransitions:MoveTransitions;
    currentState = "pause";
    delayBetweenMoves = 50;

    constructor(container:HTMLElement, fen:string, isRotated:boolean){
        this.chessboard = new Chessboard(container, fen, isRotated);
        this.playerInfo = new PlayerInfo(container, fen, isRotated);
        this.moveTransitions = new MoveTransitions(this.chessboard, isRotated);
        this.isRotated = isRotated;
    }
    rotate(){
        this.isRotated = !this.isRotated;
        this.playerInfo.rotate(this.isRotated);
        this.chessboard.rotate();
    }
    loadGame(game:Game){
        this.chessboard.setFen(Shared.startFEN, true);
        this.playerInfo.setPlayerNames(game.blackPlayer, game.whitePlayer);
        this.playerInfo.setScoreAndCaputereByFen(Shared.startFEN);
        this.moves = game.moves;
        this.currentMoveIndex = -1;
    }
    stepBack(){
        if (this.moveTransitions.currentTransitions){
            if (this.moveTransitions.currentTransitions[0].direction === "forward"){
                this.moveTransitions.cancelTransition();
                return;
            }
            else{
                let transitions = this.moveTransitions.currentTransitions;
                this.moveTransitions.cancelTransition();
                this.finishMoveBack(transitions, true);
                return;
            }
        }
        if (this.currentMoveIndex > -1){
            if (this.currentState === "play" || this.currentState === "fastForward"){
                this.currentState = "pause";
            }
            let move = this.moves[this.currentMoveIndex];
            let piece = this.chessboard.getPiece(move.to);
            if (move.captured){
                let fenChar = move.color === "w" ? move.captured : move.captured.toUpperCase();
                if (this.chessboard.getPiece(move.to)!.fenChar !== fenChar){
                    this.playerInfo.removeCapture(fenChar);
                    this.chessboard.addPiece(fenChar, move.to);
                }
            }
            if (move.promotion){
                this.chessboard.removePiece(move.to);
                let fenChar = move.color === "b" ? move.piece : move.piece.toUpperCase();
                piece = this.chessboard.addPiece(fenChar, move.to);
            }
            this.chessboard.clearSourceAndTargetHighlights();
            this.chessboard.highlightSource(move.from);
            let transitions: TransitionInfo[] = [];
            transitions.push({direction:"back", piece: piece!, from:move.from, to: move.to})
            let castlingInfo = this.getCastlingInfo(move);
            if (castlingInfo){
                let rook = this.chessboard.getPiece(castlingInfo.rookTo);
                transitions.push({direction:"back", piece:rook!, from:castlingInfo.rookFrom, to: castlingInfo.rookTo});
                this.chessboard.highlightTarget(castlingInfo.rookFrom);
            }
            this.moveTransitions.move(transitions, () =>{
                //OnTransitionEnd
                this.finishMoveBack(transitions, false);
            }, () =>{
                //OnTransitionCancel
                if (move.captured){
                    let fenChar = move.color === "w" ? move.captured : move.captured.toUpperCase();
                    if (this.chessboard.getPiece(move.to)!.fenChar !== fenChar){
                        this.playerInfo.removeCapture(fenChar);
                        this.chessboard.addPiece(fenChar, move.to);
                    }
                }
                if (move.promotion){
                    this.chessboard.removePiece(move.to);
                    let fenChar = move.color === "b" ? move.piece : move.piece.toUpperCase();
                    piece = this.chessboard.addPiece(fenChar, move.to);
                }
            });
        }
    }
    finishMoveBack(transitions:TransitionInfo[], jumpToNextMove:boolean){
        transitions.forEach(trans =>{
            trans.piece.squareKey = trans.from;
            this.chessboard.setPiecePosition(trans.piece);
        });
        if (this.currentMoveIndex > -1){
            this.currentMoveIndex--;
            if (jumpToNextMove){
                this.stepBack();
            }
            else if (this.currentState === "rewind"){
                setTimeout(()=>{
                    if (this.currentState === "rewind"){
                        this.stepBack();
                    }
                },this.delayBetweenMoves);
            }
        }
    }
    stepForward(){
        if (this.moveTransitions.currentTransitions){
            if (this.moveTransitions.currentTransitions[0].direction === "back"){
                this.moveTransitions.cancelTransition();
                return;
            }
        }
        if (this.currentMoveIndex < this.moves.length -1){
            let move = this.moves[this.currentMoveIndex +1];
            let castlingInfo = this.getCastlingInfo(move);
            if (this.moveTransitions.currentTransitions){
                if (this.moveTransitions.currentTransitions[0].direction === "forward"){
                    this.moveTransitions.cancelTransition();
                    let castlingInfo = this.getCastlingInfo(move);
                    this.finishMoveForward(move, castlingInfo, true);
                    return;
                }
            }
            this.chessboard.clearSourceAndTargetHighlights();
            this.chessboard.highlightSource(move.from);
            let piece = this.chessboard.getPiece(move.from)!;
            let transitions: TransitionInfo[] = [];
            transitions.push({direction:"forward", piece, from:move.from, to:move.to});
            if (castlingInfo){
                this.chessboard.highlightTarget(castlingInfo.rookFrom);
                let rook = this.chessboard.getPiece(castlingInfo.rookFrom)!;
                transitions.push({direction:"forward", piece:rook, from:castlingInfo.rookFrom, to: castlingInfo.rookTo});
            }
            this.moveTransitions.move(transitions, () =>{
                //OnTransitionEnd
                this.finishMoveForward(move, castlingInfo, false);
            });
        }
    }
    private finishMoveForward(move:Move, castlingInfo:CastlingInfo|null, jumpToNextMove:boolean){
        if (castlingInfo){
            this.chessboard.removePiece(castlingInfo.rookFrom);
            let fenChar = move.color === "w" ? "R" : "r";
            this.chessboard.addPiece(fenChar, castlingInfo.rookTo);
            this.chessboard.highlightSource(castlingInfo.rookTo);
        }
        else if (move.captured){
            let piece = this.chessboard.getPiece(move.to)!;
            this.playerInfo.addCapture(piece.fenChar)
            this.chessboard.removePiece(move.to);
        }
        let fenChar = move.color === "b" ? (move.promotion || move.piece) : (move.promotion || move.piece).toUpperCase();
        this.chessboard.removePiece(move.from);
        this.chessboard.addPiece(fenChar, move.to);
        this.chessboard.highlightTarget(move.to);
        this.currentMoveIndex++;
        if (this.currentMoveIndex < this.moves.length -1){
            if (jumpToNextMove){
                this.stepForward();
            }
            else if(this.currentState === "play" || this.currentState === "fast-forward"){
                setTimeout(()=>{
                    if (this.currentState === "play" || this.currentState === "fast-forward"){
                        this.stepForward();
                    }
                },this.delayBetweenMoves);
            }
        }
    }
    play(){
        this.currentState = "play";
        this.stepForward();
    }
    pause(){
        this.currentState = "pause";
        if (this.moveTransitions.currentTransitions){
            this.stepForward();
        }
    }
    rewind(){

    }
    goToStart(){

    }
    goToEnd(){

    }
    goToMove(index:number){

    }
    private getCastlingInfo(move:Move){
        if (move.san[0] === "O"){
            let rookFrom = move.color === "w" ? (move.san === "O-O" ? "h1" : "a1") : (move.san === "O-O" ? "h8" : "a8");
            let rookTo = move.color === "w" ? (move.san === "O-O" ? "f1" : "d1") : (move.san === "O-O" ? "f8": "d8");
            return {rookFrom, rookTo};
        }
        return null;
    }
}
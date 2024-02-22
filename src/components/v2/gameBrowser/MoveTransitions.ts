import Chessboard from "../chessboard/Chessboard";
import Shared from "../chessboard/Shared";
import Piece from "../chessboard/Piece";
import { Move } from "chess.js";
import { CastlingInfo } from "./CastlingInfo";
import TransitionInfo from "./TransitionInfo";

export default class MoveTransitions{
    chessboard:Chessboard;
    isRotated:boolean;
    timeOutId:NodeJS.Timeout|undefined;
    currentTransitions:TransitionInfo[]|undefined;
    duration = "5000ms";

    constructor(chessboard:Chessboard, isRotated:boolean){
        this.chessboard = chessboard;
        this.isRotated = isRotated;
    }
    cancelTransition(){
        clearTimeout(this.timeOutId);
        if (this.currentTransitions){
            this.currentTransitions.forEach(trans =>{
                trans.piece.element.style.transitionProperty = "";
                trans.piece.element.style.transitionDuration = "";
                trans.piece.element.style.transform = "";
            });
            this.currentTransitions[0].piece.element.ontransitionend = null;
            this.currentTransitions = undefined;
        }
    }
    move(transitions:TransitionInfo[], onTransitionEnd:Function, onTransitionCancel?:Function){
        this.currentTransitions = transitions;
        transitions.forEach(trans => {
            trans.piece.element.style.transitionProperty = "transform";
            trans.piece.element.style.transitionDuration = this.duration;
        });
        this.timeOutId = setTimeout(() => {
            transitions.forEach(trans =>{
                let to = trans.direction === "forward" ? trans.to : trans.from;
                let cordsTo = Shared.getCordinatesBySquareKey(to, this.isRotated);
                trans.piece.element.style.transform = `translate(${cordsTo.x * 12.5}%, ${cordsTo.y * 12.5}%)`;
            });
            transitions[0].piece.element.ontransitionend = () =>{
                if (this.currentTransitions){
                    this.currentTransitions.forEach(trans =>{
                        trans.piece.element.style.transitionProperty = "";
                        trans.piece.element.style.transitionDuration = "";
                        trans.piece.element.style.transform = "";
                    });
                    this.currentTransitions[0].piece.element.ontransitionend = null;
                    this.currentTransitions = undefined;
                    onTransitionEnd();
                }
            }; 
            transitions[0].piece.element.ontransitioncancel = () =>{
                if (onTransitionCancel){
                    onTransitionCancel();
                }
            }; 
        },0);
    }
}
import Chessboard from "../chessboard/Chessboard";
import Shared from "../chessboard/Shared";
import Piece from "../chessboard/Piece";
import Castling from "./Castling";
import { Move } from "chess.js";

export type TransitionInfo = {
    isForward:boolean;
    piece:Piece,
    move:Move,
    castling:Castling|undefined
}

export class Transitions{
    chessboard:Chessboard;
    isRotated:boolean;
    current:TransitionInfo|undefined;

    constructor(chessboard:Chessboard, isRotated:boolean){
        this.chessboard = chessboard;
        this.isRotated = isRotated;
    }
    rotate(){
        this.isRotated = !this.isRotated;
    }
    cancel(){
        if (this.current){
            let element = this.current.piece.element;
            this.removeTransition(element);

            let castling = this.current.castling;
            if (castling){
                this.removeTransition(castling.rook.element);
            }
            this.current = undefined;
        }
    }
    async move(transition:TransitionInfo, duration:string, onTransitionEnd:Function){
        this.chessboard.putOnTop(transition.piece);
        if (transition.castling){
            this.chessboard.putOnTop(transition.castling.rook);
        }
        this.makeFirefoxHappy(transition);
        this.makeChromeHappy();
        this.current = transition;
        transition.piece.element.ontransitionend = () =>{
            this.removeTransition(transition.piece.element);
            if (transition.castling){
                this.removeTransition(transition.castling.rook.element);
            }
            this.current = undefined;
            onTransitionEnd();
        }; 
        this.startTransition(transition.isForward, duration, transition.piece.element, transition.move.from, transition.move.to);
        if (transition.castling){
            this.startTransition(transition.isForward, duration, transition.castling.rook.element, transition.castling.from, transition.castling.to);
        }
    }
    private makeFirefoxHappy(transition:TransitionInfo){
        let cords = Shared.getCordinatesBySquareKey(transition.piece.squareKey!, this.isRotated);
        transition.piece.element.style.transform = `translate(${cords.x * 12.5}%, ${cords.y * 12.5}%)`;
        if (transition.castling){
            let cords = Shared.getCordinatesBySquareKey(transition.castling.rook.squareKey!, this.isRotated);
            transition.castling.rook.element.style.transform = `translate(${cords.x * 12.5}%, ${cords.y * 12.5}%)`;
        }
    }
    private makeChromeHappy() {
        void(document.documentElement.offsetHeight);//Trigger reflow
    }
    private startTransition(isForward:boolean, duration:string, element:SVGGElement, from:string, to:string){
        element.style.transform = "";
        element.style.transitionProperty = "transform";
        element.style.transitionDuration = duration;
        let dest = isForward ? to : from;
        let cords = Shared.getCordinatesBySquareKey(dest, this.isRotated);
        element.style.transform = `translate(${cords.x * 12.5}%, ${cords.y * 12.5}%)`;
    }
    private removeTransition(element:SVGGElement){
        element.style.transitionProperty = "";
        element.style.transitionDuration = "";
        element.style.transform = "";
        element.ontransitioncancel = null;
        element.ontransitionend = null;
    }
}
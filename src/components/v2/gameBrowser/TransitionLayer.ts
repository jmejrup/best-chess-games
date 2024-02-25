import Chessboard from "../chessboard/Chessboard";
import Shared from "../chessboard/Shared";
import Transition from "./Transition";

export default class TransitionLayer{
    chessboard:Chessboard;
    isRotated:boolean;
    currentTransition:Transition.Info|undefined;
    timeoutId:NodeJS.Timeout|undefined;

    constructor(chessboard:Chessboard, isRotated:boolean){
        this.chessboard = chessboard;
        this.isRotated = isRotated;
    }
    rotate(){
        this.isRotated = !this.isRotated;
    }
    cancelTransition(reason:Transition.CancelReason){
        if (this.currentTransition){
            this.currentTransition.cancelReason = reason;

            let element = this.currentTransition.piece.element;
            element.style.transitionProperty = "";
            element.style.transitionDuration = "";
            element.style.transform = "";

            let castling = this.currentTransition.castling;
            if (castling){
                let element = castling.rook.element;
                element.style.transitionProperty = "";
                element.style.transitionDuration = "";
                element.style.transform = "";
            }
        }
    }
    async move(info:Transition.Info, duration:string, onTransitionEnd:Function, onTransitionCancel:Function){
        clearTimeout(this.timeoutId);
        this.chessboard.putOnTop(info.piece);
        if (info.castling){
            this.chessboard.putOnTop(info.castling.rook);
        }
        this.timeoutId = await setTimeout(() =>{
            this.currentTransition = info;
            info.piece.element.ontransitionend = () =>{
                this.removeTransition(info.piece.element);
                if (info.castling){
                    this.removeTransition(info.castling.rook.element);
                }
                this.currentTransition = undefined;
                onTransitionEnd();
            }; 
            info.piece.element.ontransitioncancel = () =>{
                this.removeTransition(info.piece.element);
                if (info.castling){
                    this.removeTransition(info.castling.rook.element);
                }
                this.currentTransition = undefined;
                onTransitionCancel();
                this.currentTransition = undefined;
            };
            this.startTransition(info.direction, duration, info.piece.element, info.from, info.to);
            if (info.castling){
                this.startTransition(info.direction, duration, info.castling.rook.element, info.castling.from, info.castling.to);
            }
        },10);
    }
    startTransition(direction:Transition.Direction, duration:string, element:SVGGElement, from:string, to:string){
        element.style.transform = "";
        element.style.transitionProperty = "transform";
        element.style.transitionDuration = duration;
        let dest = direction === "forward" ? to : from;
        let cords = Shared.getCordinatesBySquareKey(dest, this.isRotated);
        element.style.transform = `translate(${cords.x * 12.5}%, ${cords.y * 12.5}%)`;
    }
    removeTransition(element:SVGGElement){
        element.style.transitionProperty = "";
        element.style.transitionDuration = "";
        element.style.transform = "";
        element.ontransitioncancel = null;
        element.ontransitionend = null;
    }
}
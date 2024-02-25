// import Chessboard from "../chessboard/Chessboard";
// import Shared from "../chessboard/Shared";
// import Piece from "../chessboard/Piece";
// import Transition from "./Transition";

// export default class MoveTransitions{
//     chessboard:Chessboard;
//     isRotated:boolean;
//     currentTransition:Transition.Info|undefined;

//     constructor(chessboard:Chessboard, isRotated:boolean){
//         this.chessboard = chessboard;
//         this.isRotated = isRotated;
//     }
//     rotate(){
//         this.isRotated = !this.isRotated;
//     }
//     cancelTransition(reason:Transition.CancelReason){
//         if (this.currentTransition){
//             this.currentTransition.cancelReason = reason;

//             let piece = this.currentTransition.piece;
//             piece.element.style.transitionProperty = "";
//             piece.element.style.transitionDuration = "";
//             piece.element.style.transform = "";

//             let castling = this.currentTransition.castling;
//             if (castling){
//                 castling.rook.element.style.transitionProperty = "";
//                 castling.rook.element.style.transitionDuration = "";
//                 castling.rook.element.style.transform = "";
//             }
//         }
//     }
//     move(info:Transition.Info, duration:string, onTransitionEnd:Function, onTransitionCancel:Function){
//         this.currentTransition = info;
//         this.prepareTransition(info.direction, duration, info.piece, info.from, info.to);
//         if (info.castling){
//             this.prepareTransition(info.direction, duration, info.castling.rook, info.castling.from, info.castling.to);
//         }
//         info.piece.element.ontransitionend = () =>{
//             this.removeTransition(info.piece);
//             if (info.castling){
//                 this.removeTransition(info.castling.rook);
//             }
//             this.currentTransition = undefined;
//             onTransitionEnd();
//         }; 
//         info.piece.element.ontransitioncancel = () =>{
//             this.removeTransition(info.piece);
//             if (info.castling){
//                 this.removeTransition(info.castling.rook);
//             }
//             this.currentTransition = undefined;
//             onTransitionCancel();
//         }; 
//     }
//     prepareTransition(direction:Transition.Direction, duration:string, piece:Piece, from:string, to:string){
//         piece.element.style.transitionProperty = "transform";
//         piece.element.style.transitionDuration = duration;
//         let dest = direction === "forward" ? to : from;
//         let cords = Shared.getCordinatesBySquareKey(dest, this.isRotated);
//         piece.element.style.transform = `translate(${cords.x * 12.5}%, ${cords.y * 12.5}%)`;
//     }
//     removeTransition(piece:Piece){
//         piece.element.style.transitionProperty = "";
//         piece.element.style.transitionDuration = "";
//         piece.element.style.transform = "";
//         piece.element.ontransitioncancel = null;
//         piece.element.ontransitionend = null;
//     }
// }
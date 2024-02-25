import Piece from "../chessboard/Piece";
import { Castling } from "./Castling";

namespace Transition{
    export type Info = {
        cancelReason:CancelReason|undefined;
        direction:Direction;
        piece:Piece,
        from:string,
        to:string
        castling:Castling|undefined
    }
    export type Direction = "forward" | "back";
    export type CancelReason = "moveForward" | "moveBack" | "rotate" | "stop";
}
export default Transition;


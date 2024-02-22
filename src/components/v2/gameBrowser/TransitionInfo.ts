import Piece from "../chessboard/Piece";

export default interface TransitionInfo{
    direction:string,
    piece:Piece,
    from:string,
    to:string
}
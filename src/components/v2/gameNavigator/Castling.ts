import Piece from "../chessboard/Piece";

export default interface Castling{
    rook:Piece;
    from:string;
    to:string;
}
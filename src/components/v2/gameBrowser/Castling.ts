import Piece from "../chessboard/Piece";

export interface Castling{
    rook:Piece;
    from:string;
    to:string;
}
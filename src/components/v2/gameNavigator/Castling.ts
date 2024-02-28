import Chessboard from "../chessboard/Chessboard";
import Piece from "../chessboard/Piece";
import { Move } from "chess.js";

export interface Castling{
    rook:Piece;
    from:string;
    to:string;
}
export function getCastling(chessboard:Chessboard, move:Move, isForward:boolean){
    if (move.san[0] === "O"){
        let from = move.color === "w" ? (move.san === "O-O" ? "h1" : "a1") : (move.san === "O-O" ? "h8" : "a8");
        let to = move.color === "w" ? (move.san === "O-O" ? "f1" : "d1") : (move.san === "O-O" ? "f8": "d8");
        let rook = chessboard.pieceLayer.getPiece(isForward ? from : to)!;
        return {rook, from, to};
    }
    return undefined;
}
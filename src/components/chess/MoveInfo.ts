import { Chessboard } from "./Chessboard";
import { Move } from "chess.js";

export class MoveInfo{
    sourceSquare:HTMLElement;
    targetSquare:HTMLElement;
    piece:HTMLImageElement;
    castling:Castling | undefined;
    capturedPiece:HTMLImageElement | undefined;
    partialMoves:{piece:HTMLImageElement, destination:HTMLElement}[] = [];

    constructor(chessboard:Chessboard, move:Move, rewind:boolean){
        this.sourceSquare = chessboard.squares[move.from].element;
        this.targetSquare = chessboard.squares[move.to].element;
        this.piece = (rewind ? this.targetSquare.firstChild : this.sourceSquare.firstChild) as HTMLImageElement;
        
        let move1 = {piece:this.piece, destination: rewind ? this.sourceSquare : this.targetSquare};
        this.partialMoves.push(move1);

        if (move.flags === "k" || move.flags === "q"){
            this.castling = new Castling(chessboard, move, rewind);
            let move2 = {piece:this.castling.rook, destination: rewind ? this.castling.rookSourceSquare : this.castling.rookTargetSquare};
            this.partialMoves.push(move2);
        }
        else{
            if (rewind && move.captured){
                let fenChar = move.color === "w" ? move.captured : move.captured.toUpperCase();
                this.capturedPiece = chessboard.createPiece(fenChar);
            }
        }
    }
}
export class Castling{
    rookSourceSquare:HTMLElement;
    rookTargetSquare:HTMLElement;
    rook:HTMLImageElement;

    constructor(chessboard:Chessboard, move:Move, rewind:boolean){
        let rookMove = getCastlingRookMove(move.flags, move.color);
        this.rookSourceSquare = chessboard.squares[rookMove.from].element;
        this.rookTargetSquare = chessboard.squares[rookMove.to].element;
        this.rook = (rewind ? this.rookTargetSquare.firstChild : this.rookSourceSquare.firstChild) as HTMLImageElement;
    }
}
function getCastlingRookMove(flag:string, color:string){
    switch(flag){
        case "k":
            return color === "w" ? {from:"h1", to:"f1"} : {from:"h8", to:"f8"};
        default:
            return color === "w" ? {from:"a1", to:"d1"} : {from:"a8", to:"d8"};
    }
}
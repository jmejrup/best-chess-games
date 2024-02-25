import Piece from "./Piece";
import PieceElementFactory from "./PieceElementFactory";

namespace PieceFactory{
    export function get(fenChar:string, squareKey?:string){
        let element = PieceElementFactory.get(fenChar);
        return { fenChar, element, squareKey } as Piece;
    }
}
export default PieceFactory;
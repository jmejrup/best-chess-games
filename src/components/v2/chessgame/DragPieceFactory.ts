import {PieceFactory} from "../chessboard/PieceFactory";
import { DragPiece } from "./DragPiece";

const pieceTypes: Record<string, DragPiece> = {};

["p","n","b","r","q","k","P","N","B","R","Q","K"].forEach(fenChar =>{
    let svg = document.createElementNS("http://www.w3.org/2000/svg","svg") as SVGSVGElement;
    svg.setAttribute('viewBox', '0 0 100 100');
    let svgGroup = PieceFactory.get(fenChar);
    svg.appendChild(svgGroup);
    let dragPiece:DragPiece = {fenChar, svg};
    pieceTypes[fenChar] = dragPiece;
});
export namespace DragPieceFactory{
    export function get(fenChar:string){
        return pieceTypes[fenChar] as DragPiece;
    }
}

import PieceElementFactory from "../chessboard/PieceElementFactory";

const pieceTypes: Record<string, SVGSVGElement> = {};

["p","n","b","r","q","P","N","B","R","Q"].forEach(fenChar =>{
    let svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
    svg.setAttribute('viewBox', '0 0 100 100');
    let piece = PieceElementFactory.get(fenChar);
    svg.appendChild(piece);
    pieceTypes[fenChar] = svg as SVGSVGElement;
});
export namespace CapturePieceFactory{
    export function get(fenChar:string){
        return pieceTypes[fenChar].cloneNode(true) as SVGSVGElement;
    }
}



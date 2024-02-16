import PieceFactory from "../chessboard/PieceFactory";

const pieceTypes: Record<string, SVGSVGElement> = {};

["p","n","b","r","q","P","N","B","R","Q"].forEach(fenChar =>{
    let svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
    svg.setAttribute('viewBox', '0 0 800 800');
    let piece = PieceFactory.get(fenChar);
    svg.appendChild(piece);
    pieceTypes[fenChar] = svg as SVGSVGElement;
});
export namespace CapturePieceFactory{
    export function get(fenChar:string){
        return pieceTypes[fenChar].cloneNode(true) as SVGSVGElement;
    }
}



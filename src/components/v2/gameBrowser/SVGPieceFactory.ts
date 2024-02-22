import PieceFactory from "../chessboard/PieceFactory";

const pieceTypes: Record<string, SVGSVGElement> = {};

["p","n","b","r","q","k","P","N","B","R","Q","K"].forEach(fenChar =>{
    let svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
    svg.setAttribute('viewBox', '0 0 100 100');
    let piece = PieceFactory.get(fenChar);
    svg.appendChild(piece);
    pieceTypes[fenChar] = svg as SVGSVGElement;
});
namespace SVGPieceFactory{
    export function get(fenChar:string){
        return pieceTypes[fenChar].cloneNode(true) as SVGSVGElement;
    }
}
export default SVGPieceFactory;
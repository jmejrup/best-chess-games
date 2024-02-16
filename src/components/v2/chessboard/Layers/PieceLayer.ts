import Piece from "../Piece";
import PieceFactory from "../PieceFactory";
import Shared from "../Shared";

export default class PieceLayer{
    private group:SVGGElement;
    private isRotated:boolean;
    private positions:Record<string, Piece|null> = {};

    constructor(svgRoot:SVGSVGElement, isRotated:boolean){
        this.group = document.createElementNS("http://www.w3.org/2000/svg","g");
        svgRoot.appendChild(this.group);
        this.isRotated = isRotated;
    }
    clear(){
        this.positions = {};
        this.group.innerHTML = "";
    }
    addPiece(fenChar:string, squareKey:string){
        let g = PieceFactory.get(fenChar);
        this.group.appendChild(g);
        let piece = {element:g, fenChar, squareKey};
        this.setPiecePosition(piece);
    }
    removePiece(squareKey:string){
        let piece = this.positions[squareKey];
        this.group.removeChild(piece!.element);
        this.positions[squareKey] = null;
    }
    rotate(isRotated:boolean){
        this.isRotated = isRotated;
        let pieces = Object.values(this.positions);
        this.positions = {};
        pieces.forEach(piece =>{
            if (piece){
                this.setPiecePosition(piece);
            }
        });
    }
    private setPiecePosition(piece:Piece){
        let squareKey = piece.squareKey;
        this.positions[squareKey] = piece;
        let cords = Shared.getCordinatesBySquareKey(squareKey, this.isRotated);
        piece.element.setAttribute("transform", "translate(" + cords.x * 100 + "," + cords.y * 100 + ")");
    }
}
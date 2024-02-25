import Piece from "../Piece";
import PieceFactory from "../PieceFactory";
import Shared from "../Shared";

export default class PieceLayer{
    private group:SVGGElement;
    private isRotated:boolean;
    private positions:Record<string, Piece|undefined> = {};

    constructor(svgRoot:SVGSVGElement, isRotated:boolean){
        this.group = document.createElementNS("http://www.w3.org/2000/svg","g");
        svgRoot.appendChild(this.group);
        this.isRotated = isRotated;
    }
    clear(){
        this.positions = {};
        this.group.innerHTML = "";
    }
    getPiece(squareKey:string){
        return this.positions[squareKey];
    }
    addPiece(fenChar:string, squareKey:string){
        let piece = PieceFactory.get(fenChar, squareKey);
        this.group.appendChild(piece.element);
        this.setPosition(piece);
        return piece;
    }
    undoPieceRemoval(piece:Piece){
        this.group.appendChild(piece.element);
        this.setPosition(piece);
    }
    removePieceBySquareKey(squareKey:string){
        let piece = this.positions[squareKey]!;
        this.group.removeChild(piece.element);
        this.positions[squareKey] = undefined;
        return piece;
    }
    rotate(isRotated:boolean){
        this.isRotated = isRotated;
        let pieces = Object.values(this.positions);
        this.positions = {};
        pieces.forEach(piece =>{
            if (piece){
                this.setPosition(piece);
            }
        });
    }
    setPosition(piece:Piece){
        let squareKey = piece.squareKey!;
        this.positions[squareKey] = piece;
        Shared.setPosition(piece.element, squareKey, this.isRotated);
    }
    putOnTop(piece:Piece){
        this.group.appendChild(piece.element);
    }
}
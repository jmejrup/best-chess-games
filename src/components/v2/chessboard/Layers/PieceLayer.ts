import Piece from "../Piece";
import PieceFactory from "../PieceFactory";
import Shared from "../Shared";
import SVG from "../SVG";

export default class PieceLayer{
    private isRotated:boolean;
    group:SVGGElement;
    positions:Record<string, Piece|undefined> = {};

    constructor(svgRoot:SVGSVGElement, isRotated:boolean){
        this.group = SVG.createGroup();
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
    // undoPieceRemoval(piece:Piece){
    //     this.group.appendChild(piece.element);
    //     this.setPosition(piece);
    // }
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
    // putOnTop(piece:Piece){
    //     this.group.appendChild(piece.element);
    // }
    getKings(){
        let kings:Record<string, Piece> = {};
        Object.values(this.positions).forEach(piece =>{
            if (piece && (piece.fenChar === "k" || piece.fenChar === "K")){
                kings[piece.fenChar] = piece;
                if (kings["k"] && kings["K"]){
                    return kings;
                }
            }
        });
        return kings;
    }
    getPositions(){
        return this.positions;
    }
}
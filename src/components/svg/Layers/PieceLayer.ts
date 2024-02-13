import * as bishop from "../assets/pieces/b.json";
import * as king from "../assets/pieces/k.json";
import * as knight from "../assets/pieces/n.json";
import * as pawn from "../assets/pieces/p.json";
import * as queen from "../assets/pieces/q.json";
import * as rook from "../assets/pieces/r.json";
import { Piece } from "../Piece";
import MouseLayer from "./MouseLayer";
import Shared from "../Shared";
import BoardLayer from "./BoardLayer";

const pieceSVGData:Record<string, SVGGroup> = {};
pieceSVGData["p"] = pawn.g as SVGGroup;
pieceSVGData["r"] = rook.g as SVGGroup;
pieceSVGData["n"] = knight.g as SVGGroup;
pieceSVGData["b"] = bishop.g as SVGGroup;
pieceSVGData["q"] = queen.g as SVGGroup;
pieceSVGData["k"] = king.g as SVGGroup;

interface SVGGroup{
    g: SVGGroup|undefined;
    transform:string|undefined;
    style:string[]|undefined;
    path:Path[]|undefined|null;
    circle:Circle[]|undefined;
}
interface Path{
    style:string[]|undefined;
    d:string;
    colorIndex:number|undefined;
}
interface Circle{
    cx:string;
    cy:string;
    r:string;
}
export default class PieceLayer{
    group:SVGGElement;
    positions:Record<string, Piece|null> = {};
    boardLayer:BoardLayer;
    mouseLayer:MouseLayer;
    isRotated = false;

    constructor(svgRoot:SVGSVGElement, boardLayer:BoardLayer, mouseLayer:MouseLayer){
        this.boardLayer = boardLayer;
        this.mouseLayer = mouseLayer;
        this.group = document.createElementNS("http://www.w3.org/2000/svg","g");
        svgRoot.appendChild(this.group);
    }
    clear(){
        this.positions = {};
        this.group.innerHTML = "";
        this.mouseLayer.clear();
    }
    addPiece(fenChar:string, squareKey:string){
        let g = this.createPiece(fenChar);
        this.group.appendChild(g);
        let piece = new Piece(g, fenChar);
        this.setPiecePosition(piece, squareKey);
    }
    createPiece(fenChar:string){
        let g = document.createElementNS("http://www.w3.org/2000/svg","g");
        let data = pieceSVGData[fenChar.toLowerCase()];
        let color = fenChar === fenChar.toLowerCase() ? 0 : 1;
        this.loadChildren(g, data, color);
        return g;
    }
    addPieceAsCapture(fenChar:string){

    }
    onDrop(piece:Piece, squareIndexX:number, squareIndexY:number){
        let destinationSquareKey = Shared.getSquareKeyByIndexes(squareIndexX, squareIndexY, this.isRotated)
        this.group.appendChild(piece.element);
        if (piece.squareKey === destinationSquareKey){
            this.setPiecePosition(piece, destinationSquareKey);
        }
        else{
            this.movePiece(piece.squareKey!, destinationSquareKey);
        }
    }
    onDropCancel(piece:Piece){
        this.group.appendChild(piece.element);
        this.setPiecePosition(piece, piece.squareKey!);
    }
    movePiece(from:string, to:string){
        this.mouseLayer.disableHover(from, this.isRotated);
        this.mouseLayer.enableHover(to, this.isRotated);
        let piece = this.positions[from]!;
        let existingPiece = this.positions[to];
        if (existingPiece){
            this.group.removeChild(existingPiece.element);
        }
        this.positions[to] = piece;
        this.positions[from] = null;
        this.setPiecePosition(piece ,to);
        this.boardLayer.showTargetAndSource(from, to);
    }
    rotate(isRotated:boolean){
        this.isRotated = isRotated;
        let pieces = Object.values(this.positions);
        this.positions = {};
        this.mouseLayer.clear();
        pieces.forEach(piece =>{
            if (piece){
                this.setPiecePosition(piece, piece.squareKey!);
            }
        });
    }
    private setPiecePosition(piece:Piece, squareKey:string){
        let x = (this.isRotated ? "hgfedcba" : "abcdefgh").indexOf(squareKey[0]);
        let y = parseInt(squareKey[1]) -1;
        if (!this.isRotated){
            y = 7 - y;
        }
        this.positions[squareKey] = piece;
        piece.squareKey = squareKey;
        piece.element.setAttribute("transform", "translate(" + x + "," + y + ")");
        this.mouseLayer.enableHover(squareKey, this.isRotated);
    }
    private loadChildren(g:SVGGElement, group:SVGGroup, color:number){
        if (group.transform){
            g.setAttribute("transform", group.transform);
        }
        if (group.style && group.style[color]){
            g.setAttribute("style", group.style[color]);
        }
        if (group.circle){
            group.circle.forEach(circle =>{
                let c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                c.setAttribute("cx", circle.cx);
                c.setAttribute("cy", circle.cy);
                c.setAttribute("r", circle.r);
                g.appendChild(c);
            });
        }
        if (group.path){
            group.path.forEach(path =>{
                let p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                if (path.colorIndex === undefined || path.colorIndex === color){
                    p.setAttribute("d", path.d);
                    if (path.style){
                        p.setAttribute("style", path.style[color]);
                    }
                    g.appendChild(p);
                }
            });
        }
        if (group.g){
            let childGroup = document.createElementNS("http://www.w3.org/2000/svg","g");
            g.appendChild(childGroup);
            this.loadChildren(childGroup, group.g, color);
        }
    }
}
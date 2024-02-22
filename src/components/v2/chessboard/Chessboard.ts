import BoardLayer from "./Layers/BoardLayer";
import CordsLayer from "./Layers/CordsLayer";
import PieceLayer from "./Layers/PieceLayer";
import ArrowLayer from "./Layers/ArrowLayer";
import MouseEvents from "./MouseEvents";
import Shared from "./Shared";
import Piece from "./Piece";

export default class Chessboard{
    svgRoot:SVGSVGElement;
    private boardLayer:BoardLayer;
    private cordsLayer:CordsLayer;
    private pieceLayer:PieceLayer;
    private arrowLayer:ArrowLayer;
    private mouseEvents:MouseEvents
    private isRotated = false;

    constructor(boardContainer:HTMLElement, fen:string, isRotated:boolean){
        this.isRotated = isRotated;
        this.svgRoot = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svgRoot.setAttribute('viewBox', '0 0 800 800');
        boardContainer.appendChild(this.svgRoot);

        this.boardLayer = new BoardLayer(this.svgRoot, isRotated);
        this.cordsLayer = new CordsLayer(this.svgRoot, isRotated);
        this.pieceLayer = new PieceLayer(this.svgRoot, isRotated);
        this.arrowLayer = new ArrowLayer(this.svgRoot, isRotated);
        this.mouseEvents = new MouseEvents(this.svgRoot, this.boardLayer, this.arrowLayer, this.isRotated);

        this.setFen(fen, false);
    }
    rotate(){
        this.isRotated = !this.isRotated;
        this.boardLayer.rotate(this.isRotated);
        this.cordsLayer.rotate(this.isRotated);
        this.pieceLayer.rotate(this.isRotated);
        this.arrowLayer.rotate(this.isRotated);
        this.mouseEvents.rotate(this.isRotated);
    }
    setFen(fen:string, clearFirst:boolean){
        if (clearFirst){
            this.pieceLayer.clear();
        }
        if (fen !== ""){
            if (fen.toLowerCase() === "start")
                fen = Shared.startFEN;
            fen = fen.split(" ")[0].split("/").join("");
            let squareIndex = 0;
            for (let i = 0; i < fen.length; i++){
                let fenChar = fen[i];
                let nummericValue = parseInt(fenChar);
                if (!isNaN(nummericValue)){
                    squareIndex += nummericValue;
                }
                else{
                    let rotatedIndex = this.isRotated ? 63 - squareIndex : squareIndex;
                    let key = Shared.getSquareKeyByIndex(rotatedIndex, this.isRotated);
                    this.pieceLayer.addPiece(fenChar, key);
                    squareIndex++;
                }
            }
        }
    }
    getPiece(squareKey:string){
        return this.pieceLayer.getPiece(squareKey);
    }
    addPiece(fenChar:string, squareKey:string){
        return this.pieceLayer.addPiece(fenChar, squareKey);
    }
    setPiecePosition(piece:Piece){
        this.pieceLayer.setPiecePosition(piece);
    }
    removePiece(squareKey:string){
        try{
            this.pieceLayer.removePiece(squareKey);
        }
        catch(ex){
            debugger;
        }
    }
    highlightSource(from:string){
        this.boardLayer.highlightSource(from);
    }
    highlightTarget(to:string){
        this.boardLayer.highlightTarget(to);
    }
    clearSourceAndTargetHighlights(){
        this.boardLayer.clearSourceAndTargetHighlights();
    }
    highlightSourceAndTarget(from:string, to:string){
        this.boardLayer.highlightSourceAndTarget(from, to);
    }
}

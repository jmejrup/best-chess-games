import BoardLayer from "./Layers/BoardLayer";
import CordsLayer from "./Layers/CordsLayer";
import PieceLayer from "./Layers/PieceLayer";
import ArrowLayer from "./Layers/ArrowLayer";
import MouseLayer from "./Layers/MouseLayer";
import DragAndDrop from "./DragAndDrop";
import MouseEvents from "./MouseEvents";
import Shared from "./Shared";
import Screenshot from "./Screenshot";

export default class Chessboard{
    svgRoot:SVGSVGElement;
    private boardLayer:BoardLayer;
    private cordsLayer:CordsLayer;
    pieceLayer:PieceLayer;
    private arrowLayer:ArrowLayer;
    private mouseLayer:MouseLayer;
    private mouseEvents:MouseEvents;
    private dragAndDrop:DragAndDrop;
    private isRotated = false;

    constructor(chessContainer:HTMLElement|SVGGElement, fen:string, isRotated:boolean){
        this.boardLayer = new BoardLayer(isRotated);
        this.svgRoot = this.boardLayer.svgRoot;
        chessContainer.appendChild(this.svgRoot);
        this.mouseLayer = new MouseLayer(this.svgRoot);
        this.cordsLayer = new CordsLayer(this.svgRoot);
        this.pieceLayer = new PieceLayer(this.svgRoot, this.boardLayer, this.mouseLayer);
        this.arrowLayer = new ArrowLayer(this.svgRoot);
        this.dragAndDrop = new DragAndDrop(this.pieceLayer, this.svgRoot, isRotated);
        this.mouseLayer.init();
        this.mouseEvents = new MouseEvents(this.boardLayer, this.arrowLayer, this.dragAndDrop, this.isRotated);

        this.setFen(fen, false);
    }
    test(){
        this.rotate();
    }
    rotate(){
        this.isRotated = !this.isRotated;
        this.boardLayer.rotate(this.isRotated);
        this.cordsLayer.rotate(this.isRotated);
        this.pieceLayer.rotate(this.isRotated);
        this.arrowLayer.rotate(this.isRotated);
        this.dragAndDrop.rotate(this.isRotated);
        this.mouseEvents.rotate(this.isRotated);
    }
    setFen(fen:string, clearFirst:boolean){
        if (clearFirst){
            this.pieceLayer.clear();
            
            // Object.values(this.whiteCaptures).concat(Object.values(this.blackCaptures)).forEach(element =>{
            //     element.innerHTML = "";
            // });
            // this.pieceElements = [];
            // this.setScore(0);
        }
        if (fen !== ""){
            if (fen.toLowerCase() === "start")
                fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
            fen = fen.split(" ")[0].split("/").join("");
            let squareIndex = 0;
            for (let i = 0; i < fen.length; i++){
                let fenChar = fen[i];
                let nummericValue = parseInt(fenChar);
                if (!isNaN(nummericValue)){
                    squareIndex += nummericValue;
                }
                else{
                    let key = Shared.getSquareKeyByIndex(squareIndex++, this.isRotated);
                    this.pieceLayer.addPiece(fenChar, key);
                }
            }
        }
    }
    private appendChild(parent:HTMLElement, tag:string, className:string, text?:string){
        return parent.appendChild(this.createChild(tag, className, text));
    }
    private createChild(tag:string, className:string, text?:string){
        let child = document.createElement(tag);
        child.className = className;
        if (text)
            child.innerHTML = text;
        return child;
    }
}

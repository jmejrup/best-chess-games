import BoardLayer from "./Layers/BoardLayer";
import CordsLayer from "./Layers/CordsLayer";
import PieceLayer from "./Layers/PieceLayer";
import ArrowLayer from "./Layers/ArrowLayer";
import MouseEvents from "./MouseEvents";
import Shared from "./Shared";
import SVG from "./SVG";
import ResultsLayer from "./Layers/ResultsLayer";
import GameResult from "./GameResult";

export default class Chessboard{
    svgRoot:SVGSVGElement;
    pieceLayer:PieceLayer;
    private boardLayer:BoardLayer;
    private cordsLayer:CordsLayer;
    private arrowLayer:ArrowLayer;
    private resultsLayer:ResultsLayer;
    private mouseEvents:MouseEvents
    private isRotated = false;

    constructor(boardContainer:HTMLElement, fen:string, isRotated:boolean){
        this.isRotated = isRotated;
        this.svgRoot = SVG.createSVG('0 0 800 800');
        boardContainer.appendChild(this.svgRoot);

        this.boardLayer = new BoardLayer(this.svgRoot, isRotated);
        this.cordsLayer = new CordsLayer(this.svgRoot, isRotated);
        this.pieceLayer = new PieceLayer(this.svgRoot, isRotated);
        this.arrowLayer = new ArrowLayer(this.svgRoot, isRotated);
        this.resultsLayer = new ResultsLayer(this.svgRoot, isRotated);
        this.mouseEvents = new MouseEvents(this.svgRoot, this.boardLayer, this.arrowLayer, this.isRotated);

        this.setFen(fen, false);
    }
    rotate(){
        this.isRotated = !this.isRotated;
        this.boardLayer.rotate();
        this.cordsLayer.rotate();
        this.pieceLayer.rotate();
        this.arrowLayer.rotate();
        this.resultsLayer.rotate();
        this.mouseEvents.rotate();
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
    showGameResult(gameResult:GameResult){
        let kings = this.pieceLayer.getKings();
        this.resultsLayer.showGameResult(gameResult, kings);
    }
    hideGameResult(){
        this.resultsLayer.clear();
    }
}

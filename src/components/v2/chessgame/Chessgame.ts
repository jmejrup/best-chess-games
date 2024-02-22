import GameBrowser from "../gameBrowser/GameBrowser";
import DragAndDrop from "./DragAndDrop";
import MouseLayer from "./MouseLayer";

export default class Chessgame{
    svgRoot:SVGSVGElement;
    isRotated:boolean;
    gameBrowser:GameBrowser;
    mouseLayer:MouseLayer;
    dragAndDrop:DragAndDrop;

    constructor(container: HTMLElement, fen:string, isRotated:boolean){
        this.gameBrowser = new GameBrowser(container, fen, isRotated);
        this.svgRoot = this.gameBrowser.chessboard.svgRoot;
        this.isRotated = isRotated;
        this.mouseLayer = new MouseLayer(this.svgRoot);
        this.dragAndDrop = new DragAndDrop(this.gameBrowser.chessboard, isRotated, this.mouseLayer);
        if (fen !== ""){
            this.dragAndDrop.startGame(fen);
        }
    }
    rotate(){
        this.isRotated = !this.isRotated;
        this.dragAndDrop.rotate(this.isRotated);
        this.gameBrowser.rotate();
    }
}
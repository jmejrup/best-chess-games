import { Chess } from "chess.js";
import Shared from "../chessboard/Shared";
import GameBrowser from "../gameBrowser/GameBrowswer";
import DragAndDrop from "./DragAndDrop";

export default class Chessgame{
    isRotated:boolean;
    chess:Chess;
    gameBrowser:GameBrowser;
    svgRoot:SVGSVGElement;
    dragAndDrop:DragAndDrop;

    constructor(container: HTMLElement, fen:string, isRotated:boolean){
        this.isRotated = isRotated;
        if (fen === "start"){
            fen = Shared.startFEN;
        }
        this.chess = new Chess(fen);
        this.gameBrowser = new GameBrowser(container, fen, isRotated);
        this.svgRoot = this.gameBrowser.chessboard.svgRoot;
        this.dragAndDrop = new DragAndDrop(this.chess, this.gameBrowser.chessboard, isRotated);
    }
    rotate(){
        this.isRotated = !this.isRotated;
        this.dragAndDrop.rotate(this.isRotated);
        this.gameBrowser.rotate();
    }
}
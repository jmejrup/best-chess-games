import GameNavigator from "../gameNavigator/GameNavigator";
import DragAndDrop from "./DragAndDrop";
import MouseLayer from "./MouseLayer";

export default class Chessgame{
    svgRoot:SVGSVGElement;
    isRotated:boolean;
    gameNavigator:GameNavigator;
    mouseLayer:MouseLayer;
    dragAndDrop:DragAndDrop;

    constructor(container: HTMLElement, fen:string, isRotated:boolean){
        this.gameNavigator = new GameNavigator(container, fen, isRotated);
        this.svgRoot = this.gameNavigator.chessboard.svgRoot;
        this.isRotated = isRotated;
        this.mouseLayer = new MouseLayer(this.svgRoot);
        this.dragAndDrop = new DragAndDrop(this.gameNavigator.chessboard, isRotated, this.mouseLayer);
        if (fen !== ""){
            this.dragAndDrop.startGame(fen);
        }
    }
    rotate(){
        this.isRotated = !this.isRotated;
        this.dragAndDrop.rotate(this.isRotated);
        this.gameNavigator.rotate();
    }
}
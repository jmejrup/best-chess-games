import Chessboard from "../chessboard/Chessboard";
import GameNavigator from "../gameNavigator/GameNavigator";
import PromotionPanel from "./PromotionPanel";
import DragAndDrop from "./DragAndDrop";
import MouseLayer from "./MouseLayer";
import MouseEvents from "./MouseEvents";
import Shared from "../chessboard/Shared";
import { getCastling } from "../gameNavigator/Castling";
import { Chess } from "chess.js";

export default class Chessgame{
    container:HTMLElement;
    gameNavigator:GameNavigator;
    chessboard:Chessboard;
    private isRotated:boolean;
    private mouseLayer:MouseLayer;
    private dragAndDrop:DragAndDrop;
    private promotionPanel:PromotionPanel;
    private chess = new Chess();

    constructor(container: HTMLElement, fen:string, isRotated:boolean){
        this.container = container;
        this.gameNavigator = new GameNavigator(container, fen, isRotated);
        this.chessboard = this.gameNavigator.chessboard;
        this.isRotated = isRotated;
        this.mouseLayer = new MouseLayer(this.chessboard.svgRoot);
        this.dragAndDrop = new DragAndDrop(
            this.gameNavigator.chessboard, 
            this.isRotated, 
            (fenChar:string, from:string, to:string) => this.onDrop(fenChar, from, to));
        new MouseEvents(this.chessboard.svgRoot, this.dragAndDrop, this.isRotated);
        this.promotionPanel = new PromotionPanel(this.chessboard.svgRoot);
        if (fen !== ""){
            this.startGame(fen);
        }
    }
    startGame(fen:string){
        this.mouseLayer.clear();
        if (fen === "start"){
            fen = Shared.startFEN;
        }
        if (fen !== ""){
            this.chess = new Chess(fen);
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
                    this.mouseLayer.enableHover(key, this.isRotated);
                    squareIndex++;
                }
            }
        }
    }
    async onDrop(fenChar:string, from:string, to:string){
        let promotion:string|undefined;
        if (fenChar.toLowerCase() === "p" && (to[1] === "1" || to[1] === "8")){
            let color = fenChar === fenChar.toLowerCase() ? "b" : "w";
            this.promotionPanel.show(to, color, this.isRotated,
                (char:string) => {
                    //OnPromotion
                    promotion = char;
                    this.move(fenChar, from, to, promotion);
                },
                () => {
                    //OnCancelPromotion
                    debugger;
                });
        }
        else{
            this.move(fenChar, from, to, undefined);
        }
    }
    private move(fenChar:string, from:string, to:string, promotion:string|undefined){
        try
        {
            let move = this.chess.move({ from, to, promotion });
            let castling = getCastling(this.chessboard, move, true);
            let piece = this.chessboard.addPiece(fenChar, from);
            this.gameNavigator.addMove(move);
            this.gameNavigator.finishMove(true, piece, move, castling);
        }
        catch(ex){
            this.chessboard.addPiece(fenChar, from);
        }
    }
    rotate(){
        this.isRotated = !this.isRotated;
        this.dragAndDrop.rotate(this.isRotated);
        this.gameNavigator.rotate();
    }
}
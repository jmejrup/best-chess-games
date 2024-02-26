import { Move } from "chess.js";
import GameNavigator from "./GameNavigator";
import PiecesUTF from "./PiecesUTF";
import "./history.css";

export default class History{
    container:HTMLElement;
    gameNavigator:GameNavigator

    constructor(container:HTMLElement, gameNavigator:GameNavigator){
        this.container = container;
        this.container.classList.add("game-history");
        this.gameNavigator = gameNavigator;
        this.gameNavigator.callbacks.onGameLoaded = this.onGameLoaded;
        this.gameNavigator.callbacks.onGoToMove = this.onGoToMove;
        this.gameNavigator.callbacks.onMoveEnd = 
            (index:number, move:Move, isForward:boolean)  => this.onMoveEnd(index, move, isForward);
    }
    onGameLoaded(){
        debugger;
    }
    onGoToMove(index:number){

    }
    onMoveEnd(index:number, move:Move, isForward:boolean){
        let moveNumber = index +1;
        let turnNumber = Math.ceil(moveNumber / 2);
        let isNewTurn = moveNumber % 2 !== 0;
        let turnContainer:HTMLElement;
        if (isNewTurn){
            turnContainer = this.addChild(this.container, "div", "turn");
            this.addChild(turnContainer, "span", "number", turnNumber + ".");
        }
        else{
            turnContainer = this.container.lastChild as HTMLElement;
        }
        let firstChar = move.san.substring(0, 1);
        let logText = "";
        if (firstChar === firstChar.toUpperCase() && firstChar.toUpperCase() !== "O")
        {
            if (move.color === "b"){
                firstChar = firstChar.toLowerCase();
            }
            firstChar = PiecesUTF[firstChar];
            logText += firstChar + move.san.substring(1);
        }
        else
            logText += move.san;
        let moveItem = this.addChild(turnContainer, "span", "move", logText) as HTMLElement;
        moveItem.onclick = () => this.gameNavigator.goToMove(index);
    }
    addChild(container:HTMLElement, tag:string, className:string, text?:string){
        let child = document.createElement(tag);
        if (text){
            child.innerHTML = text;
        }
        child.className = className;
        return container.appendChild(child) as HTMLElement;
    }
}
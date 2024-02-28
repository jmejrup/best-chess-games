import { Move } from "chess.js";
import GameNavigator from "./GameNavigator";
import PiecesUTF from "./PiecesUTF";
import "./history.css";

export default class History{
    container:HTMLElement;
    gameNavigator:GameNavigator;
    moveItems:HTMLElement[] = [];

    constructor(container:HTMLElement, gameNavigator:GameNavigator){
        this.container = container;
        this.container.classList.add("game-history");
        this.gameNavigator = gameNavigator;
        this.gameNavigator.callbacks.onGameLoaded = (moves:Move[]) => this.onGameLoaded(moves);
        this.gameNavigator.callbacks.onMoveAdded = (move:Move, index:number) => this.onMoveAdded(move, index);
        this.gameNavigator.callbacks.onGoToMove = (index:number) => this.onGoToMove(index);
        this.gameNavigator.callbacks.onMoveStart = (index:number) => this.onMoveStart(index);
        this.gameNavigator.callbacks.onMoveEnd = 
            (index:number, move:Move, isForward:boolean)  => this.onMoveEnd(index, move, isForward);
    }
    private onGameLoaded(moves:Move[]){
        this.moveItems = [];
        this.container.innerHTML = "";
        moves.forEach((move, index) =>{
            this.addToHistory(move, index);
        });
    }
    private addToHistory(move:Move, index:number){
        let isNewTurn = index % 2 === 0;
        let moveNumber = index +1;
        let turnNumber = Math.ceil(moveNumber / 2);
        let turnItem:HTMLElement|null;
        if (isNewTurn){
            turnItem = this.addChild(this.container, "div", "turn");
            let turnNumberText = (turnNumber++) + ".";
            if (turnNumber < 10){
                turnNumberText = " " + turnNumberText;
            }
            this.addChild(turnItem, "span", "number", turnNumberText);
        }
        else{
            turnItem = this.moveItems[this.moveItems.length -1].parentElement;
        }
        let moveText = this.getMoveText(move);
        let moveItem = this.addChild(turnItem!, "span", "move", moveText);
        moveItem.onclick = () => this.gameNavigator.goToMove(index);
        this.moveItems.push(moveItem);
    }
    private onMoveAdded(move:Move, index:number){
        this.addToHistory(move, index);
    }
    private onGoToMove(index:number){
        for (const moveItem of this.moveItems){
            moveItem.classList.remove("start", "end");
        }
        if (index > -1){
            this.moveItems[index].classList.add("end");
        }
    }
    private onMoveStart(index:number){
        for (const moveItem of this.moveItems){
            moveItem.classList.remove("start", "end");
        }
        this.moveItems[index].classList.add("start");
    }
    private onMoveEnd(index:number, move:Move, isForward:boolean){
        for (const moveItem of this.moveItems){
            moveItem.classList.remove("start", "end");
        }
        if (index > -1){
            this.moveItems[index].classList.add("end");
        }
    }
    private getMoveText(move:Move){
        let firstChar = move.san.substring(0, 1);
        let text = "";
        if (firstChar === firstChar.toUpperCase() && firstChar.toUpperCase() !== "O")
        {
            if (move.color === "b"){
                firstChar = firstChar.toLowerCase();
            }
            firstChar = PiecesUTF[firstChar];
            text += firstChar + move.san.substring(1);
        }
        else{
            text += move.san;
        }
        return text;
    }
    private addChild(container:HTMLElement, tag:string, className:string, text?:string){
        let child = document.createElement(tag);
        if (text){
            child.innerHTML = text;
        }
        child.className = className;
        return container.appendChild(child) as HTMLElement;
    }
}
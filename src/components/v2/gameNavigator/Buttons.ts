import Icons from "./img/Icons";
import GameNavigator from "./GameNavigator";
import Screenshots from "../chessboard/Screenshot";
import "./buttons.css";
import Shared from "../chessboard/Shared";

export default class Buttons{
    container:HTMLElement;
    buttonContainer:HTMLElement;

    constructor(container:HTMLElement, gameNavigator:GameNavigator){
        this.container = container;
        this.buttonContainer = Shared.addChild(this.container, "div", "game-nav-buttons");

        this.addButton("start", Icons.start, () =>{ gameNavigator.goToMove(-1) });
        this.addButton("rewind", Icons.rewind, () => gameNavigator.rewind());
        this.addButton("previous", Icons.previous, () => gameNavigator.previous());
        this.addButton("play", Icons.play, () => gameNavigator.play());
        this.addButton("pause", Icons.pause, () => gameNavigator.pause());
        this.addButton("next", Icons.next, () => gameNavigator.next());
        this.addButton("forward", Icons.forward, () => gameNavigator.forward());
        this.addButton("end", Icons.end,  () =>{ 
            gameNavigator.goToMove(gameNavigator.game.moves.length -1) 
        });
        this.addButton("rotate", Icons.rotate, () => gameNavigator.rotate());
        this.addButton("screenshot", Icons.screenshot, () => {
            Screenshots.Download(gameNavigator.chessboard.svgRoot);
        });
    }
    private addButton(id:string, iconUrl:string, fn: () => void){
        let button = document.createElement("img");
        button.src = iconUrl;
        button.onclick = fn;
        return this.buttonContainer.appendChild(button);
    }
}
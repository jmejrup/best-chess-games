import Icons from "./img/Icons";
import GameNavigator from "./GameNavigator";
import "./buttons.css";

export default class Buttons{
    container:HTMLElement;

    constructor(container:HTMLElement, gameNavigator:GameNavigator){
        this.container = container;
        this.container.classList.add("game-nav-buttons");

        this.addButton("start", Icons.start, () =>{ gameNavigator.goToMove(-1) });
        this.addButton("rewind", Icons.rewind, () => gameNavigator.rewind());
        this.addButton("previous", Icons.previous, () => gameNavigator.previous());
        this.addButton("play", Icons.play, () => gameNavigator.play());
        this.addButton("pause", Icons.pause, () => gameNavigator.pause());
        this.addButton("next", Icons.next, () => gameNavigator.next());
        this.addButton("forward", Icons.forward, () => gameNavigator.forward());
        this.addButton("end", Icons.end,  () =>{ 
            gameNavigator.goToMove(gameNavigator.moves.length -1) 
        });
        this.addButton("rotate", Icons.rotate, () => gameNavigator.rotate());
    }
    private addButton(id:string, iconUrl:string, fn: () => void){
        let button = document.createElement("img");
        button.src = iconUrl;
        button.onclick = fn;
        return this.container.appendChild(button);
    }
}
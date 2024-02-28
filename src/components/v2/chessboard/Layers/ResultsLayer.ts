import SVG from "../SVG";
import Piece from "../Piece";
import Icons from "../assets/Icons";
import Shared from "../Shared";
import GameResult from "../GameResult";

export default class ResultsLayer{
    private svgRoot:SVGSVGElement;
    private isRotated:boolean;
    private group:SVGGElement;
    private kings:Record<string,Piece> = {};
    private gameResult:GameResult|undefined;

    constructor(svgRoot:SVGSVGElement, isRotated:boolean){
        this.svgRoot = svgRoot;
        this.isRotated = isRotated;
        this.group = SVG.createGroup();
        this.svgRoot.appendChild(this.group);
    }
    clear(){
        this.group.innerHTML = "";
        this.gameResult = undefined;
        this.kings = {};
    }
    rotate(){
        this.isRotated = !this.isRotated;
        if (this.gameResult){
            this.group.innerHTML = "";
            this.showGameResult(this.gameResult, this.kings);
        }
    }
    showGameResult(gameResult:GameResult, kings:Record<string,Piece>){
        this.gameResult = gameResult;
        this.kings = kings;
        if (gameResult !== "1/2-1/2"){
            let winnerIcon = SVG.createImage(Icons.win, 0, 0, 30, 30);
            let loserIcon = SVG.createImage(Icons.lose, 0, 0, 40, 40);
            this.group.appendChild(winnerIcon);
            this.group.appendChild(loserIcon);
            let winnerFenChar = gameResult === "1-0" ? "K" : "k";
            let loserFenChar = gameResult === "1-0" ? "k" : "K";
            let winnerSquare = kings[winnerFenChar].squareKey!;
            let loserSquare = kings[loserFenChar].squareKey!;
            this.showImage(winnerIcon, winnerSquare);
            this.showImage(loserIcon, loserSquare);
        }

    }
    private showImage(image:SVGImageElement, squareKey:string){
        let cord = Shared.getCordinatesBySquareKey(squareKey, this.isRotated);
        image.style.transform = `translate(${cord.x * 12.5}%, ${cord.y * 12.5}%)`;
    }
}
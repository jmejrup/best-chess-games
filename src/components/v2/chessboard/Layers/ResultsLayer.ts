import SVG from "../SVG";
import Piece from "../Piece";
import Icons from "../assets/Icons";
import Shared from "../Shared";

export default class ResultsLayer{
    private svgRoot:SVGSVGElement;
    private isRotated:boolean;
    private group:SVGGElement;
    private kings:Record<string,Piece> = {};
    private winnerColor:string|undefined;

    constructor(svgRoot:SVGSVGElement, isRotated:boolean){
        this.svgRoot = svgRoot;
        this.isRotated = isRotated;
        this.group = SVG.createGroup();
        this.svgRoot.appendChild(this.group);
    }
    clear(){
        this.group.innerHTML = "";
        this.winnerColor = undefined;
        this.kings = {};
    }
    rotate(){
        this.isRotated = !this.isRotated;
        if (this.winnerColor){
            this.group.innerHTML = "";
            this.showWinner(this.winnerColor, this.kings);
        }
    }
    showWinner(color:string, kings:Record<string,Piece>){
        let winnerIcon = SVG.createImage(Icons.win, 0, 0, 20, 20);
        let loserIcon = SVG.createImage(Icons.lose, 0, 0, 20, 20);
        this.group.appendChild(winnerIcon);
        this.group.appendChild(loserIcon);
        let winnerFenChar = color === "b" ? "k" : "K";
        let loserFenChar = color === "b" ? "K" : "k";
        let winnerSquare = kings[winnerFenChar].squareKey!;
        let loserSquare = kings[loserFenChar].squareKey!;
        this.showImage(winnerIcon, winnerSquare);
        this.showImage(loserIcon, loserSquare);
    }
    private showImage(image:SVGImageElement, squareKey:string){
        let cord = Shared.getCordinatesBySquareKey(squareKey, this.isRotated);
        image.style.transform = `translate(${cord.x * 12.5}%, ${cord.y * 12.5}%)`;
    }
}
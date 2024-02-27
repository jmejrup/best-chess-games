import Shared from "../chessboard/Shared";
import PieceElementFactory from "../chessboard/PieceElementFactory";
import Icons from "./img/Icons";
import SVG from "../chessboard/SVG";
import "./promotionPanel.css";

export default class PromotionPanel{
    svgRoot:SVGSVGElement;
    group:SVGGElement;

    constructor(svgRoot:SVGSVGElement){
        this.svgRoot = svgRoot;
        this.group = SVG.createGroup();
        this.svgRoot.appendChild(this.group);
    }
    show(squareKey:string, color:string, isRotated:boolean, onPromotionCallback:Function, onCancelPromotionCallback:Function){
        Shared.setPosition(this.group, squareKey, isRotated);
        let rect = SVG.createRect(0, 0, 100, 500, "rgb(240,240,240)");
        rect.setAttribute("stroke", "black");
        rect.setAttribute("stroke-width", "2");
        this.group.appendChild(rect);

        ["q","r","n","b"].forEach((char, index) =>{
            let fenChar = color === "b" ? char : char.toUpperCase();
            let rect = SVG.createRect(0, index * 100, 100, 100, "rgb(250,250,240)");
            this.group.appendChild(rect);
            let pieceElement = PieceElementFactory.get(fenChar);
            pieceElement.setAttribute("transform", "translate(0," + (index * 100) + ")");
            this.group.appendChild(pieceElement);
            let topRect = SVG.createRect(0, index * 100, 100, 100, "transparent");
            topRect.classList.add("promotion");
            this.group.appendChild(topRect);
            topRect.onclick = () =>{
                onPromotionCallback(char);
                this.group.innerHTML = "";
            };
        });
        let image = SVG.createImage(Icons.x, 0, 428, 100, 40);
        this.group.appendChild(image);
        let topRect = SVG.createRect(0, 400, 100, 100, "transparent");
        topRect.classList.add("promotion");
        this.group.appendChild(topRect);
        topRect.onclick = () => {
            onCancelPromotionCallback();
            this.group.innerHTML = "";
        };
    }
}
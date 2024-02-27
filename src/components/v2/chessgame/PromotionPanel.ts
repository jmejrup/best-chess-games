import Shared from "../chessboard/Shared";
import PieceElementFactory from "../chessboard/PieceElementFactory";
import Icons from "./img/Icons";
import "./promotionPanel.css";

export default class PromotionPanel{
    svgRoot:SVGSVGElement;
    group:SVGGElement;

    constructor(svgRoot:SVGSVGElement){
        this.svgRoot = svgRoot;
        this.group = document.createElementNS("http://www.w3.org/2000/svg","g");
        this.svgRoot.appendChild(this.group);
    }
    show(squareKey:string, color:string, isRotated:boolean, onPromotionCallback:Function, onCancelPromotionCallback:Function){
        Shared.setPosition(this.group, squareKey, isRotated);
        let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute("width", "100");
        rect.setAttribute("height", "500");
        rect.setAttribute("fill", "rgb(240,240,240)");
        rect.setAttribute("stroke", "black");
        rect.setAttribute("stroke-width", "2");
        this.group.appendChild(rect);

        ["q","r","n","b"].forEach((char, index) =>{
            let fenChar = color === "b" ? char : char.toUpperCase();
            let rect = this.createRect(0, index * 100, 100, 100, "rgb(250,250,240)");
            this.group.appendChild(rect);
            let pieceElement = PieceElementFactory.get(fenChar);
            pieceElement.setAttribute("transform", "translate(0," + (index * 100) + ")");
            this.group.appendChild(pieceElement);
            let topRect = this.createRect(0, index * 100, 100, 100, "transparent");
            topRect.classList.add("promotion");
            this.group.appendChild(topRect);
            topRect.onclick = () =>{
                onPromotionCallback(char);
                this.group.innerHTML = "";
            };
        });
        let image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        image.setAttribute("href", Icons.x);
        image.setAttribute("width", "100");
        image.setAttribute("height", "40");
        image.setAttribute("y", "428");
        this.group.appendChild(image);
        let topRect = this.createRect(0, 400, 100, 100, "transparent");
        topRect.classList.add("promotion");
        this.group.appendChild(topRect);
        topRect.onclick = () => {
            onCancelPromotionCallback();
            this.group.innerHTML = "";
        };
    }
    createRect(x:number, y:number, width:number, height:number, fill:string){
        let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute("x", x.toString());
        rect.setAttribute("y", y.toString());
        rect.setAttribute("width", width.toString());
        rect.setAttribute("height", height.toString());
        rect.setAttribute("fill", fill);
        return rect;
    }
}
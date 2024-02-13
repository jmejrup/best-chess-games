import MouseLayer from "./Layers/MouseLayer";
import PieceLayer from "./Layers/PieceLayer";
import { Piece } from "./Piece";
import Shared from "./Shared";

export default class DragAndDrop{
    private svgRoot:SVGSVGElement;
    private pieceLayer:PieceLayer;
    private dragPiece:Piece|null = null;
    private scrollTop = 0;
    private deltaScrollTop = 0;
    private scrollLeft = 0;
    private deltaScrollLeft = 0;
    private dragContainer = document.createElement("div");
    private isRotated:boolean;

    constructor(pieceLayer:PieceLayer, svgRoot:SVGSVGElement, isRotated:boolean){
        this.pieceLayer = pieceLayer;
        this.svgRoot = svgRoot;
        this.isRotated = isRotated;
        this.dragContainer.style.position = "absolute";
        this.dragContainer.style.transform = "translate(-50%,-50%)";
        svgRoot.parentElement!.prepend(this.dragContainer);
    }
    rotate(isRotated:boolean){
        this.isRotated = isRotated;
    }
    onLeftButtonDown(event:MouseEvent){
        let rect = event.target as HTMLElement;
        let squareIndex = parseInt(rect.getAttribute("data-index")!);
        let squareKey = Shared.getSquareKeyByIndex(squareIndex, this.isRotated);
        this.dragPiece = this.pieceLayer.positions[squareKey];
        if (this.dragPiece){
            this.scrollTop = document.documentElement.scrollTop;// Drag position will be incorrect if we don't take scroll into consideration
            this.deltaScrollTop = 0; // Used to adjust the drag position if scrolling occurs during the drag
            this.scrollLeft = document.documentElement.scrollLeft;
            this.deltaScrollLeft = 0;
        }
    }
    onMouseMove(event:MouseEvent){
        if (this.dragPiece) {
            event.preventDefault();
            if (!this.dragContainer.firstChild){
                let svgParent = this.svgRoot.parentElement as HTMLElement;
                this.dragContainer.style.width = svgParent.clientWidth / 8 + "px";
                this.dragContainer.style.height = svgParent.clientHeight / 8 +"px";
                let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('viewBox', '0 0 8 8');
                svg.appendChild(this.dragPiece.element);
                this.dragPiece.element.setAttribute("transform", "scale(8)");
                this.dragContainer.appendChild(svg);
            }
            this.dragContainer.style.left = event.clientX + document.documentElement.scrollLeft + "px";
            this.dragContainer.style.top = event.clientY + document.documentElement.scrollTop + "px";
        }
    }
    onScroll(){
        if (this.dragPiece) {
            let newDeltaX = document.documentElement.scrollLeft - this.scrollLeft;
            let newDeltaY = document.documentElement.scrollTop - this.scrollTop;
            let changeInDeltaX = newDeltaX - this.deltaScrollLeft;
            let changeInDeltaY = newDeltaY - this.deltaScrollTop;
            this.deltaScrollLeft = newDeltaX;
            this.deltaScrollTop = newDeltaY;
            let left = parseFloat(this.dragContainer.style.left);
            let top = parseFloat(this.dragContainer.style.top);
            this.dragContainer.style.left = left + changeInDeltaX + "px";
            this.dragContainer.style.top = top + changeInDeltaY + "px";
        }
    }
    onMouseUp(event:MouseEvent){
        if (this.dragPiece){
            let svgParent = this.svgRoot.parentElement as HTMLElement;
            if (this.isClickOnElement(event, svgParent)){
                let squareIndexX = Math.floor((100 * event.clientX / svgParent.clientWidth) / 12.5);
                let squareIndexY = Math.floor((100 * event.clientY / svgParent.clientHeight) / 12.5);
                this.pieceLayer.onDrop(this.dragPiece, squareIndexX, squareIndexY);
            }
            else{
                this.pieceLayer.onDropCancel(this.dragPiece);
            }
            this.dragPiece = null;
            this.dragContainer.innerHTML = "";
            this.dragContainer.style.width = "0px";
            this.dragContainer.style.height = "0px";
        }
    }
    isClickOnElement(event: MouseEvent, element:HTMLElement)
    {
        let rect = this.getOffsetRectangle(element);
        let point = this.getAbsoluteMousePosition(event);
        return point.x > rect.x && point.x < rect.x + rect.width && point.y > rect.y && point.y < rect.y + rect.height;
    }
    getOffsetRectangle(element:HTMLElement){
        let rect = { x: element.offsetLeft, y: element.offsetTop, width: element.offsetWidth, height: element.offsetHeight };
        while (element.offsetParent instanceof HTMLElement){
            element = element.offsetParent;
            rect.x += element.offsetLeft;
            rect.y += element.offsetTop;
        }
        return rect;
    }
    getAbsoluteMousePosition(event:MouseEvent){
        let x = event.clientX + document.documentElement.scrollLeft;
        let y = event.clientY + document.documentElement.scrollTop;
        return { x: x, y: y };
    }
}
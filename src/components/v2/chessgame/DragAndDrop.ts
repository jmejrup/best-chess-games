import Chessboard from "../chessboard/Chessboard";
import Shared from "../chessboard/Shared";
import Piece from "../chessboard/Piece";
import "./dragAndDrop.css";

export default class DragAndDrop{
    private chessboard:Chessboard;
    private svgRoot:SVGSVGElement;
    private callbackOnDrop:Function;
    private sourceSquare:string|null = null;
    private dragPiece:Piece|undefined;
    private scrollTop = 0;
    private deltaScrollTop = 0;
    private scrollLeft = 0;
    private deltaScrollLeft = 0;
    private dragBox = document.createElementNS("http://www.w3.org/2000/svg","svg") as SVGSVGElement;
    private isRotated:boolean;

    constructor(chessboard:Chessboard, isRotated:boolean, callbackOnDrop:Function){
        this.chessboard = chessboard;
        this.svgRoot = chessboard.svgRoot;
        this.callbackOnDrop = callbackOnDrop;
        this.isRotated = isRotated;
        this.dragBox.setAttribute('viewBox', '0 0 100 100');
        this.dragBox.classList.add("drag-box");
        chessboard.svgRoot.parentElement!.prepend(this.dragBox);
    }
    rotate(isRotated:boolean){
        this.isRotated = isRotated;
    }
    onLeftButtonDown(event:MouseEvent){
        // This is the rectangle in our mouselayer that ensures cursor:pointer on hover
        let rect = event.target as HTMLElement;
        let squareIndex = parseInt(rect.getAttribute("data-index")!);
        this.sourceSquare = Shared.getSquareKeyByIndex(squareIndex, this.isRotated);
        this.dragPiece = this.chessboard.pieceLayer.getPiece(this.sourceSquare);
        if (this.dragPiece){
            this.dragBox.appendChild(this.dragPiece.element);
            this.dragBox.style.width = this.svgRoot.clientWidth / 8 + "px";
            this.dragBox.style.height = this.svgRoot.clientWidth / 8 +"px";
            this.setDragBoxPosition(event);
            this.dragPiece.element.style.transform = "translate(0,0)";
            this.scrollTop = document.documentElement.scrollTop;// Drag position will be incorrect if we don't take scroll into consideration
            this.deltaScrollTop = 0; // Used to adjust the drag position if scrolling occurs during the drag
            this.scrollLeft = document.documentElement.scrollLeft;
            this.deltaScrollLeft = 0;
        }
    }
    onMouseMove(event:MouseEvent){
        if (this.dragPiece) {
            event.preventDefault();
            this.setDragBoxPosition(event);
        }
    }
    private setDragBoxPosition(event:MouseEvent){
        this.dragBox.style.left = event.clientX + document.documentElement.scrollLeft + "px";
        this.dragBox.style.top = event.clientY + document.documentElement.scrollTop + "px";
    }
    onScroll(){
        if (this.dragPiece) {
            let newDeltaX = document.documentElement.scrollLeft - this.scrollLeft;
            let newDeltaY = document.documentElement.scrollTop - this.scrollTop;
            let changeInDeltaX = newDeltaX - this.deltaScrollLeft;
            let changeInDeltaY = newDeltaY - this.deltaScrollTop;
            this.deltaScrollLeft = newDeltaX;
            this.deltaScrollTop = newDeltaY;
            let left = parseFloat(this.dragBox.style.left);
            let top = parseFloat(this.dragBox.style.top);
            this.dragBox.style.left = left + changeInDeltaX + "px";
            this.dragBox.style.top = top + changeInDeltaY + "px";
        }
    }
    onMouseUp(event:MouseEvent){
        if (this.dragPiece){
            let from = this.dragPiece.squareKey!;
            let fenChar = this.dragPiece.fenChar;
            this.dragPiece = undefined;
            this.dragBox.innerHTML = "";
            this.dragBox.style.width = "0px";
            this.dragBox.style.height = "0px";
            if (this.isClickOnElement(event, this.svgRoot.parentElement!)){
                let to = Shared.getSquareByCursorPosition(this.svgRoot, event, this.isRotated);
                this.callbackOnDrop(fenChar, from, to);
            }
            else{
                this.chessboard.pieceLayer.addPiece(fenChar, from);
            }
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
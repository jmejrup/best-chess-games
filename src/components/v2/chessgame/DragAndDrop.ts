// import MouseLayer from "../chessboard/Layers/MouseLayer";
import { Chess, Square } from "chess.js";
import Chessboard from "../chessboard/Chessboard";
import Shared from "../chessboard/Shared";
import DragPieceFactory from "./DragPieceFactory";
import DragPiece from "./DragPiece";

export default class DragAndDrop{
    private chessboard:Chessboard;
    private chess:Chess;
    private sourceSquare:Square|null = null;
    private dragPiece:DragPiece|null = null;
    private scrollTop = 0;
    private deltaScrollTop = 0;
    private scrollLeft = 0;
    private deltaScrollLeft = 0;
    private dragContainer = document.createElement("div");
    private isRotated:boolean;

    constructor(chess:Chess, chessboard:Chessboard, isRotated:boolean){
        this.chess = chess;
        this.chessboard = chessboard;
        this.isRotated = isRotated;
        this.dragContainer.style.position = "absolute";
        this.dragContainer.style.transform = "translate(-50%,-50%)";
        chessboard.svgRoot.parentElement!.prepend(this.dragContainer);

        this.chessboard.svgRoot.addEventListener("mousedown", (event:MouseEvent) => {
            let isRightClick = event.button && event.button == 2;
            if (!isRightClick){
                this.onLeftButtonDown(event);
            }
            event.preventDefault();
        });
        document.addEventListener("mousemove", (event:MouseEvent) => {
            this.onMouseMove(event);
            event.preventDefault();
        });
        document.addEventListener("mouseup", (event:MouseEvent) =>{
            let isRightClick = event.button && event.button == 2;
            if (!isRightClick){
                this.onMouseUp(event);
                event.preventDefault();
            }
        });
        document.addEventListener("scroll", () =>{
            this.onScroll();
        });
    }
    rotate(isRotated:boolean){
        this.isRotated = isRotated;
    }
    onLeftButtonDown(event:MouseEvent){
        // This is the rectangle in our mouselayer that ensures cursor:pointer on hover
        let rect = event.target as HTMLElement;
        // We have given the square a data-index attribute so it's a little easier to
        // determine what square was clicked and update whether it should enable hover or not
        let squareIndex = parseInt(rect.getAttribute("data-index")!);
        // We can use the index of the square to find the square key.
        let square = Shared.getSquareKeyByIndex(squareIndex, this.isRotated) as Square;
        this.sourceSquare = square;
        let pieceDef = this.chess.get(square);
        if (pieceDef){
            let fenChar = pieceDef.color === "b" ? pieceDef.type : pieceDef.type.toUpperCase();
            this.dragPiece = DragPieceFactory.get(fenChar);
            if (this.dragPiece){
                this.scrollTop = document.documentElement.scrollTop;// Drag position will be incorrect if we don't take scroll into consideration
                this.deltaScrollTop = 0; // Used to adjust the drag position if scrolling occurs during the drag
                this.scrollLeft = document.documentElement.scrollLeft;
                this.deltaScrollLeft = 0;
            }
        }
    }
    onMouseMove(event:MouseEvent){
        if (this.dragPiece && this.sourceSquare) {
            event.preventDefault();
            if (!this.dragContainer.firstChild){
                let svgParent = this.chessboard.svgRoot.parentElement as HTMLElement;
                this.dragContainer.style.width = svgParent.clientWidth / 8 + "px";
                this.dragContainer.style.height = svgParent.clientHeight / 8 +"px";
                this.dragContainer.appendChild(this.dragPiece.svg);
                this.chessboard.removePiece(this.sourceSquare!)
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
            let svgParent = this.chessboard.svgRoot.parentElement as HTMLElement;
            if (this.isClickOnElement(event, svgParent)){
                let targetSquare = Shared.getSquareByCursorPosition(this.chessboard.svgRoot, event, this.isRotated) as Square;
                if (targetSquare === this.sourceSquare){
                    this.cancelDrag();
                }
                else{
                    try{
                        let from = this.sourceSquare as string;
                        let to = targetSquare as string;
                        let captureDef = this.chess.get(targetSquare);
                        this.chess.move({ from: from, to: to });
                        if (captureDef){
                            this.chessboard.removePiece(targetSquare!);
                        }
                        this.chessboard.addPiece(this.dragPiece.fenChar, targetSquare);
                        this.chessboard.showMoveHighlights(from, to);
                    }
                    catch(ex){
                        this.cancelDrag();
                    }
                }
            }
            else{
                this.cancelDrag();
            }
            this.dragPiece = null;
            this.dragContainer.innerHTML = "";
            this.dragContainer.style.width = "0px";
            this.dragContainer.style.height = "0px";
        }
    }
    cancelDrag(){
        if (this.dragPiece && this.sourceSquare){
            this.chessboard.addPiece(this.dragPiece.fenChar, this.sourceSquare);
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
import {Chessboard} from "./Chessboard";
import { Shared } from "./Shared";

export default class DragAndDrop
{
    private chessboard:Chessboard;
    private dragType:string;
    private callbackOnDrop:Function;
    private dragPiece: HTMLElement | null = null;
    private dragStartX = 0;
    private dragStartY = 0;
    private scrollTop = 0;
    private deltaScrollTop = 0;
    private scrollLeft = 0;
    private deltaScrollLeft = 0;

    constructor(chessboard:Chessboard, dragType:string, callbackOnDrop:Function)
    {
        this.chessboard = chessboard;
        this.dragType = dragType;
        this.callbackOnDrop = callbackOnDrop;

        document.addEventListener("mousedown", (event) => this.handleMouseDown(event) );
        document.addEventListener("mousemove", (event) => this.handleMouseMove(event) );
        document.addEventListener("mouseup", (event) => this.handleMouseUp(event) );
        document.addEventListener("scroll", () => this.handleScroll() );
        this.preparePieces();
    }
    preparePieces(){
        Object.entries(this.chessboard.pieceElements).forEach(([key, pieceElement]) =>{
            if (this.dragType === "both" || (this.dragType === "white" && key === key.toUpperCase()) || (this.dragType === "black" && key === key.toLowerCase())){
                pieceElement.classList.add("allow-drag");
            }
        });
    }
    private handleMouseDown(event:MouseEvent)
    {
        let isRightClick = event.button && event.button == 2;
        if (!isRightClick && event.target && Shared.isClickOnChessboard(event, this.chessboard))
        {
            this.chessboard.removeAllHighlights();
            let target = event.target as HTMLElement;
            if (target.classList.contains("piece") && target.classList.contains("allow-drag")){
                target.parentElement!.classList.add("source");
                this.dragPiece = event.target as HTMLElement;
                this.dragPiece.classList.add("dragging");
                let rect = this.dragPiece.getBoundingClientRect();
                this.dragStartX = rect.left;
                this.dragStartY = rect.top;
                this.scrollTop = document.documentElement.scrollTop;// Drag position will be incorrect if we don't take scroll into consideration
                this.deltaScrollTop = 0; // Used to adjust the drag position if scrolling occurs during the drag
                this.scrollLeft = document.documentElement.scrollLeft;
                this.deltaScrollLeft = 0;
            }
            event.preventDefault();
        }
    }
    private handleMouseMove(event:MouseEvent){
        if (this.dragPiece) {
            event.preventDefault();
            let deltaX = event.clientX - this.dragStartX;
            let deltaY = event.clientY - this.dragStartY;            
            this.dragPiece.style.left = deltaX + this.deltaScrollLeft + "px";
            this.dragPiece.style.top = deltaY + this.deltaScrollTop + "px";
        }
    }
    private handleMouseUp(event:MouseEvent)
    {
        if (this.dragPiece) {
            this.dragPiece.style.left = "50%";
            this.dragPiece.style.top = "50%";
            this.dragPiece.classList.remove("dragging");
            if (Shared.isClickOnChessboard(event, this.chessboard)){
                event.preventDefault();
                let targetSquareElement = Shared.getClickedSquare(event, this.chessboard);
                if (targetSquareElement !== this.dragPiece.parentElement){
                    let sourceSquareKey = this.dragPiece.parentElement?.getAttribute("data-key");
                    let targetSquareKey = targetSquareElement.getAttribute("data-key");
                    this.callbackOnDrop(sourceSquareKey!, targetSquareKey!);
                }
            }
            this.dragPiece = null;
        }
    }
    private handleScroll()
    {
        if (this.dragPiece) {
            let newDeltaX = document.documentElement.scrollLeft - this.scrollLeft;
            let newDeltaY = document.documentElement.scrollTop - this.scrollTop;
            let changeInDeltaX = newDeltaX - this.deltaScrollLeft;
            let changeInDeltaY = newDeltaY - this.deltaScrollTop;
            this.deltaScrollLeft = newDeltaX;
            this.deltaScrollTop = newDeltaY;
            let clientX = parseInt(this.dragPiece.style.left);
            let clientY = parseInt(this.dragPiece.style.top);
            this.dragPiece.style.left = clientX + changeInDeltaX + "px";
            this.dragPiece.style.top = clientY + changeInDeltaY + "px";
        }
    }
}
import {Chessboard} from "./Chessboard";

export default class DragAndDrop
{
    private chessboard:Chessboard;
    private boardElement: HTMLElement;
    private dragType:string;
    private callbackOnDrop:Function;
    private dragPiece: HTMLElement | null = null;
    private dragStartX = 0;
    private dragStartY = 0;
    private scrollTop = 0;
    private deltaScrollTop = 0;
    private scrollLeft = 0;
    private deltaScrollLeft = 0;

    constructor(chessboard:Chessboard, dragType:string, callbackOnDrop:Function){
        this.chessboard = chessboard;
        this.boardElement = chessboard.boardElement;
        this.dragType = dragType;
        this.callbackOnDrop = callbackOnDrop;

        document.addEventListener("mousedown", (event) => {
            this.handleMouseDown(event);
        });
        document.addEventListener("mousemove", (event) => this.handleMouseMove(event) );
        document.addEventListener("mouseup", (event) => this.handleMouseUp(event) );
        document.addEventListener("scroll", () => this.handleScroll() );
        document.addEventListener("contextmenu", (event) => this.handleContextMenu(event) );
        this.preparePieces();
    }
    preparePieces(){
        let dragablePieces: HTMLImageElement[] = [];
        if (this.dragType === "white")
            dragablePieces = this.chessboard.whitePieces;
        else if (this.dragType === "black")
            dragablePieces = this.chessboard.blackPieces;
        else
            dragablePieces = this.chessboard.whitePieces.concat(this.chessboard.blackPieces);
        dragablePieces.forEach(piece =>{
            piece.classList.add("allow-drag");
        });
    }
    private handleMouseDown(event:MouseEvent)
    {
        if (this.isClickOnThisChessboard(event))
        {
            if (!event.target)
                return false;
            else{
                let target = event.target as HTMLElement;
                let squareElement: HTMLElement | null = null;
                let pieceeElement: HTMLElement | null = null;
                if (target.classList.contains("square"))
                    squareElement = target as HTMLElement;
                else if (target.classList.contains("piece")){
                    pieceeElement = target as HTMLElement;
                    if (target.parentNode)
                        squareElement = target.parentNode as HTMLElement;
                }
                let isRightClick = event.button && event.button == 2;
                if (isRightClick) {
                    if (squareElement){
                        if (squareElement.classList.contains("right-clicked"))
                            squareElement.classList.remove("right-clicked");
                        else
                            squareElement.classList.add("right-clicked");
                    }
                }
                else {
                    this.chessboard.removeAllHighlights();
                    if (squareElement && pieceeElement && pieceeElement.classList.contains("allow-drag"))
                    {
                        squareElement.classList.add("source");
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
                }
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
        if (this.isClickOnThisChessboard(event))
        {
            if (this.dragPiece) {
                event.preventDefault();
                let boardWidthAndHeight = this.boardElement.clientWidth;
                let squareWidthAndHeight = boardWidthAndHeight / 8;
                let boardCoordinateX = event.clientX - this.boardElement.offsetLeft + document.documentElement.scrollLeft;
                let boardCoordinateY = event.clientY - this.boardElement.offsetTop + document.documentElement.scrollTop;
                let rowIndex = Math.floor(boardCoordinateY / squareWidthAndHeight);
                let columnIndex = Math.floor(boardCoordinateX / squareWidthAndHeight);
                let targetSquareIndex = (rowIndex * 8) + columnIndex;
                let targetSquareElement = this.boardElement.children[targetSquareIndex] as HTMLElement;
                if (targetSquareElement !== this.dragPiece.parentElement){
                    let sourceSquareKey = this.dragPiece.parentElement?.getAttribute("data-key");
                    let targetSquareKey = targetSquareElement.getAttribute("data-key");
                    this.callbackOnDrop(sourceSquareKey!, targetSquareKey!);
                }
                this.dragPiece.style.left = "50%";
                this.dragPiece.style.top = "50%";
                this.dragPiece.classList.remove("dragging");
                this.dragPiece = null;
            }
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
    private handleContextMenu(event:MouseEvent)
    {        
        if (this.isClickOnThisChessboard(event))
            event.preventDefault();
    }
    private isClickOnThisChessboard = (event: MouseEvent) =>
    {
        let rect = this.getOffsetRectangle(this.boardElement);
        let point = this.getAbsoluteMousePosition(event);
        return point.x > rect.x && point.x < rect.x + rect.width && point.y > rect.y && point.y < rect.y + rect.height;
    }
    private getOffsetRectangle(element:HTMLElement){
        let rect = { x: element.offsetLeft, y: element.offsetTop, width: element.offsetWidth, height: element.offsetHeight };
        while (element.offsetParent instanceof HTMLElement){
            element = element.offsetParent;
            rect.x += element.offsetLeft;
            rect.y += element.offsetTop;
        }
        return rect;
    }
    private getAbsoluteMousePosition(event:MouseEvent){
        let x = event.clientX + document.documentElement.scrollLeft;
        let y = event.clientY + document.documentElement.scrollTop;
        return { x: x, y: y };
    }
    cancelAnimatedMoves(){
        if (this.dragPiece){
            this.dragPiece.style.transitionProperty = "";
            this.dragPiece.style.left = "";
            this.dragPiece.style.top = "";
            this.dragPiece = null;
        }
    }
}
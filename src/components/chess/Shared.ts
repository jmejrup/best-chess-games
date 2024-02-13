import { Chessboard } from "./Chessboard";

export namespace Shared{
    export function isClickOnChessboard(event: MouseEvent, chessboard:Chessboard)
    {
        let rect = getOffsetRectangle(chessboard.element);
        let point = getAbsoluteMousePosition(event);
        return point.x > rect.x && point.x < rect.x + rect.width && point.y > rect.y && point.y < rect.y + rect.height;
    }
    export function getClickedSquare(event:MouseEvent, chessboard:Chessboard){
        let boardWidthAndHeight = chessboard.element.clientWidth;
        let squareWidthAndHeight = boardWidthAndHeight / 8;
        let boardCoordinateX = event.clientX - chessboard.element.offsetLeft + document.documentElement.scrollLeft;
        let boardCoordinateY = event.clientY - chessboard.element.offsetTop + document.documentElement.scrollTop;
        let rowIndex = Math.floor(boardCoordinateY / squareWidthAndHeight);
        let columnIndex = Math.floor(boardCoordinateX / squareWidthAndHeight);
        let targetSquareIndex = (rowIndex * 8) + columnIndex;
        return chessboard.squareContainer.children[targetSquareIndex] as HTMLElement;
    }
    export function getOffsetRectangle(element:HTMLElement){
        let rect = { x: element.offsetLeft, y: element.offsetTop, width: element.offsetWidth, height: element.offsetHeight };
        while (element.offsetParent instanceof HTMLElement){
            element = element.offsetParent;
            rect.x += element.offsetLeft;
            rect.y += element.offsetTop;
        }
        return rect;
    }
    export function getAbsoluteMousePosition(event:MouseEvent){
        let x = event.clientX + document.documentElement.scrollLeft;
        let y = event.clientY + document.documentElement.scrollTop;
        return { x: x, y: y };
    }
}

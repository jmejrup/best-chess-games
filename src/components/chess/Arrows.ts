import { Chessboard } from "./Chessboard";
import { Shared } from "./Shared";

export default class Arrows{
    chessboard:Chessboard;
    horizontal = ["a", "b", "c", "d", "e", "f", "g", "h"];
    vertical = ["8", "7", "6", "5", "4", "3", "2", "1"];
    svg:SVGSVGElement|null = null;
    strokeWidth = 2.8;
    rightClickedSquare:HTMLElement|null = null;

    constructor(chessboard:Chessboard){
        this.chessboard = chessboard;
        chessboard.callbacks.onRotate = this.onChessboardRotate;
        if (chessboard.isRotated)
            this.onChessboardRotate(true);
        document.addEventListener("mousedown", (event) => this.handleMouseDown(event) );
        document.addEventListener("mouseup", (event) => this.handleMouseUp(event) );
        document.addEventListener("contextmenu", (event) => this.handleContextMenu(event) );
    }
    handleMouseDown(event:MouseEvent){
        let isRightClick = event.button && event.button == 2;
        if (isRightClick && event.target && Shared.isClickOnChessboard(event, this.chessboard))
        {
            this.rightClickedSquare = Shared.getClickedSquare(event, this.chessboard);
            event.preventDefault();
        }
        else if(this.svg){
            this.chessboard.element.removeChild(this.svg);
            this.svg = null;
        }
    }
    handleMouseUp(event:MouseEvent){
        let isRightClick = event.button && event.button == 2;
        if (isRightClick && event.target && Shared.isClickOnChessboard(event, this.chessboard))
        {
            let targetSquare = Shared.getClickedSquare(event, this.chessboard);
            if (targetSquare){
                if (this.rightClickedSquare === targetSquare){
                    if (targetSquare.classList.contains("right-clicked")){
                        targetSquare.classList.remove("right-clicked");
                    }
                    else{
                        targetSquare.classList.add("right-clicked");
                    }
                }
                else if (this.rightClickedSquare){
                    let sourceSquareKey = this.rightClickedSquare.getAttribute("data-key")!;
                    let targetSquareKey = targetSquare.getAttribute("data-key")!;
                    this.drawArrow(sourceSquareKey, targetSquareKey);
                }
                
            }
            event.preventDefault();
        }
        this.rightClickedSquare = null;
    }
    private handleContextMenu(event:MouseEvent)
    {        
        if (Shared.isClickOnChessboard(event, this.chessboard)){
            event.preventDefault();
        }
    }
    onChessboardRotate(isRotated:boolean){
        this.horizontal = this.horizontal.reverse();
        this.vertical = this.vertical.reverse();
    }
    drawArrow(squareKey1:string, squareKey2:string){
        if (this.svg === null){
            this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            this.svg.classList.add('board-svg');
            this.svg.setAttribute('viewBox', '0 0 100 100');
            this.chessboard.element.prepend(this.svg);
        }
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        let point1 = this.svg.createSVGPoint();
        let point2 = this.svg.createSVGPoint();
        let point3 = this.svg.createSVGPoint();
        let point4 = this.svg.createSVGPoint();
        let point5 = this.svg.createSVGPoint();
        let point6 = this.svg.createSVGPoint();
        let point7 = this.svg.createSVGPoint();

        let from = this.getRelativeCenter(squareKey1);
        let to = this.getRelativeCenter(squareKey2);
        let distance = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y -from.y, 2));
        let shortenDistance = 4.5;
        let center = { x: (from.x + to.x)/2, y: (from.y + to.y)/2 };
        let triangleSideLength = 5;
        let a = triangleSideLength / 2;
        let c = triangleSideLength;
        let heightOfTriangle = Math.sqrt(Math.pow(c, 2) - Math.pow(a,2));

        point1.x = center.x - (distance / 2) + shortenDistance;
        point1.y = center.y - this.strokeWidth / 2;

        point2.x = point1.x;
        point2.y = point1.y + this.strokeWidth;

        point3.x = point2.x + distance - heightOfTriangle - shortenDistance;
        point3.y = point2.y;

        point4.x = point3.x;
        point4.y = point3.y + ((triangleSideLength / 2) - (this.strokeWidth / 2));

        point5.x = point4.x + heightOfTriangle;
        point5.y = center.y;

        point6.x = point4.x;
        point6.y = point4.y - triangleSideLength;

        point7.x = point3.x;
        point7.y = point3.y - this.strokeWidth;

        let deltaX = to.x - from.x;
        let deltaY = to.y - from.y;

        let radian = Math.atan2(deltaY, deltaX);
        let degrees = radian * 180 / Math.PI;

        polygon.setAttribute('transform', "rotate(" + degrees + " " + center.x.toString() + " " + center.y.toString() + ")");
        polygon.setAttribute("class", "arrow");
        polygon.points.appendItem(point1);
        polygon.points.appendItem(point2);
        polygon.points.appendItem(point3);
        polygon.points.appendItem(point4);
        polygon.points.appendItem(point5);
        polygon.points.appendItem(point6);
        polygon.points.appendItem(point7);
        this.svg.appendChild(polygon);
    }
    getRelativeCenter(squareKey:string){
        let char = squareKey[0];
        let digit = squareKey[1];
        let x = (this.horizontal.indexOf(char) * 12.5) + 6.25;
        let y = (this.vertical.indexOf(digit) * 12.5) + 6.25;
        return { x, y };
    }
}
import { Chessboard } from "./Chessboard";
import { Shared } from "./Shared";

export default class Arrows{
    chessboard:Chessboard;
    horizontal = ["a", "b", "c", "d", "e", "f", "g", "h"];
    vertical = ["8", "7", "6", "5", "4", "3", "2", "1"];
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    strokeWidth = 2.8;
    strokeColor = "rgba(255, 170, 0, 0.8)";

    constructor(chessboard:Chessboard){
        this.chessboard = chessboard;
        this.svg.classList.add('svg-test');
        this.chessboard.element.prepend(this.svg);
        this.svg.setAttribute('viewBox', '0 0 100 100');
        this.svg.setAttribute('stroke', this.strokeColor);
        this.svg.setAttribute('opacity', "0.8");//??
        chessboard.callbacks.onRotate = this.onChessboardRotate;
        if (chessboard.isRotated)
            this.onChessboardRotate(true);
        this.draw("g8", "f6");
        document.addEventListener("mousedown", (event) => this.handleMouseDown(event) );
        document.addEventListener("mouseup", (event) => this.handleMouseUp(event) );
        document.addEventListener("contextmenu", (event) => this.handleContextMenu(event) );
    }
    handleMouseDown(event:MouseEvent){
        if (Shared.isClickOnChessboard(event, this.chessboard.element))
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
            }
            event.preventDefault();
        }
    }
    handleMouseUp(event:MouseEvent){
        
    }
    private handleContextMenu(event:MouseEvent)
    {        
        if (Shared.isClickOnChessboard(event, this.chessboard.element)){
            event.preventDefault();
        }
    }
    onChessboardRotate(isRotated:boolean){
        this.horizontal = this.horizontal.reverse();
        this.vertical = this.vertical.reverse();
    }
    draw(squareKey1:string, squareKey2:string){
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
        let shortenedDistanceFrom = 4.5;
        let center = new DOMPoint((from.x + to.x)/2, (from.y + to.y)/2);
        let triangleSideLength = 5;
        let a = triangleSideLength / 2;
        let c = triangleSideLength;
        let heightOfTriangle = Math.sqrt(Math.pow(c, 2) - Math.pow(a,2));

        point1.x = center.x - (distance / 2) + shortenedDistanceFrom;
        point1.y = center.y - this.strokeWidth / 2;

        point2.x = point1.x;
        point2.y = point1.y + this.strokeWidth;

        point3.x = point2.x + distance - heightOfTriangle - shortenedDistanceFrom;
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
        
        polygon.points.appendItem(point1);
        polygon.points.appendItem(point2);
        polygon.points.appendItem(point3);
        polygon.points.appendItem(point4);
        polygon.points.appendItem(point5);
        polygon.points.appendItem(point6);
        polygon.points.appendItem(point7);

        polygon.setAttribute('stroke-width', "0");
        polygon.setAttribute('fill', this.strokeColor);
        this.svg.appendChild(polygon);
    }
    getRelativeCenter(squareKey:string):DOMPoint{
        let point = this.svg.createSVGPoint();
        let char = squareKey[0];
        let digit = squareKey[1];
        point.x = (this.horizontal.indexOf(char) * 12.5) + 6.25;
        point.y = (this.vertical.indexOf(digit) * 12.5) + 6.25;
        return point;
    }
}
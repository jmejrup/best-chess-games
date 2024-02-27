import Shared from "../Shared";
import SVG from "../SVG";

interface Arrow {
    from:string,
    to:string
}
export default class ArrowLayer{
    private svgRoot:SVGSVGElement;
    private group:SVGGElement;
    private strokeWidth = 20;
    private rightClickedSquareKey:string|null = null;
    private isRotated = false;
    private currentArrows: Arrow[] = [];

    constructor(svgRoot:SVGSVGElement, isRotated:boolean){
        this.svgRoot = svgRoot;
        let group = SVG.createGroup();
        svgRoot.appendChild(group);
        this.group = group;
        this.isRotated = isRotated;
    }
    rotate(isRotated:boolean){
        this.isRotated = isRotated;
        this.group.innerHTML = "";
        this.currentArrows.forEach(arrow =>{
            this.drawArrow(arrow.from, arrow.to);
        })
    }
    onRightButtonDown(squareKey:string){
        this.rightClickedSquareKey = squareKey;
    }
    onLeftButtonDown(){
        this.group.innerHTML = "";
        this.currentArrows = [];
    }
    onRightButtonUp(squareKey:string){
        if (this.rightClickedSquareKey && this.rightClickedSquareKey !== squareKey){
            this.drawArrow(this.rightClickedSquareKey, squareKey);
        }
    }
    private drawArrow(fromSquare:string, toSquare:string){
        this.currentArrows.push({from:fromSquare, to:toSquare});
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        let point1 = this.svgRoot.createSVGPoint();
        let point2 = this.svgRoot.createSVGPoint();
        let point3 = this.svgRoot.createSVGPoint();
        let point4 = this.svgRoot.createSVGPoint();
        let point5 = this.svgRoot.createSVGPoint();
        let point6 = this.svgRoot.createSVGPoint();
        let point7 = this.svgRoot.createSVGPoint();

        let from = this.getRelativeCenter(fromSquare);
        let to = this.getRelativeCenter(toSquare);
        let distance = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y -from.y, 2));
        let shortenDistance = 30;
        let center = { x: (from.x + to.x)/2, y: (from.y + to.y)/2 };
        let triangleSideLength = 40;
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
        polygon.setAttribute("fill", "rgba(255, 170, 0, 0.8)");
        polygon.points.appendItem(point1);
        polygon.points.appendItem(point2);
        polygon.points.appendItem(point3);
        polygon.points.appendItem(point4);
        polygon.points.appendItem(point5);
        polygon.points.appendItem(point6);
        polygon.points.appendItem(point7);
        this.group.appendChild(polygon);
    }
    private getRelativeCenter(squareKey:string){
        let char = squareKey[0];
        let digit = squareKey[1];
        let x = Shared.getHorizontalIndex(char, this.isRotated) * 100 + 50;
        let y = Shared.getVerticalIndex(digit, this.isRotated) * 100 + 50;
        return { x, y };
    }
}
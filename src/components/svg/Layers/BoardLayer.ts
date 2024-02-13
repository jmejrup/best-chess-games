import SVGSquare from "../SVGSquare";
import Shared from "../Shared";

interface Highlight{
    squareKey:string,
    type:string;
    rect:SVGRectElement;
}
export default class BoardLayer{
    svgRoot:SVGSVGElement;
    isRotated:boolean;
    sourceColor = "rgba(255, 255, 51, 0.3)";
    targetColor = "rgba(255, 255, 51, 0.4)";
    rightClickColor = "rgb(235, 97, 80, 0.8)";
    sourceHighlight:Highlight;
    targetHighlight:Highlight;
    sourceAndTargetGroup:SVGGElement;
    rightClickGroup:SVGGElement;
    rightClicks:Record<string, Highlight|null> = {};
    rightClickedSquareKey:string|null = null;

    constructor(isRotated:boolean){
        this.isRotated = isRotated;
        this.svgRoot = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svgRoot.setAttribute('viewBox', '0 0 8 8');
        let group = document.createElementNS("http://www.w3.org/2000/svg","g");
        this.svgRoot.appendChild(group);

        let colors = ["l", "d", "l", "d", "l", "d", "l", "d"];

        [0, 1, 2, 3, 4, 5, 6, 7].forEach(y =>{
            [0, 1, 2, 3, 4, 5, 6, 7].forEach((x, index) =>{
                group.appendChild(this.createBoardRect(x, y, colors[index]));
            });
            colors = colors.reverse();
        });
        this.sourceAndTargetGroup = document.createElementNS("http://www.w3.org/2000/svg","g");
        this.svgRoot.appendChild(this.sourceAndTargetGroup);
        
        this.sourceHighlight = {squareKey: "a8", type: "source", rect: SVGSquare.createRect(0,0)};
        this.targetHighlight = {squareKey: "a7", type: "target", rect: SVGSquare.createRect(1,0)};
        this.sourceHighlight.rect.setAttribute("fill", "transparent");
        this.targetHighlight.rect.setAttribute("fill", "transparent");
        this.sourceAndTargetGroup.appendChild(this.sourceHighlight.rect);
        this.sourceAndTargetGroup.appendChild(this.targetHighlight.rect);

        this.rightClickGroup = document.createElementNS("http://www.w3.org/2000/svg","g");
        this.svgRoot.appendChild(this.rightClickGroup);
    }
    onLeftButtonDown(event:MouseEvent){
        this.clearAllHighlights();
    }
    onRightButtonDown(squareKey:string){
        this.rightClickedSquareKey = squareKey;
    }
    onRightButtonUp(squareKey:string){
        if (this.rightClickedSquareKey && this.rightClickedSquareKey === squareKey){
            let rightClicked = this.rightClicks[squareKey];
            if (rightClicked){
                this.rightClickGroup.removeChild(rightClicked.rect);
                this.rightClicks[squareKey] = null;
            }
            else{
                this.createRightClickHighlight(squareKey);
            }
        }
    }
    rotate(isRotated:boolean){
        this.isRotated = isRotated;
        this.setPosition(this.sourceHighlight);
        this.setPosition(this.targetHighlight);
        Object.values(this.rightClicks).forEach(rightClick =>{
            if (rightClick){
                this.setPosition(rightClick);
            }
        });
    }
    showTargetAndSource(from:string, to:string){
        this.clearAllHighlights();
        this.showTargetOrSource(from, this.sourceHighlight, this.sourceColor);
        this.showTargetOrSource(to, this.targetHighlight, this.targetColor);
    }
    showTargetOrSource(squareKey:string, highlight:Highlight, color:string){
        highlight.squareKey = squareKey;
        highlight.rect.setAttribute("fill", color);
        this.setPosition(highlight);
    }
    clearAllHighlights(){
        this.sourceHighlight.rect.setAttribute("fill", "transparent");
        this.targetHighlight.rect.setAttribute("fill", "transparent");
        this.rightClicks = {};
        this.rightClickGroup.innerHTML = "";
    }
    createRightClickHighlight(squareKey:string){
        let cords = Shared.getCordinatesBySquareKey(squareKey, this.isRotated);
        let rect = SVGSquare.createRect(cords.x, cords.y);
        rect.setAttribute("fill", this.rightClickColor);
        this.rightClickGroup.appendChild(rect);
        this.rightClicks[squareKey] = {squareKey, type: "RightClick", rect};
    }
    setPosition(highlight:Highlight){
        let cord = Shared.getCordinatesBySquareKey(highlight.squareKey, this.isRotated);
        highlight.rect.setAttribute("x", cord.x.toString());
        highlight.rect.setAttribute("y", cord.y.toString());
    }
    createBoardRect(x:number, y:number, color:string){
        let rect = SVGSquare.createRect(x, y);
        rect.setAttribute("fill", color === "l" ? "rgb(233,237,204)" : "rgb(119,153,84)");
        return rect;
    }
}
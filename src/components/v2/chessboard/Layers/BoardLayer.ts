import SVGSquare from "../SquareFactory";
import Shared from "../Shared";

interface Highlight{
    squareKey:string,
    type:string;
    rect:SVGRectElement;
}
export default class BoardLayer{
    private svgRoot:SVGSVGElement;
    private isRotated:boolean;
    private sourceHighlight:Highlight;
    private targetHighlight:Highlight;
    private sourceTargetGroup:SVGGElement;
    private sourceColor = "rgba(255, 255, 51, 0.3)";
    private targetColor = "rgba(255, 255, 51, 0.4)";
    private rightClickColor = "rgb(235, 97, 80, 0.8)";
    private rightClickGroup:SVGGElement;
    private rightClicks:Record<string, Highlight|null> = {};
    private rightClickedSquareKey:string|null = null;

    constructor(svgRoot:SVGSVGElement, isRotated:boolean){
        this.svgRoot = svgRoot;
        this.isRotated = isRotated;

        let group = document.createElementNS("http://www.w3.org/2000/svg","g");
        this.svgRoot.appendChild(group);

        let colors = ["l", "d", "l", "d", "l", "d", "l", "d"];

        [0, 1, 2, 3, 4, 5, 6, 7].forEach(y =>{
            [0, 1, 2, 3, 4, 5, 6, 7].forEach((x, index) =>{
                group.appendChild(this.createBoardRect(x, y, colors[index]));
            });
            colors = colors.reverse();
        });
        this.sourceTargetGroup = document.createElementNS("http://www.w3.org/2000/svg","g");
        this.svgRoot.appendChild(this.sourceTargetGroup);
        
        this.sourceHighlight = {squareKey: "a8", type: "source", rect: SVGSquare.createRect(0,0)};
        this.targetHighlight = {squareKey: "a7", type: "target", rect: SVGSquare.createRect(1,0)};
        this.sourceHighlight.rect.setAttribute("fill", "transparent");
        this.targetHighlight.rect.setAttribute("fill", "transparent");
        this.sourceTargetGroup.appendChild(this.sourceHighlight.rect);
        this.sourceTargetGroup.appendChild(this.targetHighlight.rect);

        this.rightClickGroup = document.createElementNS("http://www.w3.org/2000/svg","g");
        this.svgRoot.appendChild(this.rightClickGroup);
    }
    onLeftButtonDown(){
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
    highlightSourceAndTarget(from:string, to:string){
        this.clearAllHighlights();
        this.highlightSource(from);
        this.highlightTarget(to);
    }
    highlightSource(from:string){
        this.sourceHighlight.squareKey = from;
        this.sourceHighlight.rect.setAttribute("fill", this.sourceColor);
        this.setPosition(this.sourceHighlight);
    }
    highlightTarget(to:string){
        this.targetHighlight.squareKey = to;
        this.targetHighlight.rect.setAttribute("fill", this.targetColor);
        this.setPosition(this.targetHighlight);
    }
    clearSourceAndTargetHighlights(){
        this.sourceHighlight.rect.setAttribute("fill", "transparent");
        this.targetHighlight.rect.setAttribute("fill", "transparent");
    }
    private showTargetOrSource(squareKey:string, highlight:Highlight, color:string){
        highlight.squareKey = squareKey;
        highlight.rect.setAttribute("fill", color);
        this.setPosition(highlight);
    }
    private clearAllHighlights(){
        this.clearSourceAndTargetHighlights();
        this.rightClicks = {};
        this.rightClickGroup.innerHTML = "";
    }
    private createRightClickHighlight(squareKey:string){
        let cords = Shared.getCordinatesBySquareKey(squareKey, this.isRotated);
        let rect = SVGSquare.createRect(cords.x, cords.y);
        rect.setAttribute("fill", this.rightClickColor);
        this.rightClickGroup.appendChild(rect);
        this.rightClicks[squareKey] = {squareKey, type: "RightClick", rect};
    }
    private setPosition(highlight:Highlight){
        let cord = Shared.getCordinatesBySquareKey(highlight.squareKey, this.isRotated);
        highlight.rect.setAttribute("x", (cord.x * 100).toString());
        highlight.rect.setAttribute("y", (cord.y * 100).toString());
    }
    private createBoardRect(x:number, y:number, color:string){
        let rect = SVGSquare.createRect(x, y);
        rect.setAttribute("fill", color === "l" ? "rgb(233,237,204)" : "rgb(119,153,84)");
        return rect;
    }
}
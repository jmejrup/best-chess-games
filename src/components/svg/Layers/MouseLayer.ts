import SVGSquare from "../SVGSquare";
import Shared from "../Shared";

export default class MouseLayer{
    svgRoot:SVGSVGElement;
    rects:Record<string, SVGRectElement> = {};

    constructor(svgRoot:SVGSVGElement){
        this.svgRoot = svgRoot;
    }
    init(){
        let group = document.createElementNS("http://www.w3.org/2000/svg","g");
        group.setAttribute("fill-opacity", "0");
        this.svgRoot.appendChild(group);
        let index = 0;
        [0, 1, 2, 3, 4, 5, 6, 7].forEach(y =>{
            [0, 1, 2, 3, 4, 5, 6, 7].forEach(x =>{
                let rect = this.createRect(x,y);
                rect.setAttribute("data-index", (index).toString());
                this.rects[index++] = rect;
                group.appendChild(rect);
            });
        });
    }
    createRect(x:number, y:number){
        return SVGSquare.createRect(x, y);
    }
    enableHover(squareKey:string, isRotated:boolean){
        let index = Shared.getCurrentIndexOfSquareKey(squareKey, isRotated);
        this.rects[index].setAttribute("style", "cursor:pointer");
    }
    disableHover(squareKey:string, isRotated:boolean){
        let index = Shared.getCurrentIndexOfSquareKey(squareKey, isRotated);
        this.rects[index].removeAttribute("style");
    }
    clear(){
        Object.values(this.rects).forEach(rect =>{
            rect.removeAttribute("style");
        });
    }
}
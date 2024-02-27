import Shared from "../chessboard/Shared";
import SVG from "../chessboard/SVG";

export default class MouseLayer{
    svgRoot:SVGSVGElement;
    rects:Record<string, SVGRectElement> = {};

    constructor(svgRoot:SVGSVGElement){
        this.svgRoot = svgRoot;
        let group = SVG.createGroup();
        group.setAttribute("fill-opacity", "0");
        this.svgRoot.appendChild(group);
        let index = 0;
        [0, 1, 2, 3, 4, 5, 6, 7].forEach(y =>{
            [0, 1, 2, 3, 4, 5, 6, 7].forEach(x =>{
                let rect = SVG.createSquare(x,y);
                rect.setAttribute("data-index", (index).toString());
                this.rects[index++] = rect;
                group.appendChild(rect);
            });
        });
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
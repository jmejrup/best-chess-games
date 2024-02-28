import BoardLayer from "./Layers/BoardLayer";
import ArrowLayer from "./Layers/ArrowLayer";
import Shared from "./Shared";

export default class MouseEvents{
    svgRoot:SVGSVGElement;
    isRotated:boolean;

    constructor(svgRoot:SVGSVGElement, boardLayer:BoardLayer, arrowLayer:ArrowLayer, isRotated:boolean){
        this.svgRoot = svgRoot;
        this.isRotated = isRotated;

        this.svgRoot.addEventListener("mousedown", (event:MouseEvent) => 
        {
            let isRightClick = event.button && event.button == 2;
            if (isRightClick){
                let squareKey = Shared.getSquareByCursorPosition(this.svgRoot, event, this.isRotated);
                boardLayer.onRightButtonDown(squareKey);
                arrowLayer.onRightButtonDown(squareKey);
            }
            else{
                boardLayer.onLeftButtonDown();
                arrowLayer.onLeftButtonDown();
            }
            event.preventDefault();
        });
        this.svgRoot.addEventListener("mouseup", (event:MouseEvent) => {
            let isRightClick = event.button && event.button == 2;
            if (isRightClick){
                let squareKey = Shared.getSquareByCursorPosition(this.svgRoot, event, this.isRotated);
                boardLayer.onRightButtonUp(squareKey);
                arrowLayer.onRightButtonUp(squareKey);
                event.preventDefault();
            }
        });
        this.svgRoot.addEventListener("contextmenu", (event) => event.preventDefault() );
    }
    rotate(){
        this.isRotated = !this.isRotated;
    }
}
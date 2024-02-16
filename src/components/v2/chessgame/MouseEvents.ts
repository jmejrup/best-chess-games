import Shared from "../chessboard/Shared";
import BoardLayer from "../chessboard/Layers/BoardLayer";
import DragAndDrop from "./DragAndDrop";

export default class MouseEvents{
    svgRoot:SVGSVGElement;
    dragAndDrop:DragAndDrop;
    isRotated:boolean;

    constructor(svgRoot:SVGSVGElement, dragAndDrop:DragAndDrop, isRotated:boolean){
        this.svgRoot = svgRoot;
        this.dragAndDrop = dragAndDrop;
        this.isRotated = isRotated;

        this.svgRoot.addEventListener("mousedown", (event:MouseEvent) => {
            let isRightClick = event.button && event.button == 2;
            if (!isRightClick){
                this.dragAndDrop.onLeftButtonDown(event);
            }
            event.preventDefault();
        });
        document.addEventListener("mouseup", (event:MouseEvent) =>{
            let isRightClick = event.button && event.button == 2;
            if (!isRightClick){
                this.dragAndDrop.onMouseUp(event);
                event.preventDefault();
            }
        });
        document.addEventListener("mousemove", (event:MouseEvent) => {
            this.dragAndDrop.onMouseMove(event);
            event.preventDefault();
        });
        this.svgRoot.addEventListener("scroll", () =>{
            this.dragAndDrop.onScroll();
        });
        this.svgRoot.addEventListener("contextmenu", (event) => event.preventDefault() );
    }
    rotate(isRotated:boolean){
        this.isRotated = isRotated;
    }
}
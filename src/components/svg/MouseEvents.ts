import Shared from "./Shared";
import BoardLayer from "./Layers/BoardLayer";
import ArrowLayer from "./Layers/ArrowLayer";
import DragAndDrop from "./DragAndDrop";

export default class MouseEvents{
    svgRoot:SVGSVGElement;
    boardLayer:BoardLayer;
    arrowLayer:ArrowLayer;
    dragAndDrop:DragAndDrop;
    isRotated:boolean;

    constructor(boardLayer:BoardLayer, arrowLayer:ArrowLayer, dragAndDrop:DragAndDrop, isRotated:boolean){
        this.svgRoot = boardLayer.svgRoot;
        this.boardLayer = boardLayer;
        this.arrowLayer = arrowLayer;
        this.dragAndDrop = dragAndDrop;
        this.isRotated = isRotated;

        this.svgRoot.addEventListener("mousedown", (event:MouseEvent) => {
            let isRightClick = event.button && event.button == 2;
            if (isRightClick){
                let rect = event.target as HTMLElement;
                let index = parseInt(rect.getAttribute("data-index")!);
                let squareKey = Shared.getSquareKeyByIndex(index, this.isRotated);
                this.boardLayer.onRightButtonDown(squareKey);
                this.arrowLayer.onRightButtonDown(squareKey);
            }
            else{
                this.boardLayer.onLeftButtonDown(event);
                this.arrowLayer.onLeftButtonDown(event);
                this.dragAndDrop.onLeftButtonDown(event);
            }
            event.preventDefault();
        });
        this.svgRoot.addEventListener("mouseup", (event:MouseEvent) => {
            let isRightClick = event.button && event.button == 2;
            if (isRightClick){
                let rect = event.target as HTMLElement;
                let index = parseInt(rect.getAttribute("data-index")!);
                let squareKey = Shared.getSquareKeyByIndex(index, this.isRotated);
                this.boardLayer.onRightButtonUp(squareKey);
                this.arrowLayer.onRightButtonUp(squareKey);
                event.preventDefault();
            }
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
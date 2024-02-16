namespace SVGSquare{
    export function createRect(x:number, y:number){
        let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute("x", (x * 100).toString());
        rect.setAttribute("y", (y * 100).toString());
        rect.setAttribute("width", "100");
        rect.setAttribute("height", "100");
        return rect;
    }
}
export default SVGSquare
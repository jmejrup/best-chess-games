namespace SVGSquare{
    export function createRect(x:number, y:number){
        let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute("x", x.toString());
        rect.setAttribute("y", y.toString());
        rect.setAttribute("width", "1");
        rect.setAttribute("height", "1");
        return rect;
    }
}
export default SVGSquare
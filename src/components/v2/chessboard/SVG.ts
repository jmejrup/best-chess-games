namespace SVG{
    export function createSVG(viewBox:string){
        let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', viewBox);
        return svg;
    }
    export function createGroup(){
        return document.createElementNS("http://www.w3.org/2000/svg","g");
    }
    export function createSquare(x:number, y:number, fill?:string){
        return createRect(x * 100, y * 100, 100, 100, fill);
    }
    export function createRect(x:number, y:number, width:number, height:number, fill?:string){
        let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute("x", x.toString());
        rect.setAttribute("y", y.toString());
        rect.setAttribute("width", width.toString());
        rect.setAttribute("height", height.toString());
        if (fill){
            rect.setAttribute("fill", fill);
        }
        return rect;
    }
    export function createCircle(cx:string, cy:string, r:string){
        let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute("cx", cx);
        circle.setAttribute("cy", cy);
        circle.setAttribute("r", r);
        return circle;
    }
    export function createImage(href:string, x:number, y:number, width:number, height:number){
        let image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        image.setAttribute("href", href);
        image.setAttribute("x", x.toString());
        image.setAttribute("y", y.toString());
        image.setAttribute("width", width.toString());
        image.setAttribute("height", height.toString());
        return image;
    }
    export function createText(content:string, transform:string){
        let text = document.createElementNS("http://www.w3.org/2000/svg","text");
        text.setAttribute("transform", transform);
        text.textContent = content;
        return text;
    }
    export function createPath(d:string){
        let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute("d", d);
        return path;
    }
}
export default SVG
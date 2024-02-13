
export function setTargetAndSource(key1:string, key2:string, svg:SVGElement){
    let rect = svg.childNodes[2] as SVGRectElement;
    
}
export function getBoundingBoxOfSvgPath(svg:SVGElement){
    let g = svg.children[0];
    let paths = Array.from(g.children);
    paths.forEach(path =>{
        // let bbox = path.getBB
    });
    // var myPathBox = document.getElementById("myPath").getBBox();
    // console.log(myPathBox);
    // When bounding box is found the viewbox can be adjusted:
    // https://stackoverflow.com/questions/28641165/center-path-inside-svg

    // Here is an advanced javascript that calculates bounding box too:
    // Go to: Calculate bbox from raw pathdata
    //https://stackoverflow.com/questions/40315800/get-bounding-box-of-svg-path
}
export function createBackground(){
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('background');
    svg.setAttribute('viewBox', '0 0 8 8');
    let colors = ["l", "d", "l", "d", "l", "d", "l", "d"];
    for (let y = 0; y < 8; y++){
        for (let x = 0; x < 8; x++){
            svg.appendChild(createRect(x, y, colors[x]));
        }
        colors = colors.reverse();
    }
    
    return svg;
}
function createRect(x:number, y:number, className:string){
    let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    if (x > 0){
        rect.setAttribute("x", x.toString());
    }
    if (y > 0){
        rect.setAttribute("y", y.toString());
    }
    rect.setAttribute("width", "1");
    rect.setAttribute("height", "1");
    rect.setAttribute("class", className);
    return rect;
}
import * as bishop from "./assets/pieces/b.json";
import * as king from "./assets/pieces/k.json";
import * as knight from "./assets/pieces/n.json";
import * as pawn from "./assets/pieces/p.json";
import * as queen from "./assets/pieces/q.json";
import * as rook from "./assets/pieces/r.json";

const pieceSVGData:Record<string, Group> = {};
pieceSVGData["p"] = pawn.g as Group;
pieceSVGData["r"] = rook.g as Group;
pieceSVGData["n"] = knight.g as Group;
pieceSVGData["b"] = bishop.g as Group;
pieceSVGData["q"] = queen.g as Group;
pieceSVGData["k"] = king.g as Group;

interface Group{
    g: Group|undefined;
    transform:string|undefined;
    style:string[]|undefined;
    path:Path[]|undefined|null;
    circle:Circle[]|undefined;
}
interface Path{
    style:string[]|undefined;
    d:string;
    colorIndex:number|undefined;
}
interface Circle{
    cx:string;
    cy:string;
    r:string;
}
const pieceTypes:Record<string, SVGGElement> = {};
["p","n","b","r","q","k","P","N","B","R","Q","K"].forEach(fenChar =>{
    let g = document.createElementNS("http://www.w3.org/2000/svg","g");
    let data = pieceSVGData[fenChar.toLowerCase()];
    let color = fenChar === fenChar.toLowerCase() ? 0 : 1;
    loadChildren(g, data, color);
    pieceTypes[fenChar] = g;
});
function loadChildren(g:SVGGElement, group:Group, color:number){
    if (group.transform){
        g.setAttribute("transform", group.transform);
    }
    if (group.style && group.style[color]){
        g.setAttribute("style", group.style[color]);
    }
    if (group.circle){
        group.circle.forEach(circle =>{
            let c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            c.setAttribute("cx", circle.cx);
            c.setAttribute("cy", circle.cy);
            c.setAttribute("r", circle.r);
            g.appendChild(c);
        });
    }
    if (group.path){
        group.path.forEach(path =>{
            let p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            if (path.colorIndex === undefined || path.colorIndex === color){
                p.setAttribute("d", path.d);
                if (path.style){
                    p.setAttribute("style", path.style[color]);
                }
                g.appendChild(p);
            }
        });
    }
    if (group.g){
        let childGroup = document.createElementNS("http://www.w3.org/2000/svg","g");
        g.appendChild(childGroup);
        loadChildren(childGroup, group.g, color);
    }
}
export namespace PieceFactory{
    export function get(fenChar:string):SVGGElement{
        return pieceTypes[fenChar].cloneNode(true) as SVGGElement;
    }
}

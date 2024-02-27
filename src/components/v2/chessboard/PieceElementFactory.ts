import * as bishop from "./assets/pieces/b.json";
import * as king from "./assets/pieces/k.json";
import * as knight from "./assets/pieces/n.json";
import * as pawn from "./assets/pieces/p.json";
import * as queen from "./assets/pieces/q.json";
import * as rook from "./assets/pieces/r.json";
import SVG from "./SVG";

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
const pieceElementTypes:Record<string, SVGGElement> = {};
["p","n","b","r","q","k","P","N","B","R","Q","K"].forEach(fenChar =>{
    let g = SVG.createGroup();
    let data = pieceSVGData[fenChar.toLowerCase()];
    let color = fenChar === fenChar.toLowerCase() ? 0 : 1;
    loadChildren(g, data, color);
    pieceElementTypes[fenChar] = g;
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
            let c = SVG.createCircle(circle.cx, circle.cy, circle.r);
            g.appendChild(c);
        });
    }
    if (group.path){
        group.path.forEach(path =>{
            let p = SVG.createPath(path.d);
            if (path.colorIndex === undefined || path.colorIndex === color){
                if (path.style){
                    p.setAttribute("style", path.style[color]);
                }
            }
            g.appendChild(p);
        });
    }
    if (group.g){
        let childGroup = SVG.createGroup();
        g.appendChild(childGroup);
        loadChildren(childGroup, group.g, color);
    }
}
namespace PieceElementFactory{
    export function get(fenChar:string):SVGGElement{
        return pieceElementTypes[fenChar].cloneNode(true) as SVGGElement;
    }
}
export default PieceElementFactory;

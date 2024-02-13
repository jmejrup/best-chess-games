
export class Piece{
    element:SVGGElement;
    fenChar:string;
    squareKey:string | null = null;
    constructor(element:SVGGElement, fenChar:string){
        this.element = element;
        this.fenChar = fenChar;
    }
}

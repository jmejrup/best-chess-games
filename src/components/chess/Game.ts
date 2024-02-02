export class Game{
    date: string | undefined;
    event: string | undefined;
    round: string | undefined;
    white: string | undefined;
    black: string | undefined;
    movetext: string;
    result: string;
    startFen: string | undefined;
    moves: Move[] = [];
    constructor(moveText: string, result:string){
        this.movetext = moveText;
        this.result = result;
    }
}
export class Move{
    number:number;
    color:string;
    from: string;
    to: string;
    notation: string;
    promotion: string;
    captured: string;
    constructor(number:number, color:string, from:string, to:string, notation:string, promotion:string, captured:string){
        this.number = number;
        this.color = color;
        this.from = from;
        this.to = to;
        this.notation = notation;
        this.promotion = promotion;
        this.captured = captured;
    }
}
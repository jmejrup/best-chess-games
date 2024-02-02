export class GameMenuItem{
    date:string;
    event:string;
    round:string;
    white:string;
    black:string;
    moveText:string;
    result:string;

    constructor(date:string, event: string, round:string, white:string, black:string, moveText:string, result:string)
    {
        this.date = date;
        this.event = event;
        this.round = round;
        this.white = white;
        this.black = black;
        this.moveText = moveText;
        this.result = result;
    }
    header (){
        return this.date + " " + this.event;
    }
}
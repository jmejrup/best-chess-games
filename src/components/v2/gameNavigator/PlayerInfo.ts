import { CapturePieceFactory } from "./CapturePieceFactory";
import { Move } from "chess.js";

const pieceValues:Record<string, number> = {["p"]:1,["n"]:3,["b"]:3,["r"]:5,["q"]:9,["k"]:0,["P"]:-1,["N"]:-3,["B"]:-3,["R"]:-5,["Q"]:-9,["K"]:0};

export default class PlayerInfo{
    private container:HTMLElement;
    private containerAbove:HTMLElement;
    private containerBelow:HTMLElement;
    private whitePlayer:HTMLElement;
    private blackPlayer:HTMLElement;
    private whiteCaptures:Record<string, HTMLElement> = {};
    private blackCaptures:Record<string, HTMLElement> = {};
    private whiteScore:HTMLElement;
    private blackScore:HTMLElement;
    private whitePlayerName:HTMLElement;
    private blackPlayerName:HTMLElement;
    private isRotated:boolean;

    constructor(container:HTMLElement, fen:string, isRotated:boolean){
        this.container = container;
        this.isRotated = isRotated;
        this.containerAbove = this.addChild(this.container, "div", "above");
        this.container.insertBefore(this.containerAbove, this.container.firstChild);
        this.containerBelow = this.addChild(this.container, "div", "below");

        this.blackPlayer = this.addChild(isRotated ? this.containerBelow : this.containerAbove, "div", "player black " + (isRotated ? "below" : "above"));
        this.whitePlayer = this.addChild(isRotated ? this.containerAbove : this.containerBelow, "div", "player white " + (isRotated ? "above" : "below"));

        let blackCapture = this.addChild(this.blackPlayer, "div", "captures");
        let whiteCapture = this.addChild(this.whitePlayer, "div", "captures");

        let record = [this.whiteCaptures, this.blackCaptures];
        [whiteCapture, blackCapture].forEach((element, index) =>{
            ["p", "n", "b", "r", "q"].forEach(type =>{
                let child = this.addChild(element, "span", type);
                record[index][type] = child;
            });
        });
        this.whiteScore = this.addChild(this.whitePlayer, "span", "score");
        this.blackScore = this.addChild(this.blackPlayer, "span", "score");
        this.whitePlayerName = this.addChild(this.whitePlayer, "div", "name", "White");
        this.blackPlayerName = this.addChild(this.blackPlayer, "div", "name", "Black");
        if (fen){
            this.setScoreAndCaputereByFen(fen);
        }
    }
    rotate(){
        this.isRotated = !this.isRotated;
        this.containerAbove.appendChild(this.isRotated ? this.whitePlayer : this.blackPlayer);
        this.containerBelow.appendChild(this.isRotated ? this.blackPlayer : this.whitePlayer);
    }
    addCapture(move:Move){
        let fenChar = this.getComputedCapture(move);
        this.addComputedCapture(fenChar);
        this.setScoreByFen(move.after);
    }
    undoCapture(move:Move){
        let fenChar = this.getComputedCapture(move);
        let fenCharLowerCase = fenChar.toLowerCase();
        let isBlack = fenChar === fenCharLowerCase;
        let span = isBlack ? this.whiteCaptures[fenCharLowerCase] : this.blackCaptures[fenCharLowerCase];
        span.removeChild(span.firstChild!);
        this.setScoreByFen(move.before);
    }
    setPlayerNames(black:string, white:string){
        this.blackPlayerName.innerHTML = black;
        this.whitePlayerName.innerHTML = white;
    }
    setScoreAndCaputereByFen(fen:string){     
        Object.values(this.whiteCaptures).concat(Object.values(this.blackCaptures)).forEach(element =>{
            element.innerHTML = "";
        });
        if (fen === "start" || fen === ""){
            this.setScore(0);
        }
        else{
            let captures = this.getCapturesByFen(fen);
            Object.entries(captures).forEach(([fenChar, count]) =>{
                if (count > 0){
                    for (let i = 0; i < count; i++){
                        this.addComputedCapture(fenChar);
                    }
                }
            });
            this.setScoreByFen(fen);
        }
    }
    private addComputedCapture(fenChar:string){
        let fenCharLowerCase = fenChar.toLowerCase();
        let piece = CapturePieceFactory.get(fenChar);
        let isBlack = fenChar === fenCharLowerCase;
        let span = isBlack ? this.whiteCaptures[fenCharLowerCase] : this.blackCaptures[fenCharLowerCase];
        span.appendChild(piece);
    }
    private setScoreByFen(fen:string){
        fen = fen.split(" ")[0].split("/").join("");
        let score = 0;
        for (const char of fen){
            if (isNaN(parseInt(char))){
                score -= pieceValues[char];
            }
        }
        this.setScore(score);
    }
    private setScore(score:number){
        let whitePrefix = score === 0 ? "" : (score > 0 ? "+" : "-");
        let blackPrefix = score === 0 ? "" : (score > 0 ? "-" : "+");
        this.whiteScore.innerHTML = score === 0 ? "" : (whitePrefix + Math.abs(score));
        this.blackScore.innerHTML = score === 0 ? "" : (blackPrefix + Math.abs(score));
    }
    // A promoted pawn will only show as a pawn in the capture panel
    private getComputedCapture(move:Move){
        let capture = move.captured!;
        let fenChar = move.color === "b" ? capture.toUpperCase() : capture;
        if (capture !== "p"){
            let count = 0;
            let fen = move.after.split(" ")[0].split("/").join("");
            for (const char of fen){
                if (isNaN(parseInt(char))){
                    if (char === fenChar){
                        count++;
                    }
                }
            }
            if (count >= 2 || (capture === "q" && count >= 1) ){
                fenChar = move.color === "b" ? "P" : "p";
            }
        }
        return fenChar;
    }
    private getCapturesByFen(fen:string):Record<string,number>{
        // example: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        fen = fen.split(" ")[0].split("/").join("");
        // make a record of all types of pieces and set initial count to zero
        let fenChars: Record<string, number> = {};
        ["p","n","b","r","q","P","N","B","R","Q"].forEach(char =>{
            fenChars[char] = 0;
        });
        // calculate how many pieces we have of each kind
        for (const char of fen) {
            if (isNaN(parseInt(char))){
                fenChars[char] += 1;
            }
        };
        // we need to return a similar record showing how many pieces have been taken
        let captures: Record<string, number> = {};
        // we started having 2 rooks, knights and bishops. We could have more due to promotion
        for (const char of ["r", "n", "b", "R", "N", "B"]){
            captures[char] = fenChars[char] >= 2 ? 0 : 2 - fenChars[char];
        }
        for (const char of ["q", "Q"]){
            captures[char] = fenChars[char] > 0 ? 0 : 1;
        }
        // Counting captures is difficult due to possible promotion
        let black = {pawn:"p", queen: "q", pieces:["r", "n", "b"]};
        let white = {pawn:"P", queen: "Q", pieces:["R", "N", "B"]};
        for (const player of [black, white])
        {
            captures[player.pawn] = 8 - fenChars[player.pawn];
            if (fenChars[player.queen] > 1){
                captures[player.pawn] -= fenChars[player.queen] -1;
            }
            for (const piece of player.pieces){
                if (fenChars[piece] > 2){
                    captures[player.pawn] -= fenChars[piece] -2;
                }
            }
        }
        return captures;
    }
    private addChild(parent:HTMLElement, tag:string, className:string, text?:string){
        let child = document.createElement(tag);
        child.className = className;
        if (text)
            child.innerHTML = text;
        parent.appendChild(child);
        return child;
    }
}
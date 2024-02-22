import Chessboard from "../chessboard/Chessboard";
import { CapturePieceFactory } from "./CapturePieceFactory";
import Game from "./Game";

const pieceValues:Record<string, number> = {["p"]:1,["n"]:3,["b"]:3,["r"]:5,["q"]:9,["P"]:-1,["N"]:-3,["B"]:-3,["R"]:-5,["Q"]:-9};

export default class PlayerInfo{
    private container:HTMLElement;
    private whitePlayer:HTMLElement;
    private blackPlayer:HTMLElement;
    private whiteCaptures:Record<string, HTMLElement> = {};
    private blackCaptures:Record<string, HTMLElement> = {};
    private score = 0;
    private whiteScore:HTMLElement;
    private blackScore:HTMLElement;
    private whitePlayerName:HTMLElement;
    private blackPlayerName:HTMLElement;

    constructor(container:HTMLElement, fen:string, isRotated:boolean){
        this.container = container;
        this.blackPlayer = this.addChild(this.container, "div", "player black " + (isRotated ? "below" : "above"));
        this.whitePlayer = this.addChild(this.container, "div", "player white " + (isRotated ? "above" : "below"));

        let playerAboveBoard = isRotated ? this.whitePlayer : this.blackPlayer;
        this.container.insertBefore(playerAboveBoard, this.container.firstChild!);

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
    rotate(isRotated:boolean){
        let playerAboveBoard = isRotated ? this.whitePlayer : this.blackPlayer;
        let playerBelowBoard = isRotated ? this.blackPlayer : this.whitePlayer;
        this.container.insertBefore(playerAboveBoard, this.container.firstChild!);
        this.container.appendChild(playerBelowBoard);
        playerAboveBoard.classList.remove("below");
        playerBelowBoard.classList.remove("above");
        playerAboveBoard.classList.add("above");
        playerBelowBoard.classList.add("below");
    }
    setScore(score:number){
        this.score = score;
        let whitePrefix = score === 0 ? "" : (score > 0 ? "+" : "-");
        let blackPrefix = score === 0 ? "" : (score > 0 ? "-" : "+");
        this.whiteScore.innerHTML = score === 0 ? "" : (whitePrefix + Math.abs(score));
        this.blackScore.innerHTML = score === 0 ? "" : (blackPrefix + Math.abs(score));
    }
    setPlayerNames(black:string, white:string){
        this.blackPlayerName.innerHTML = black;
        this.whitePlayerName.innerHTML = white;
    }
    setScoreAndCaputereByFen(fen:string){     
        Object.values(this.whiteCaptures).concat(Object.values(this.blackCaptures)).forEach(element =>{
            element.innerHTML = "";
        });
        this.setScore(0);
        if (fen !== "start" && fen !== ""){
            let standing = this.calculateScoreAndCapturesByFen(fen);
            Object.entries(standing.captures).forEach(([fenChar, count]) =>{
                if (count > 0){
                    for (let i = 0; i < count; i++){
                        this.addCapture(fenChar);
                    }
                }
            });
        }
    }
    addCapture(fenChar:string){
        let piece = CapturePieceFactory.get(fenChar);
        let fenCharLowerCase = fenChar.toLowerCase();
        let isBlack = fenChar === fenCharLowerCase;
        let span = isBlack ? this.whiteCaptures[fenCharLowerCase] : this.blackCaptures[fenCharLowerCase];
        span.appendChild(piece);
        let pieceValue = pieceValues[fenChar];
        let newScore = this.score + pieceValue;
        this.setScore(newScore);
    }
    removeCapture(fenChar:string){
        let fenCharLowerCase = fenChar.toLowerCase();
        let isBlack = fenChar === fenCharLowerCase;
        let span = isBlack ? this.whiteCaptures[fenCharLowerCase] : this.blackCaptures[fenCharLowerCase];
        span.removeChild(span.firstChild!);
        let pieceValue = pieceValues[fenChar];
        let newScore = this.score - pieceValue;
        this.setScore(newScore);
    }
    calculateScoreAndCapturesByFen(fen:string){
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
        // if the score is positive white is leading
        let score = fenChars["P"] - fenChars["p"];
        score += (fenChars["N"] + fenChars["B"] - fenChars["n"] - fenChars["b"]) * 3;
        score += (fenChars["R"] - fenChars["r"]) * 5;
        score += (fenChars["Q"] - fenChars["q"]) * 9;
        // we need to return a similar record showing how many pieces have been taken
        let captures: Record<string, number> = {};
        // we started having 2 rooks, knights and bishops. We could have more due to promotion
        for (const char of ["r", "n", "b", "R", "N", "B"]){
            captures[char] = fenChars[char] >= 2 ? 0 : 2 - fenChars[char];
        }
        for (const char of ["q", "Q"]){
            captures[char] = fenChars[char] > 0 ? 0 : 1;
        }
        // Counting taken pawns is difficult due to possible promotion
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
        return {score, captures}
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
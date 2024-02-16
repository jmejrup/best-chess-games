import Chessboard from "../chessboard/Chessboard";
import { CapturePieceFactory } from "./CapturePieceFactory";
import "./gameBrowser.css";

const pieceValues:Record<string, number> = {["p"]:1,["n"]:3,["b"]:3,["r"]:5,["q"]:9};

export default class GameBrowser{
    container:HTMLElement;
    chessboard:Chessboard;

    private whiteCaptures:Record<string, HTMLElement> = {};
    private blackCaptures:Record<string, HTMLElement> = {};
    private score = 0;
    private whiteScore:HTMLElement;
    private blackScore:HTMLElement;
    private whitePlayerName:HTMLElement;
    private blackPlayerName:HTMLElement;

    constructor(container:HTMLElement, fen:string, isRotated:boolean){
        this.container = container;
        let blackPlayer = this.addChild(this.container, "div", "player black");
        let boardContainer = this.addChild(container, "div", "cboard");
        this.chessboard = new Chessboard(boardContainer, fen, isRotated);
        let whitePlayer = this.addChild(this.container, "div", "player white");

        let blackCapture = this.addChild(blackPlayer, "div", "captures");
        let whiteCapture = this.addChild(whitePlayer, "div", "captures");

        let record = [this.whiteCaptures, this.blackCaptures];
        [whiteCapture, blackCapture].forEach((element, index) =>{
            ["p", "n", "b", "r", "q"].forEach(type =>{
                let child = this.addChild(element, "span", type);
                record[index][type] = child;
            });
        });
        this.whiteScore = this.addChild(whitePlayer, "span", "score");
        this.blackScore = this.addChild(blackPlayer, "span", "score");
        this.whitePlayerName = this.addChild(whitePlayer, "div", "name", "White");
        this.blackPlayerName = this.addChild(blackPlayer, "div", "name", "Black");

        if (fen){
            this.setScoreAndCaputereByFen(fen);
        }
    }
    private addChild(parent:HTMLElement, tag:string, className:string, text?:string){
        let child = document.createElement(tag);
        child.className = className;
        if (text)
            child.innerHTML = text;
        parent.appendChild(child);
        return child;
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
        // Object.values(this.whiteCaptures).concat(Object.values(this.blackCaptures)).forEach(element =>{
        //     element.innerHTML = "";
        // });
        // this.pieceElements = [];
        // this.setScore(0);
        if (fen !== "start" && fen !== ""){
            let standing = this.calculateScoreAndCapturesByFen(fen);
            Object.entries(standing.captures).forEach(([fenChar, count]) =>{
                if (count > 0){
                    let color = fenChar === fenChar.toUpperCase() ? "b" : "w";
                    for (let i = 0; i < count; i++){
                        let piece = CapturePieceFactory.get(fenChar);
                        this.addCapture(color, fenChar.toLowerCase(), piece);
                    }
                }
            });
        }
    }
    addCapture(color:string, captured:string, piece:SVGSVGElement){
        let span = color === "b" ? this.blackCaptures[captured] : this.whiteCaptures[captured];
        span.appendChild(piece);
        let pieceValue = pieceValues[captured];
        let newScore = this.score + (color === "b" ? -1 * pieceValue : pieceValue);
        this.setScore(newScore);
    }
    undoCapture(color:string, captured:string){
        let pieceValue = pieceValues[captured];
        let newScore = this.score + (color === "b" ? pieceValue : pieceValue * -1);
        this.setScore(newScore);
        return (color === "b" ? this.blackCaptures[captured].firstChild : this.whiteCaptures[captured].firstChild) as HTMLImageElement;
    }
    createPiece(fenChar:string){
        // let pieceElement = document.createElement("img");
        // pieceElement.className = "piece";
        // pieceElement.setAttribute("data-type", fenChar);
        // pieceElement.src = Icons.PieceUrl[fenChar];
        // this.pieceElements.push(pieceElement);
        // return pieceElement;
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
}
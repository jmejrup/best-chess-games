import "./chessboard.css";
import pieceUrlNeo from "./themes/pieces/neo";

export class Square{
    element: HTMLElement;
    key:string;
    constructor(element: HTMLElement, key:string){
        this.element = element;
        this.key = key;
    }
}
export class Chessboard{
    boardElement: HTMLElement;
    squares: Record<string, Square> = {};
    private squareKeys = ["a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8", "a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7", "a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6", "a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5", "a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4", "a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3", "a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2", "a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"];
    private pieceUrl = pieceUrlNeo;
    whitePieces: HTMLImageElement[] = [];
    blackPieces: HTMLImageElement[] = [];

    constructor(boardElement: HTMLElement, fen:string){
        this.boardElement = boardElement;
        this.boardElement.classList.add("cboard");

        this.createEmptySquares();
        if (fen){
            this.setFen(fen);
        }
    }
    getPieceUrl(fenChar:string){
        return this.pieceUrl[fenChar];
    }
    private createEmptySquares(): Record<string, Square>{
        let newSquares: Record<string, Square> = {};
        this.squareKeys.forEach(key =>{
            let squareElement = document.createElement("div");
            squareElement.className = "square";
            squareElement.setAttribute("data-key", key);
            this.boardElement.appendChild(squareElement);
            this.squares[key] = new Square(squareElement, key);
        });
        let floatClearer = this.boardElement.appendChild(document.createElement("div"));
        floatClearer.className = "clearer";
        return newSquares;
    }
    setFen(fen:string){
        Object.values(this.squares).forEach(square =>{
            square.element.innerHTML = "";
            square.element.className = "square";
        });
        if (fen !== ""){
            if (fen.toLowerCase() === "start")
                fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
            fen = fen.split(" ")[0].split("/").join("");
            let squareIndex = 0;
            for (let i = 0; i < fen.length; i++){
                let fenChar = fen[i];
                let nummericValue = parseInt(fenChar);
                if (!isNaN(nummericValue)){
                    squareIndex += nummericValue;
                }
                else{
                    let key = this.squareKeys[squareIndex++];
                    let pieceElement = document.createElement("img");
                    pieceElement.className = "piece";
                    pieceElement.setAttribute("data-type", fenChar);
                    pieceElement.src = this.pieceUrl[fenChar];
                    this.squares[key].element.appendChild(pieceElement);
                    if (fenChar === fenChar.toUpperCase()){
                        this.whitePieces.push(pieceElement);
                    }
                    else{
                        this.blackPieces.push(pieceElement);
                    }
                }
            }
        }
    }
    rotate = () => {
        let array = Array.from(this.boardElement.children).reverse();
        let floatClearer = array[0];
        let squareElements = array.slice(1);
        this.boardElement.append(...squareElements, floatClearer); 
    }
    removeAllHighlights()
    {
        Object.values(this.squares).forEach(square =>{
            square.element.className = "square";
        });
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
        return {score, captures, pieceUrl: this.pieceUrl}
    }
}
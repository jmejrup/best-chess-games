import Chessboard from "../svg/Chessboard";

export default class GameInfo{
    chessboard:Chessboard;
    svgRoot:SVGSVGElement;
    playerInfo:SVGGElement[] = [];

    constructor(container:HTMLElement, fen:string, white:string, black:string){
        this.svgRoot = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svgRoot.setAttribute('viewBox', '0 0 800 870');
        container.appendChild(this.svgRoot);

        this.createPlayerInfo(0, black);
        let boardGroup = document.createElementNS("http://www.w3.org/2000/svg","g");
        this.svgRoot.appendChild(boardGroup);
        boardGroup.setAttribute("transform", "translate(0,0)")


        this.chessboard = new Chessboard(boardGroup, fen, false);
        this.createPlayerInfo(1, white);

        if (fen !== "start" && fen !== ""){
            let standing = this.calculateScoreAndCapturesByFen(fen);
            Object.entries(standing.captures).forEach(([fenChar, value]) =>{
                if (value > 0){
                    let color = fenChar === fenChar.toUpperCase() ? 0 : 1;
                    for (let i = 0; i < value; i++){
                        let piece = this.chessboard.pieceLayer.createPiece(fenChar);
                        this.addCapture(color, piece);
                    }
                }
            });
        }
    }
    addCapture(color:number, piece:SVGGElement){
        this.playerInfo[color].appendChild(piece);
    }
    createPlayerInfo(color:number, playerName:string){
        let playerInfo = document.createElementNS("http://www.w3.org/2000/svg","g");
        this.svgRoot.appendChild(playerInfo);
        this.playerInfo.push(playerInfo);
        playerInfo.setAttribute("transform", "translate(0," + (color === 0 ? "0": "835") + ")");
        
        let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute("x", "0");
        rect.setAttribute("y", "0");
        rect.setAttribute("width", "800");
        rect.setAttribute("height", "35");
        rect.setAttribute("stroke", "black");
        this.playerInfo[color].appendChild(rect);

        let text = document.createElementNS("http://www.w3.org/2000/svg","text");
        text.textContent = playerName;
        text.setAttribute("text-anchor", "end");
        text.setAttribute("y", "17");
        text.setAttribute("x", "527");
        text.setAttribute("fill", "white");
        text.setAttribute("transform", "scale(1.5)");
        this.playerInfo[color].appendChild(text);
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
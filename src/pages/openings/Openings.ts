import "./openings.css";
import Chessboard from "../../components/v2/chessboard/Chessboard";
import GameBrowser from "../../components/v2/gameBrowser/GameBrowser";
import Chessgame from "../../components/v2/chessgame/Chessgame";
import { Chess, Move } from "chess.js";
import * as json from "../../components/chess/assets/data/games.json";

// let boardContainer = document.getElementById("chessboard") as HTMLElement;
// let chessboard = new Chessboard(boardContainer, "start", false);

// document.getElementById("test")!.onclick = () => chessboard.test();
// let f ="r7/3qp1k1/1p1p1pP1/p1nP1P2/PnP5/4B3/4B3/1Q3K2 w - - 1 28";
let fen = "8/kpPK4/8/8/8/8/8/8";
let browserContainer = document.getElementById("gameBrowser") as HTMLElement;
let gameBrowser = new GameBrowser(browserContainer, "", false);
let chess = new Chess();
// chess.loadPgn(json.games[0].moveText);
chess.loadPgn("1. e4 f5 2. exf5 g6 3. fxg6 d5 4. gxh7 Nc6 5. hxg8=Q Rg8 6. Bd3 Be6 7. Nf3 Qd6 8. O-O O-O-O");
let moves = chess.history({verbose:true});
gameBrowser.loadGame({whitePlayer:"White player", blackPlayer:"Black player", moves});

// gameBrowser.goToMove(24);

// let gameContainer = document.getElementById("chessgame") as HTMLElement;
// let chessgame = new Chessgame(gameContainer, "start", false);

let start = document.getElementById("start") as HTMLButtonElement;
start.onclick = () => {gameBrowser.goToMove(-1)};

let rewind = document.getElementById("rewind") as HTMLButtonElement;
rewind.onclick = () => {gameBrowser.rewind()};

let previous = document.getElementById("prev") as HTMLButtonElement;
previous.onclick = () => {gameBrowser.previous()};

let play = document.getElementById("play") as HTMLButtonElement;
play.onclick = () => {gameBrowser.play()};

let pause = document.getElementById("pause") as HTMLButtonElement;
pause.onclick = () => {gameBrowser.pause()};

let next = document.getElementById("next") as HTMLButtonElement;
next.onclick = () => {gameBrowser.next()};

let forward = document.getElementById("forward") as HTMLButtonElement;
forward.onclick = () => {gameBrowser.forward()};

let end = document.getElementById("end") as HTMLButtonElement;
end.onclick = () => {gameBrowser.goToMove(moves.length -1)};

let rotate = document.getElementById("rotate") as HTMLButtonElement;
rotate.onclick = () => {gameBrowser.rotate()};

// goToMove.onclick = () => {gameBrowser.goToMove(24)};


// let img = document.getElementById("my-img") as HTMLImageElement;
// img.src = board2;
// let svg = createBackground();
// document.body.append(svg);
// debugger;

// setTargetAndSource("e2", "e4", svg);

// let board = document.getElementById("board") as HTMLElement;
// let svg = board.firstChild as HTMLImageElement;
// svg.src = boardbg;
// for (let element of board.children){
//     if (!element.classList.contains("background")){
//         let image = element.lastChild as HTMLImageElement;
//         if (image.classList.contains("wp")){
//             image.src = Icons.PieceUrl["P"];
//         }
//         else if (image.classList.contains("wr")){
//             image.src = Icons.PieceUrl["R"];
//         }
//         else if (image.classList.contains("wn")){
//             image.src = Icons.PieceUrl["N"];
//         }
//         else if (image.classList.contains("wb")){
//             image.src = Icons.PieceUrl["B"];
//         }
//         else if (image.classList.contains("wq")){
//             image.src = Icons.PieceUrl["Q"];
//         }
//         else if (image.classList.contains("wk")){
//             image.src = Icons.PieceUrl["K"];
//         }
//     }
    
// }
// let queen = document.getElementsByTagNameNS("http://www.w3.org/2000/svg", "*")[68];
// let bbox = king.getBoundingClientRect();
// console.log(bbox);

// let svgTags = document.getElementsByTagName("svg") as HTMLCollectionOf<SVGElement>;
// let queen = svgTags[1] as SVGElement;
// getBoundingBoxOfSvgPath(queen);

// import "../master.css";
// import { Chessboard } from "../../components/chess/Chessboard";

// let chessboardContainer = document.getElementById("chessboard") as HTMLElement;
// let chessboard = new Chessboard(chessboardContainer, "start", false);
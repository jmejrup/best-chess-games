import Icons from "../../components/chess/Icons";
import "./openings.css";
import { createBackground, setTargetAndSource, getBoundingBoxOfSvgPath } from "./Background";
import board2 from "./board2.svg";
import Chessboard from "../../components/svg/Chessboard";
import GameInfo from "../../components/gameInfo/GameInfo";

// let boardContainer = document.getElementById("chessboard") as HTMLElement;
// let chessboard = new Chessboard(boardContainer, "start", false);

// document.getElementById("test")!.onclick = () => chessboard.test();

let container = document.getElementById("gameInfoContainer") as HTMLElement;
let gameInfo = new GameInfo(container, "r7/3qp1k1/1p1p1pP1/p1nP1P2/PnP5/4B3/4B3/1Q3K2 w - - 1 28", "White", "Black");;




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
import "./openings.css";
import Chessboard from "../../components/v2/chessboard/Chessboard";
import GameNavigator from "../../components/v2/gameNavigator/GameNavigator";
import Buttons from "../../components/v2/gameNavigator/Buttons";
import Chessgame from "../../components/v2/chessgame/Chessgame";
import { Chess, Move } from "chess.js";
import * as json from "../../components/chess/assets/data/games.json";

// let boardContainer = document.getElementById("chessboard") as HTMLElement;
// let chessboard = new Chessboard(boardContainer, "start", false);
// let f ="r7/3qp1k1/1p1p1pP1/p1nP1P2/PnP5/4B3/4B3/1Q3K2 w - - 1 28";
// let fen = "8/kpPK4/8/8/8/8/8/8";

let gameNavigatorContainer = document.getElementById("gameNavigator") as HTMLElement;
let gameNavigator = new GameNavigator(gameNavigatorContainer, "", false);
let chess = new Chess();
// chess.loadPgn(json.games[0].moveText);
chess.loadPgn("1. e4 f5 2. exf5 g6 3. fxg6 d5 4. gxh7 Nc6 5. hxg8=Q Rg8 6. Bd3 Be6 7. Nf3 Qd6 8. O-O O-O-O");
let moves = chess.history({verbose:true});
gameNavigator.loadGame({whitePlayer:"White player", blackPlayer:"Black player", moves});
let buttonsContainer = document.getElementById("buttons")!;
new Buttons(gameNavigatorContainer, gameNavigator);
// let start = document.getElementById("start") as HTMLButtonElement;
// start.onclick = () => {gameNavigator.goToMove(-1)};

// let rewind = document.getElementById("rewind") as HTMLButtonElement;
// rewind.onclick = () => {gameNavigator.rewind()};

// let previous = document.getElementById("prev") as HTMLButtonElement;
// previous.onclick = () => {gameNavigator.previous()};

// let play = document.getElementById("play") as HTMLButtonElement;
// play.onclick = () => {gameNavigator.play()};

// let pause = document.getElementById("pause") as HTMLButtonElement;
// pause.onclick = () => {gameNavigator.pause()};

// let next = document.getElementById("next") as HTMLButtonElement;
// next.onclick = () => {gameNavigator.next()};

// let forward = document.getElementById("forward") as HTMLButtonElement;
// forward.onclick = () => {gameNavigator.forward()};

// let end = document.getElementById("end") as HTMLButtonElement;
// end.onclick = () => {gameNavigator.goToMove(moves.length -1)};

// let rotate = document.getElementById("rotate") as HTMLButtonElement;
// rotate.onclick = () => {gameNavigator.rotate()};
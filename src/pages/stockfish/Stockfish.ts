import "../master.css";
import "./stockfish.css";
import Chessgame from "../../components/v2/chessgame/Chessgame";

let gameContainer = document.getElementById("chessgame") as HTMLElement;
let chessgame = new Chessgame(gameContainer, "start", false);
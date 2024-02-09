import "../master.css";
import { Chessboard } from "../../components/chess/Chessboard";
import { GameController } from "../../components/chess/GameController";

let chessboardContainer = document.getElementById("chessboard") as HTMLElement;
let chessboard = new Chessboard(chessboardContainer, "start", false);
let gameController = new GameController(chessboardContainer, "start", "both", false);
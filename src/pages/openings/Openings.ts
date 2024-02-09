import "../master.css";
import { Chessboard } from "../../components/chess/Chessboard";

let chessboardContainer = document.getElementById("chessboard") as HTMLElement;
let chessboard = new Chessboard(chessboardContainer, "start", false);
import "../master.css";
import "./stockfish.css";
import Chessgame from "../../components/v2/chessgame/Chessgame";
import Buttons from "../../components/v2/gameNavigator/Buttons";
import History from "../../components/v2/gameNavigator/History";

let gameContainer = document.getElementById("chessgame") as HTMLElement;
let chessgame = new Chessgame(gameContainer, "start", false);

new Buttons(chessgame.container, chessgame.gameNavigator);

let historyContainer = document.getElementById("history")!;
new History(historyContainer, chessgame.gameNavigator);
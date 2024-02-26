import GameNavigator from "../../components/v2/gameNavigator/GameNavigator";
import Buttons from "../../components/v2/gameNavigator/Buttons";
import History from "../../components/v2/gameNavigator/History";
import { Chess } from "chess.js";
import * as json from "../../components/chess/assets/data/games.json";
import "./openings.css";

let gameNavigatorContainer = document.getElementById("gameNavigator") as HTMLElement;
let gameNavigator = new GameNavigator(gameNavigatorContainer, "", false);

new Buttons(gameNavigatorContainer, gameNavigator);

let historyContainer = document.getElementById("history")!;
new History(historyContainer, gameNavigator);

let chess = new Chess();
chess.loadPgn(json.games[0].moveText);
// chess.loadPgn("1. e4 f5 2. exf5 g6 3. fxg6 d5 4. gxh7 Nc6 5. hxg8=Q Rg8 6. Bd3 Be6 7. Nf3 Qd6 8. O-O O-O-O");
let moves = chess.history({verbose:true});
gameNavigator.loadGame({whitePlayer:"White player", blackPlayer:"Black player", moves});
import { Move } from "chess.js";
import GameResult from "../chessboard/GameResult";

export default interface Game{
    blackPlayer:string,
    whitePlayer:string,
    moves:Move[];
    result?:GameResult;
}
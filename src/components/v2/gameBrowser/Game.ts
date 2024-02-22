import { Move } from "chess.js";

export default interface Game{
    blackPlayer:string,
    whitePlayer:string,
    moves:Move[];
}
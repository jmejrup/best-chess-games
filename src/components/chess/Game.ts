import { Chess, Move } from "chess.js";

export class Game{
    state: GameState = GameState.Pause;
    moveIndex = -1;
    moves: Move[] = [];

    constructor(moveText:string | undefined){
        if (moveText){
            let chess = new Chess();
            chess.loadPgn(moveText);
            this.moves = chess.history({verbose:true});
        }
    }
}
export enum GameState{
    Play,
    Pause,
    Forward,
    Rewind
}

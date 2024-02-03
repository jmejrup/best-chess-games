import { Chess } from "chess.js";

export class Game{
    moveText: string;
    chess: Chess | undefined;
    moveIndex = 0;
    state: GameState;

    constructor(moveText: string){
        this.moveText = moveText;
        this.state = GameState.Play;
    }
    init(){
        this.chess = new Chess();
        this.chess.loadPgn(this.moveText);
    }
}
export enum GameState{
    Play,
    Pause,
    Forward,
    Rewind
}

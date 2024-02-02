import { Game } from "./Game";
import {Chess} from "chess.js";

export default class Playlist{
    chess:Chess;
    games:Game[];
    gameIndex = 0;
    moveIndex = 0;
    isPaused = false;
    
    constructor(games:Game[]){
        this.games = games;
        this.chess = new Chess();
    }
}
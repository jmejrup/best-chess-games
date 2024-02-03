import { PGNGame } from "./PGN";
import { StoredGame } from "./StoredGame";
import { GameMenuItem } from "./GameMenuItem";
import { Game } from "../chess/Game";

export class Conversion{
    static pgnToGameMenuItem(list:PGNGame[]): GameMenuItem[]{
        let items: GameMenuItem[] = [];
        list.forEach((pgn, index) => {
            if (pgn.tags["Date"] && pgn.tags["Event"] && pgn.tags["White"] && pgn.tags["Black"] && pgn.moveText)
            {
                let date = pgn.tags["Date"];
                if (date.indexOf(".?") > -1)
                    date = date.substring(0, date.indexOf(".?"));
                let event = pgn.tags["Event"];
                let round = pgn.tags["Round"];
                let white = pgn.tags["White"];
                let black = pgn.tags["Black"];
                let moveText = pgn.moveText;
                let result = pgn.tags["Result"];
                let game = new GameMenuItem(date, event, round, white, black, moveText, result);
                items.push(game);
            }
        });
        return items;
    }
    static storedGamesToGameMenuItems(storedGames: StoredGame[]){
        let gameMenuItems: GameMenuItem[] = [];
        storedGames.forEach(game =>{
            let item = new GameMenuItem(game.date!, game.event!, game.round!, game.white!, game.black!, game.moveText!, game.result!);
            gameMenuItems.push(item);
        });
        return gameMenuItems;
    }
    static pgnToStoredGame(pgnGames:PGNGame[]): StoredGame[] | null
    {
        let storedGames: StoredGame[] = [];
        pgnGames.forEach(pgn =>{
            if (pgn.tags["Date"] && pgn.tags["Event"] && pgn.tags["White"] && pgn.tags["Black"] && pgn.moveText)
            {
                let game = new StoredGame();
                let date = pgn.tags["Date"];
                if (date.indexOf(".?") > -1)
                    date = date.substring(0, date.indexOf(".?"));
                game.date = date;
                game.event = pgn.tags["Event"];
                game.white = pgn.tags["White"];
                game.black = pgn.tags["Black"];
                game.moveText = pgn.moveText;
                game.result = pgn.tags["Result"];
                let site = pgn.tags["Site"];
                if (site)
                    game.site = site;
                let round = pgn.tags["Round"];
                if (round)
                    game.round = round;
                let whiteElo = pgn.tags["WhiteElo"];
                if (whiteElo)
                    game.whiteElo = whiteElo;
                let blackElo = pgn.tags["BlackElo"];
                if (blackElo)
                    game.blackElo = blackElo;
                let eco = pgn.tags["ECO"];
                if (eco)
                    game.eco = eco;

                storedGames.push(game);
            }
        });
        return storedGames;
    }
}
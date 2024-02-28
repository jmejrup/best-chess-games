import { Chess } from "chess.js";
import PGN from "../../components/v2/PGN";
import GameNavigator from "../../components/v2/gameNavigator/GameNavigator";
import Buttons from "../../components/v2/gameNavigator/Buttons";
import Game from "../../components/v2/gameNavigator/Game";
import GameResult from "../../components/v2/chessboard/GameResult";
import * as json from "../../components/v2/data/games.json";
import "../master.css";
import "./index.css";

let navContainer = document.getElementById("game-navigator") as HTMLElement;
let gameNavigator = new GameNavigator(navContainer, "start", false);
new Buttons(navContainer, gameNavigator);

let input = document.getElementById("file-upload") as HTMLInputElement;

let pgnGames: PGN.Game[] | undefined = json.games;
listInMenu(pgnGames);

function onMenuItemClick(event:MouseEvent){
    let menuItem = event.currentTarget as HTMLElement;
    Array.from(menuItem.parentElement!.children).forEach(item =>{
        item.classList.remove("active");
    });
    menuItem.classList.add("active");
    showGame(menuItem);
}
function showGame(menuItem:HTMLElement){
    if (pgnGames === undefined){
        return;
    }
    menuItem.classList.add("active");
    let index = [...menuItem.parentNode!.children].indexOf(menuItem);
    let pgnGame = pgnGames[index];
    let chess = new Chess();
    chess.loadPgn(pgnGame.moveText!);
    let moves = chess.history({verbose:true});
    let whitePlayer = pgnGame.tags["White"] || "White";
    let blackPlayer = pgnGame.tags["Black"] || "Black";
    let result = pgnGame.tags["Result"] as GameResult;
    let game:Game = {moves, whitePlayer, blackPlayer, result};
    gameNavigator.loadGame(game);
    gameNavigator.play();
}
input.addEventListener("change", () =>{
    const reader = new FileReader();
    reader.addEventListener("load", () => {
            let text = reader.result;
            if (text && typeof text === "string")
            {
                pgnGames = PGN.convertToGames(text);
                if (pgnGames){
                    pgnGames.reverse();
                    pgnGames.sort((a,b) => b.tags["Date"].localeCompare(a.tags["Date"]));
                    // PGN.showJSON(pgnGames.slice(0,50));
                    listInMenu(pgnGames);
                }
            }
        },
        false
    );
    if (input.files && input.files[0]) {
        reader.readAsText(input.files[0]);
    }
});
function listInMenu(games: PGN.Game[]){
    let menu = document.getElementById("menu") as HTMLElement;
    let menuItems = menu.getElementsByClassName("items")[0];
    menuItems.innerHTML = "";
    games.forEach(game =>
    {
        let menuItem = document.createElement("div");
        menuItems.appendChild(menuItem);
        menuItem.onclick = onMenuItemClick;
        Object.entries(game.tags).forEach(([key, value]) => 
        {
            let element = document.createElement("div");
            element.innerHTML = key + ": " + value;
            menuItem.appendChild(element);
        });
    });
    if (menuItems.children){
        let firstItem = menuItems.children[0] as HTMLElement;
        showGame(firstItem);
    }
}
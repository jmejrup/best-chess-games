import { Game, Move } from "./components/chess/Game";
import { GameController } from "./components/chess/GameController";
import { PGNGame } from "./components/pgnViewer/PGN";
import { PGNReader } from "./components/pgnViewer/PGNReader";
import { StoredGame } from "./components/pgnViewer/StoredGame";
import { GameMenuItem } from "./components/pgnViewer/GameMenuItem";
import { Conversion } from "./components/pgnViewer/Conversion";
import UTF from "./components/pgnViewer/UTF";
import Icons from "./components/pgnViewer/Icons";
import * as json from "./components/chess/games.json";
import "./index.css";
import "./chess-controls.css";

let chessboard = document.getElementById("chessboard");
let gameController = new GameController(chessboard!, "start", "none", onGameStartCallback, onMoveStartCallback, onGameEndCallback);

let gameHeader: HTMLElement = document.getElementById("game-header")!;
let blackPlayerInfo: HTMLElement = document.getElementById("black-player")!;
let whitePlayerInfo: HTMLElement = document.getElementById("white-player")!;
let blackPiecesTaken: HTMLElement = document.getElementById("black-pieces-taken")!;
let whitePiecesTaken: HTMLElement = document.getElementById("white-pieces-taken")!;
let log: HTMLElement = document.getElementById("log")!;
let input = document.getElementById("file-upload") as HTMLInputElement;
let pgnGames: PGNGame[] | undefined;

let storedGames = json.games as StoredGame[];
storedGames = storedGames.filter(game => game.moveText!.indexOf("=") > -1);
let gameMenuItems: GameMenuItem[] = Conversion.storedGamesToGameMenuItems(storedGames);
listInMenu(gameMenuItems);

let skipStartIcon = document.getElementById("skip-start") as HTMLImageElement;
skipStartIcon.src = Icons.skipStart;
skipStartIcon.onclick = onSkipStartClick;

let skipPreviousIcon = document.getElementById("skip-previous") as HTMLImageElement;
skipPreviousIcon.src = Icons.skipPrevious;
skipPreviousIcon.onclick = onSkipPreviousClick;

let pauseIcon = document.getElementById("pause") as HTMLImageElement;
pauseIcon.src = Icons.pause;
pauseIcon.onclick = onPauseClick;

let playIcon = document.getElementById("play") as HTMLImageElement;
playIcon.src = Icons.play;
playIcon.onclick = onPlayClick;

let skipNextIcon = document.getElementById("skip-next") as HTMLImageElement;
skipNextIcon.src = Icons.skipNext;
skipNextIcon.onclick = onSkipNextClick;

let skipEndIcon = document.getElementById("skip-end") as HTMLImageElement;
skipEndIcon.src = Icons.skipEnd;
skipEndIcon.onclick = onSkipEndClick;


function onSkipStartClick(){

}
function onSkipPreviousClick(){
    gameController.skipPrevious();
}
function onSkipNextClick(){

}
function onSkipEndClick(){

}
function onPlayClick(){
    playIcon.style.display = "none";
    pauseIcon.style.display = "inline";
    gameController.startPlaylist();
}
function onPauseClick(){
    playIcon.style.display = "inline";
    pauseIcon.style.display = "none";
    gameController.pausePlaylist();
}

function onGameStartCallback(game:Game, score:number, captures:Record<string, number>, pieceUrl:Record<string,string>){
    //Callback implemented via constructor on GameController further above
    log.innerHTML = "";
    if (whitePlayerInfo && blackPlayerInfo)
    {
        // updatePiecesTakenAndScore(score, piecesTaken, pieceUrl);
        let whitePlayerText:string = game.white || "White";
        let blackPlayerText:string = game.black || "Black";
        let result = game.result;
        if (result === "1-0")
        whitePlayerText += " (wins)";
        else if (result === "0-1")
        {
            blackPlayerText += " (wins)";
        }
        else
        {
            whitePlayerText += " (draw)";
            blackPlayerText += " (draw)";
        }
        blackPlayerInfo.innerHTML = blackPlayerText;
        whitePlayerInfo.innerHTML = whitePlayerText;
    }
    if (game.date || game.event || game.round)
    {
        let text = "";
        if (game.date)
            text = game.date + " ";
        if (game.event)
            text += game.event + " "
        if (game.round)
            text += "round " + game.round;
        gameHeader.innerHTML = text;
    }
}
function onMoveStartCallback(move:Move){
    //Callback implemented via constructor on GameController further above
    let turnNumber = Math.ceil(move.number / 2);
    let isNewTurn = move.number % 2 !== 0;
    let logItem = document.createElement("span");
    let firstChar = move.notation[0];
    let logText = isNewTurn ? turnNumber + "." : "";
    if (firstChar === firstChar.toUpperCase() && firstChar !== "O")
    {
        if (move.color === "b"){
            firstChar = firstChar.toLowerCase();
        }
        firstChar = UTF.pieces[firstChar];
        logText += firstChar + move.notation.substring(1);
    }
    else
        logText += move.notation;
    logItem.innerHTML = logText + " ";
    log.appendChild(logItem);
}
function onGameEndCallback(game:Game){
    //Callback implemented via constructor on GameController further above
    console.log("Game ended");
}
function onGameMenuItemClick(event:MouseEvent){
    let element = event.currentTarget as HTMLElement;
    let index = [...element.parentNode!.children].indexOf(element);
    let gameMenuItem = gameMenuItems[index];
    autoPlayGames([gameMenuItem]);
}
function autoPlayGames(menuItems:GameMenuItem[]){
    let games = Conversion.gameMenuItemToGame(menuItems);
    gameController.createPlaylist(games);
    gameController.startPlaylist();
}
input.addEventListener("change", () =>{
    const reader = new FileReader();
    reader.addEventListener("load", () => {
            let text = reader.result;
            if (text && typeof text === "string")
            {
                pgnGames = PGNReader.readPGNFile(text);
                if (pgnGames){
                    pgnGames.reverse();
                    // pgnGames = pgnGames.filter(pgn => pgn.moveText!.indexOf("=") > -1);
                    gameMenuItems = Conversion.pgnToGameMenuItem(pgnGames);
                    gameMenuItems.sort((a,b) => b.date.localeCompare(a.date));
                    listInMenu(gameMenuItems);
                }
            }
        },
        false
    );
    if (input.files && input.files[0]) {
        reader.readAsText(input.files[0]);
    }
});
function listInMenu(games: GameMenuItem[]){
    let gamesElement = document.getElementById("games")!;
    gamesElement.innerHTML = "";
    games.forEach(game =>{
        let gameElement = document.createElement("div");
        gameElement.className = "game";
        gamesElement.appendChild(gameElement);
        let headerElement = document.createElement("div");
        headerElement.className = "header";
        headerElement.innerHTML = game.header();
        gameElement.appendChild(headerElement);
        let whiteElement = document.createElement("div");
        whiteElement.className = "white";
        whiteElement.innerHTML = game.white;
        gameElement.appendChild(whiteElement);
        let blackElement = document.createElement("div");
        blackElement.className = "black";
        blackElement.innerHTML = game.black;
        gameElement.appendChild(blackElement);
        let resultElement = document.createElement("div");
        resultElement.className = "result";
        resultElement.innerHTML = game.result;
        gameElement.appendChild(resultElement);
        gameElement.onclick = onGameMenuItemClick;
    });
}
function updateCapturesAndScore(score:number, piecesTaken:Record<string,number>, pieceUrl:Record<string,string>){
    blackPiecesTaken.innerHTML = "";
    whitePiecesTaken.innerHTML = "";
    Object.entries(piecesTaken).forEach(([fenChar, value]) =>{
        for (let i = 0; i < value; i++){
            let image = document.createElement("img");
            image.className = "piece";
            image.setAttribute("data-type", fenChar);
            image.src = pieceUrl[fenChar];
    
            if (fenChar === fenChar.toUpperCase())
                whitePiecesTaken.appendChild(image);
            else
                blackPiecesTaken.appendChild(image);
        }
    });
    if (score !== 0)
    {
        let span = document.createElement("span");
        span.innerText = (score > 0 ? "+" : "-") + Math.abs(score);
        whitePiecesTaken.appendChild(span);
        span = document.createElement("span");
        span.innerText = (score < 0 ? "+" : "-") + Math.abs(score);
        blackPiecesTaken.appendChild(span);
    }
}
//Testing Firestore
// let bobby = document.getElementById("bobby");
// bobby.addEventListener("click", loadBobby);
// async function loadBobby(){
//     let games = await GetAllGames("/Legends/Bobby Fischer/Games");
//     games.reverse();
//     games.sort((a,b) => b.Date.localeCompare(a.Date));
// }
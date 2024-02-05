import { Move } from "chess.js";
import { Game, GameState } from "./components/chess/Game";
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
let gameController = new GameController(chessboard!, "", "none");

let gameHeader = document.getElementById("game-header") as HTMLElement;
let blackPlayerInfo = document.getElementById("black-player") as HTMLElement;
let whitePlayerInfo = document.getElementById("white-player") as HTMLElement;
let blackPiecesTaken = document.getElementById("black-pieces-taken") as HTMLElement;
let whitePiecesTaken = document.getElementById("white-pieces-taken") as HTMLElement;
let autoplay = document.getElementById("autoplay") as HTMLElement;
let input = document.getElementById("file-upload") as HTMLInputElement;
let pgnGames: PGNGame[] | undefined;

let storedGames = json.games as StoredGame[];
storedGames = storedGames.filter(game => game.moveText!.indexOf("=") > -1);
let gameMenuItems: GameMenuItem[] = Conversion.storedGamesToGameMenuItems(storedGames);
listInMenu(gameMenuItems);

let log = document.getElementById("log") as HTMLElement;
log.onclick=(event) =>{
    let target = event.target as HTMLElement;
    if (target !== log){
        let logItemIndex = Array.from(log.children).indexOf(target);
        log.innerHTML = "";
        if (gameController.currentGame){
            let moves = gameController.currentGame.moves;
            for (let moveIndex = 0; moveIndex <= logItemIndex; moveIndex++){
                let move = moves[moveIndex];
                addLogItem(moveIndex, move);
            }
            gameController.goToMove(logItemIndex);
        }
    }
}
let iconGoToStart = prepareIcon("go-to-start", Icons.goToStart, ()=>{
    log.innerHTML = "";
    gameController.goToStart();
});
let iconRewind = prepareIcon("rewind", Icons.rewind, gameController.rewind);
let iconPlay = prepareIcon("play", Icons.play, gameController.play);
let iconPause = prepareIcon("pause", Icons.pause, gameController.pause);
let iconForward = prepareIcon("forward", Icons.forward, gameController.forward);
let iconGoToEnd = prepareIcon("go-to-end", Icons.goToEnd, () =>{
    if (gameController.currentGame){
        log.innerHTML = "";
        let moveNumber = 0;
        gameController.goToEnd();
        gameController.currentGame.moves.forEach(move =>{
            addLogItem(moveNumber++, move);
        });
    }
});

function prepareIcon(id:string, iconUrl:string, fn: () => void){
    let icon = document.getElementById(id) as HTMLImageElement;
    icon.src = iconUrl;
    icon.onclick = fn;
    return icon;
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
    let gameMenu = document.getElementById("games") as HTMLElement;
    gameMenu.innerHTML = "";
    games.forEach(game =>
    {
        let menuItem = document.createElement("div");
        gameMenu.appendChild(menuItem);
        menuItem.className = "game";
        menuItem.onclick = onGameMenuItemClick;
        [{class: "header", text: game.header()}, 
         {class: "white", text: game.white},
         {class: "black", text: game.black},
         {class: "result", text: game.result}
        ].forEach(item =>{
            let element = document.createElement("div");
            element.className = item.class;
            element.innerHTML = item.text;
            menuItem.appendChild(element);
        });
    });
}
gameController.callbacks.onGameStateChanged = (newState:GameState) =>{
    switch (newState){
        case GameState.Start:
            enable([iconPlay, iconForward, iconGoToEnd]);
            disable([iconGoToStart, iconRewind, iconPause]);
            break;
        case GameState.Play:
            enable([iconGoToStart, iconRewind, iconPause, iconForward, iconGoToEnd]);
            disable([iconPlay]);
            break;
        case GameState.Pause:
            enable([iconGoToStart, iconRewind, iconPlay, iconForward, iconGoToEnd]);
            disable([iconPause]);
            break;
        case GameState.Rewind:
            enable([iconGoToStart, iconPlay, iconPause, iconForward, iconGoToEnd]);
            disable([iconRewind]);
            break;
        case GameState.Forward:
            enable([iconGoToStart, iconRewind, iconPlay, iconPause, iconGoToEnd]);
            disable([iconForward]);
            break;
        case GameState.End:
            enable([iconGoToStart, iconRewind]);
            disable([iconPlay, iconPause, iconForward, iconGoToEnd]);
            break;
    }
}
function disable(icons: HTMLImageElement[]){
    icons.forEach(icon=>{
        icon.classList.add("disabled");
    });
}
function enable(icons: HTMLImageElement[]){
    icons.forEach(icon=>{
        icon.classList.remove("disabled");
    });
}
gameController.callbacks.onMoveStart = (move:Move, index:number, rewind:boolean) =>{
    if (!rewind){
        addLogItem(index, move);
    }
}
gameController.callbacks.onMoveEnd = (move:Move, index:number, rewind:boolean) =>{
    if (rewind){
        log.removeChild(log.lastChild as Node);
    }
}
gameController.callbacks.onCapture = (color:string, fenChar:string, capturedPiece:HTMLImageElement, rect:DOMRect) =>{
    console.log("");
}
function addLogItem(moveIndex:number, move:Move){
    let moveNumber = moveIndex +1;
    let turnNumber = Math.ceil(moveNumber / 2);
    let isNewTurn = moveNumber % 2 !== 0;
    let logItem = document.createElement("span");
    let firstChar = move.san.substring(0, 1);
    let logText = isNewTurn ? turnNumber + "." : "";
    if (firstChar === firstChar.toUpperCase() && firstChar.toUpperCase() !== "O")
    {
        if (move.color === "b"){
            firstChar = firstChar.toLowerCase();
        }
        firstChar = UTF.pieces[firstChar];
        logText += firstChar + move.san.substring(1);
    }
    else
        logText += move.san;
    logItem.innerHTML = logText + " ";
    log.appendChild(logItem);
}
function onGameMenuItemClick(event:MouseEvent){
    autoplay.style.display = "block";
    let element = event.currentTarget as HTMLElement;
    let index = [...element.parentNode!.children].indexOf(element);
    let gameMenuItem = gameMenuItems[index];
    let game = new Game(gameMenuItem.moveText);
    let moveNumber = 1;
    log.innerHTML = "";
    gameController.startGame(game);
    let storedGame = storedGames[index];
    if (whitePlayerInfo && blackPlayerInfo)
    {
        //updatePiecesTakenAndScore(score, piecesTaken, pieceUrl);
        let whitePlayerText:string = storedGame.white || "White";
        let blackPlayerText:string = storedGame.black || "Black";
        let result = storedGame.result;
        if (result === "1-0"){
            whitePlayerText += " (wins)";
        }
        else if (result === "0-1"){
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
    if (storedGame.date || storedGame.event || storedGame.round)
    {
        let text = "";
        if (storedGame.date)
            text = storedGame.date + " ";
        if (storedGame.event)
            text += storedGame.event + " "
        if (storedGame.round)
            text += "round " + storedGame.round;
        gameHeader.innerHTML = text;
    }
}
function updateCapturesAndScore(score:number, piecesTaken:Record<string,number>, pieceUrl:Record<string,string>)
{
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
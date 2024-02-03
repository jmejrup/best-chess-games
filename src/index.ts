import { Chess, Move } from "chess.js";
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
let gameController = new GameController(chessboard!, "start", "none", onGameStateChanged, onMoveStartCallback, onGameEndCallback);

let gameHeader: HTMLElement = document.getElementById("game-header")!;
let blackPlayerInfo: HTMLElement = document.getElementById("black-player")!;
let whitePlayerInfo: HTMLElement = document.getElementById("white-player")!;
let blackPiecesTaken: HTMLElement = document.getElementById("black-pieces-taken")!;
let whitePiecesTaken: HTMLElement = document.getElementById("white-pieces-taken")!;
let autoplay = document.getElementById("autoplay") as HTMLElement;
let log: HTMLElement = document.getElementById("log")!;
let input = document.getElementById("file-upload") as HTMLInputElement;
let pgnGames: PGNGame[] | undefined;

// let html = "P: " + UTF.pieces["p"] + " R: " + UTF.pieces["r"] + " N: " + UTF.pieces["n"] +
// " B: " + UTF.pieces["b"] + " Q: " + UTF.pieces["q"] + " K: " + UTF.pieces["k"];
// log.innerHTML = html;

let storedGames = json.games as StoredGame[];
storedGames = storedGames.filter(game => game.moveText!.indexOf("=") > -1);
let gameMenuItems: GameMenuItem[] = Conversion.storedGamesToGameMenuItems(storedGames);
listInMenu(gameMenuItems);

let goToStartIcon = document.getElementById("go-to-start") as HTMLImageElement;
goToStartIcon.src = Icons.goToStart;
goToStartIcon.onclick = onGoToStartClick;

let rewindIcon = document.getElementById("rewind") as HTMLImageElement;
rewindIcon.src = Icons.rewind;
rewindIcon.onclick = onRewindClick;

let pauseIcon = document.getElementById("pause") as HTMLImageElement;
pauseIcon.src = Icons.pause;
pauseIcon.onclick = onPauseClick;

let playIcon = document.getElementById("play") as HTMLImageElement;
playIcon.src = Icons.play;
playIcon.onclick = onPlayClick;

let forwardIcon = document.getElementById("forward") as HTMLImageElement;
forwardIcon.src = Icons.forward;
forwardIcon.onclick = onForwardClick;

let goToEndIcon = document.getElementById("go-to-end") as HTMLImageElement;
goToEndIcon.src = Icons.goToEnd;
goToEndIcon.onclick = onGoToEndClick;

function onGameStateChanged(state:GameState){
    if (state === GameState.Pause){
        playIcon.style.display = "inline";
        pauseIcon.style.display = "none";
    }
    else{
        playIcon.style.display = "none";
        pauseIcon.style.display = "inline";
    }
}
function onGoToStartClick(){
    gameController.goToStart();
    log.innerHTML = "";
}
function onRewindClick(){
    gameController.rewind();
}
function onForwardClick(){
    gameController.forward();
}
function onGoToEndClick(){
    gameController.goToEnd();
    log.innerHTML = "";
    if (gameController.currentGame && gameController.currentGame.chess){
        let game = gameController.currentGame!;
        let chess = game.chess!;
        let history = chess.history({verbose:true});
        let moveNumber = 1;
        history.forEach(move =>{
            addLogItem(moveNumber++, move);
        });
    }
}
function onPlayClick(){
    gameController.play();
}
function onPauseClick(){
    gameController.pause();
}

function onMoveStartCallback(game:Game){
    //Callback implemented via constructor on GameController further above
    if (game.state === GameState.Rewind){
        if (log.lastChild){
            log.removeChild(log.lastChild!);
        }
    }
    else{
        let move = game.chess?.history({verbose:true})[game.moveIndex]!;
        let moveNumber = game.moveIndex +1;
        addLogItem(moveNumber, move);
    }
}
function addLogItem(moveNumber:number, move:Move){
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
function onGameEndCallback(game:Game){
    //Callback implemented via constructor on GameController further above
    console.log("Game ended");
}
function onGameMenuItemClick(event:MouseEvent){
    autoplay.style.display = "block";
    let element = event.currentTarget as HTMLElement;
    let index = [...element.parentNode!.children].indexOf(element);
    let gameMenuItem = gameMenuItems[index];
    let game = new Game(gameMenuItem.moveText);
    gameController.startGame(game);
    log.innerHTML = "";
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
    games.forEach(game =>
    {
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
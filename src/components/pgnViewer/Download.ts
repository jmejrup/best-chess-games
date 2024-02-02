import {PGNGame} from "./PGN";
import { Conversion } from "./Conversion";

export function DownloadAsJson(pgnGames: PGNGame[], count:number){
    if (pgnGames.length < count)
        count = pgnGames.length;
    let itemsToDownload = pgnGames.slice(0, count);
    let storedGames = Conversion.pgnToStoredGame(itemsToDownload);
    let text = "";
    storedGames!.forEach(game =>{
        text += JSON.stringify(game) + "\n,";
    });
    let hrefContent = encodeURIComponent(text);
    document.body.insertAdjacentHTML('beforeend', '<a id="downloadAnchorElem" download="data.json" href="data:text/json;charset=utf-8,' + hrefContent + '" style="display:none"></a>');
    let link = document.getElementById("downloadAnchorElem");
    link?.click();
    link?.remove();
}
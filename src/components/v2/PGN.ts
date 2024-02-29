namespace PGN{
    export class Game
    {
        tags: Record<string, string> = {};
        moveText: string | undefined;
    }
    enum SectionType{
        Tags,
        Moves
    }
    type Section = {
        type:SectionType,
        text:string
    }
    export function showJSON(games:Game[]){
        let jsonString = '{"games":[';
        games.forEach(game =>{
            jsonString += JSON.stringify(game) + "\n,";
        });
        jsonString = jsonString.slice(0, -1) + "]}";
        let hrefContent = encodeURIComponent(jsonString);
        document.body.insertAdjacentHTML('beforeend', '<a id="downloadAnchorElem" download="data.json" href="data:text/json;charset=utf-8,' + hrefContent + '" style="display:none"></a>');
        let link = document.getElementById("downloadAnchorElem");
        link?.click();
        link?.remove();
    }
    export function convertToGames(pgnText:string):Game[]|undefined{
        let sections = getSections(pgnText);
        if (sections){
            let pgnGames:Game[] = [];
            let currentGame = new Game();
            for (let section of sections){
                if (section.type === SectionType.Tags){
                    currentGame.tags = getTags(section);
                }
                else{
                    currentGame.moveText = section.text.split("\r\n").join(" ");
                    pgnGames.push(currentGame);
                    currentGame = new Game();
                }
            }
            return pgnGames;
        }
        return undefined;
    }
    function getSections(pgnText: string): Section[] | undefined {
        if (pgnText){
            let sections:Section[] = [];
            let texts = pgnText.split("\r\n\r\n");
            for (let text of texts){
                if (text.length > 1){
                    if (text[0] === "["){
                        sections.push({type:SectionType.Tags, text:text});
                    }
                    else if (text[0] === "1"){
                        sections.push({type:SectionType.Moves, text: text})
                    }
                }
            }
            return sections;
        }
        return undefined;
    }
    function getTags(section:Section){
        let tags:Record<string, string> = {};
        let lines = section.text.split("\n");
        for (let line of lines){
            let tag = getTag(line);
            if (tag){
                tags[tag.key] = tag.value;
            }
        }
        return tags;
    }
    function getTag(text:string){
        text = text.trim();
        if (text.length > 4 && text[0] === "["){
            let indexOfEndBracket = text.lastIndexOf("]");
            if (indexOfEndBracket > 3){
                let indexOfEmptySpace = text.indexOf(" ");
                let key = text.substring(1, indexOfEmptySpace);
                let value = text.substring(indexOfEmptySpace +2, indexOfEndBracket -1);
                return {key: key, value: value};
            }
        }
        return undefined;
    }
}
export default PGN
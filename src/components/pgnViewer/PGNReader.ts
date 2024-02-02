import { PGNGame } from './PGN';

enum Linetype{
    tag,
    moves
}
export class PGNReader {
    public static readPGNFile(text: string): PGNGame[] | undefined {
        if (text){
            let list: PGNGame[] = [];
            let lines = text.split("\n");
            let info = new PGNGame();
            let currentLineType = Linetype.tag;
            lines.forEach(line => {
                if (line.length > 1){
                    if (line[0] == "["){
                        if (currentLineType === Linetype.moves){
                            currentLineType = Linetype.tag;
                            list.push(info);
                            info = new PGNGame();
                        }
                        let tag = this.getTag(line);
                        info.tags[tag.key] = tag.value;
                    }
                    else
                    {
                        if (line.substring(0,2) === "1."){
                            currentLineType = Linetype.moves;
                            if (info.moveText){
                                list.push(info);
                                info = new PGNGame();
                            }
                            info.moveText = line.substring(0, line.lastIndexOf("\r"));
                        }
                        else
                        {
                            info.moveText = info.moveText + " " + line.substring(0, line.lastIndexOf("\r"));
                        }
                    }
                }
            });
            if (info.moveText){
                list.forEach(info =>{
                    let whitespaceBeforeResult = info.moveText!.lastIndexOf(" ");
                    info.result = info.moveText!.substring(whitespaceBeforeResult + 1);
                    info.moveText = info.moveText!.substring(0, whitespaceBeforeResult);
                    info.moveText.trimEnd();
                });
            }
            return list;
        }
        return undefined;
    }
    static getTag(text: string){
        let indexOfEmptySpace = text.indexOf(" ");
        let key = text.substring(1, indexOfEmptySpace);
        let value = text.substring(indexOfEmptySpace +2, text.length -3);
        return {key: key, value: value};
    }
}
namespace Shared{
    const squareKeys = ["a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8", "a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7", "a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6", "a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5", "a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4", "a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3", "a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2", "a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"];
    const horizontal = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const vertical = ["8", "7", "6", "5", "4", "3", "2", "1"];

    export function getSquareKeyByIndexes(horizontalIndex:number, verticalIndex:number, isRotated:boolean){
        let letterIndex = isRotated ? 7 - horizontalIndex : horizontalIndex;
        let digitIndex = isRotated ? 7 - verticalIndex : verticalIndex;
        return horizontal[letterIndex] + vertical[digitIndex];
    }
    export function getSquareKeyByIndex(index:number, isRotated:boolean){
        let i = isRotated ? 63 - index : index;
        return squareKeys[i];
    }
    export function getCurrentIndexOfSquareKey(squareKey:string, isRotated:boolean){
        let index = squareKeys.indexOf(squareKey);
        return isRotated ? 63 - index : index;
    }
    export function getHorizontalIndex(squareLetter:string, isRotated:boolean){
        let index = horizontal.indexOf(squareLetter);
        return isRotated ? 7 - index : index;
    }
    export function getVerticalIndex(squareNumber:string, isRotated:boolean){
        let index = vertical.indexOf(squareNumber);
        return isRotated ? 7 - index : index;
    }
    export function getCordinatesBySquareKey(squareKey:string, isRotated:boolean){
        let x = getHorizontalIndex(squareKey[0], isRotated);
        let y = getVerticalIndex(squareKey[1], isRotated);
        return { x, y };
    }
}
export default Shared;

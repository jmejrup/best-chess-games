// import { getFirestore, setDoc } from "firebase/firestore";
// import { collection, doc, getDoc, addDoc, getDocs } from "firebase/firestore";
// import { app } from "./Firebase";
// // import "firebase/firestore";

// import { StoredGame } from "../components/pgnViewer/StoredGame";

// export const db = getFirestore(app);
// let collectionRef = collection(db, "/Legends/Bobby Fischer/Games");

// //Location example:  "/Legends/Bobby Fischer/Games"
// export async function GetAllGames(location:string){
//     const querySnapshot = await getDocs(collection(db, location));
//     let games: StoredGame[] = [];
//     querySnapshot.forEach((doc) => {
//         let game = doc.data() as StoredGame;
//         games.push(game);
//       });
//     return games;
// }
// export async function AddGame(index: number, game:StoredGame){
//     await setDoc(doc(collectionRef, index.toString()), game);
// }
// //Location example:  "/Legends/Bobby Fischer/Games/1"
// export async function GetGames(location:string){
//     let docRef = doc(db, location);
//     const docSnap = await getDoc(docRef);
//     let event = docSnap.get("Event");
//     let date = docSnap.get("Date");
//     let white = docSnap.get("White");
//     let black = docSnap.get("Black");
//     let moves = docSnap.get("Moves");
//     if (docSnap.exists()) {
//         console.log(docSnap);
//         // console.log("Document data:", docSnap.data());
//     } else {
//         debugger;
//       // docSnap.data() will be undefined in this case
//       console.log("No such document!");
//     }
// }

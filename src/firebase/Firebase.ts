import { initializeApp } from "firebase/app";

export const firebaseConfig = {
    apiKey: "AIzaSyCSNE1dkg0ARviHIlRDxhcbrriYxUUCQhg",
    authDomain: "best-chess-games.firebaseapp.com",
    databaseURL: "https://best-chess-games-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "best-chess-games",
    storageBucket: "best-chess-games.appspot.com",
    messagingSenderId: "811584894840",
    appId: "1:811584894840:web:66b9f9ac90cc702aa3fa8d",
    measurementId: "G-KWXD8E4KDE"
};

export const app = initializeApp(firebaseConfig);
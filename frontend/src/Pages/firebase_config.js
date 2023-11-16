// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAC3zQOZWkkZ7_cVh4N1m9jl7vEfozRkxI",
    authDomain: "gadgets-reborn.firebaseapp.com",
    projectId: "gadgets-reborn",
    storageBucket: "gadgets-reborn.appspot.com",
    messagingSenderId: "259754074834",
    appId: "1:259754074834:web:11d45a655c4c609ca7830b",
    measurementId: "G-T58YHZTF8X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
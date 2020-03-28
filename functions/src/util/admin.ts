import * as admin from "firebase-admin"; //not

admin.initializeApp(); //not

//not
const firebaseConfig = {
    apiKey: "AIzaSyDop8SvuITaKeWvxZK7fOiOLXWEPVU2uik",
    authDomain: "veitrafikk-kart4.firebaseapp.com",
    databaseURL: "https://veitrafikk-kart4.firebaseio.com",
    projectId: "veitrafikk-kart4",
    storageBucket: "veitrafikk-kart4.appspot.com",
    messagingSenderId: "549360792341",
    appId: "1:549360792341:web:8766270393aaa9428a2f1c",
    measurementId: "G-2M8QC34TE2"
};

//not
const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);

//not
const db = admin.firestore();

export {db,admin,firebase}

/*
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore;

module.exports = {db,admin};
 */
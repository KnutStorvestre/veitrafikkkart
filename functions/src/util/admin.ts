//import * as admin from "firebase-admin"; //not
const admin = require('firebase-admin')

admin.initializeApp(); //not

let db = admin.firestore();

module.exports = { admin, db };

//export { admin, db }

//not
/*
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
*/

//not
//const firebase = require('firebase');
//firebase.initializeApp(firebaseConfig);

//not

/*
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore;

module.exports = {db,admin};
 */
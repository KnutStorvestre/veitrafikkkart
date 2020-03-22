import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as firebase from 'firebase';
//import * as serviceWorker from './serviceWorker';

var firebaseConfig = {
    apiKey: "AIzaSyDop8SvuITaKeWvxZK7fOiOLXWEPVU2uik",
    authDomain: "veitrafikk-kart4.firebaseapp.com",
    databaseURL: "https://veitrafikk-kart4.firebaseio.com",
    projectId: "veitrafikk-kart4",
    storageBucket: "veitrafikk-kart4.appspot.com",
    messagingSenderId: "549360792341",
    appId: "1:549360792341:web:8766270393aaa9428a2f1c",
    measurementId: "G-2M8QC34TE2"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();

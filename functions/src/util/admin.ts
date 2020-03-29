import {firebaseConfig} from "./config";

const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();

const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);

module.exports = {db, admin, firebase};

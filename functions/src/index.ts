import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";
const app = require('express')();
admin.initializeApp();

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

const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);



app.get('/screams',(req:undefined, res:undefined | any) => {
    admin
        .firestore()
        .collection('screams')
        //.orderBy('createdAt','desc') denne er buggy
        .get()
        .then((data) => {
            let screams:any = [];
            data.forEach((doc) => {
                screams.push({
                    screamId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt
                })
            });
            return res.json(screams);
        })
        .catch((err) => console.log(err));
});

app.post('/scream',(req:any, res:any | undefined) => {
    const newScream = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        //turns date into string
        createdAt: new Date().toISOString()
        //time: admin.firestore.Timestamp.fromDate(new Date())
    };

    admin
        .firestore()
        .collection('screams')
        .add(newScream)
        .then(doc => {
            res.json({ message: `document ${doc.id} created successfully`});
        })
        .catch((err) => {
            res.status(500).json({ error: 'something went wrong'});
            console.error(err)
        })
});

exports.createNewUser = functions.https.onRequest((req, res:any | undefined) => {
    if (req.method !== 'POST')
        return res.status(400).json({error: 'MMM'});

    const newUser = {
        first: req.body.body,
        time: admin.firestore.Timestamp.fromDate(new Date())
    };

    admin
        .firestore()
        .collection('users')
        .add(newUser)
        .then(doc => {
            res.json({ message: `document ${doc.id} created successfully`});
        })
        .catch((err) => {
            res.status(500).json({ error: 'something went wrong'});
            console.error(err)
        })
});

app.post('/signup',(req:any,res:any) => {
    const newUser = {
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
            handle: req.body.handle
    };

    firebase
        .auth()
        .createUserWithEmailAndPassword(newUser.email, newUser.password)
        .then(( data: any | undefined) => {
            return res
                .status(201)
                .json({ message: `user ${data.user.uid} signed up successfully` })
        })
        .catch((err:any) => {
            console.log("something went bad")
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
});

exports.api = functions.region('europe-west1').https.onRequest(app);
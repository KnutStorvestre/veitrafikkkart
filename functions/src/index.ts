import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";

admin.initializeApp();

const express = require('express');
const app = express();

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
})

app.post('/scream',(req:any, res:any | undefined) => {
    const newScream = {
        first: req.body.body,
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

exports.api = functions.region('europe-west1').https.onRequest(app);
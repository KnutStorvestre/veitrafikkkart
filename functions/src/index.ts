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

//replaces all admin.firestore
const db = admin.firestore();

app.get('/screams',(req:undefined, res:undefined | any) => {
    db
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

    db
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

    db
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

const isEmail = (email:any) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regEx))
        return true;
    else
        return false;

};

const isEmpty = (string:any) => {
    if (string.trim() === '')
        return true;
    else
        return false;
}

app.post('/signup',(req:any,res:any) => {
    const newUser = {
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
            handle: req.body.handle
    };

    interface LooseObject {
        [key: string]: any
    }

    var errors: LooseObject = {};

        if (isEmpty(newUser.email)){
        errors.email = 'Email must not be empty'
    }
    else if (!isEmail(newUser.email)){
        errors.email = 'Must be valid email address'
    }

    if (isEmpty(newUser.password))
        errors.password = 'Must not be empty';
    if (newUser.password !== newUser.confirmPassword)
        errors.confirmPassword = 'Passwords must match';
    if (isEmpty(newUser.handle))
        errors.handle = 'Must not be empty';

    if (Object.keys(errors).length > 0)
        return res.status(400).json(errors);
    //validate data
    let token:any, userId:any;
    db.doc(`/users/${newUser.handle}`).get()
        .then(doc => {
            //if true = handle already exists
            if (doc.exists){
                return res.status(400).json({ handle: 'this handle is already taken'})
            }
            else {
                return firebase
                    .auth()
                    .createUserWithEmailAndPassword(newUser.email, newUser.password)
            }
        })
        .then(data => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then((idToken) => {
            token = idToken;
            const userCredentials = {
                handle: newUser.handle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                userId
            };
            return db.doc(`/users/${newUser.handle}`).set(userCredentials);
            //return res.status(201).json({ token });
        })
        .then(() => {
            return res.status(201).json({ token })
        })
        .catch(err => {
            console.error(err);
            if (err.code === 'auth/email-already-in-use'){
                return res.status(400).json({ email: 'Email already in use' })
            }
            else {
                return res.status(500).json({ error: err.code})

            }
        })
});

exports.api = functions.region('europe-west1').https.onRequest(app);
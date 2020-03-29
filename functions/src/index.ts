const functions = require('firebase-functions');

const app = require('express')();

const {db,admin,firebase} = require('./util/admin');
const {getAllScreams, postOneScream} = require('./handlers/screams');
const {signup} = require('./handlers/users');

app.get('/screams',getAllScreams);

//middle ware
const FBAuth = (req:any, res:any, next:any) => {
    let idToken;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        idToken = req.headers.authorization.split('Bearer ')[1];
    }
    else {
        console.log('No token found');
        return res.status(403).json({ error: 'Unauthrozed'} )
    }

    admin.auth().verifyIdToken(idToken)
        .then((decodedToken:any) => {
            req.user = decodedToken;
            console.log(decodedToken);
            return db.collection('users')
                .where('userId','==', req.user.uid)
                .limit(1)
                .get();
        })
        .then((data:any) => {
            req.user.handle = data.docs[0].data().handle;
            return next();
        })
        .catch((err:any) => {
            console.error('Error while verifying token ', err);
            return res.status(403).json(err);
        })
};

app.post('/scream', FBAuth, postOneScream);

/*
const isEmail = (email:any) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regEx))
        return true;
    else
        return false;
};
 */

const isEmpty = (string:any) => {
    if (string.trim() === '')
        return true;
    else
        return false;
};

app.post('/signup', signup);

app.post('/login', (req:any, res:any) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };
    //res.status(201).json(`hello ${user.email}`)
    let errors: {[k: string]: any} = {};

    if (isEmpty(user.email))
        errors.email = 'Must not be empty';
    if (isEmpty(user.password))
        errors.password = 'Must not be empty';

    if (Object.keys(errors).length > 0)
        return res.status(400).json(errors);

    firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then((data:any) => {
            return data.user.getIdToken();
        })
        .then((token:any) => {
            return res.json({ token });
        })
        .catch((err:any) => {
            console.error(err);
            if (err.code === 'auth/wrong-password')
                return res.status(403).json({ general: 'Wrong credentials, please try again'});
            else
                return res.status(500).json({ error: err.code })
        })
});

exports.api = functions.region('europe-west1').https.onRequest(app);
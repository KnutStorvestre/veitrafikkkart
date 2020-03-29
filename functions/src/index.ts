const functions = require('firebase-functions');

const app = require('express')();

const {db,admin,firebase} = require('./util/admin');
const {getAllScreams, postOneScream} = require('./handlers/screams');
const {signup,login} = require('./handlers/users');
//const FBAuth = require('./util/FBAuth');

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

    admin
        .auth().verifyIdToken(idToken)
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

app.post('/signup', signup);

app.post('/login', login);

exports.api = functions.region('europe-west1').https.onRequest(app);
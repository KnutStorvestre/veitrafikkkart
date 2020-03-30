
const functions = require('firebase-functions');

const app = require('express')();

const {getAllScreams, postOneScream} = require('./handlers/screams');
const {signup,login} = require('./handlers/users');
const fbAuth = require('./util/fbAuth');

//screams
app.get('/screams',getAllScreams);
app.post('/scream', fbAuth, postOneScream);

//user
app.post('/signup', signup);

app.post('/login', login);

exports.api = functions.region('europe-west1').https.onRequest(app);
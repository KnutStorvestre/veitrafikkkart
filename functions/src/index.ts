import * as functions from 'firebase-functions';

const app = require('express')();

const {getAllScreams, postOneScream} = require('./handlers/screams');
const {signUp, login} = require('./handlers/users');
const FBAuth = require('./util/fbAuth');

app.get('/screams', getAllScreams);

app.post('/scream', FBAuth, postOneScream);

app.post('/signup',signUp);

app.post('/login', login);

exports.api = functions.region('europe-west1').https.onRequest(app);
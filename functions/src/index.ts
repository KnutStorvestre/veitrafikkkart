const functions = require('firebase-functions');

const app = require('express')();

const {getAllScreams, postOneScream} = require('./handlers/screams');
const {signup,login,uploadImage} = require('./handlers/users');
const fbAuth = require('./util/fbAuth');

//screams
app.get('/screams',getAllScreams);
app.post('/scream', fbAuth, postOneScream);

//user
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', fbAuth, uploadImage);

exports.api = functions.region('europe-west1').https.onRequest(app);
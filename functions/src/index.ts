const functions = require('firebase-functions');

const app = require('express')();

const {getAllScreams, postOneScream} = require('./handlers/screams');
const {signup, login, uploadImage, addUserDetails} = require('./handlers/users');
const fbAuth = require('./util/fbAuth');

//user
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', fbAuth, uploadImage);
app.post('/user', fbAuth, addUserDetails);

//screams
app.get('/screams',getAllScreams);
app.post('/scream', fbAuth, postOneScream);

exports.api = functions.region('europe-west1').https.onRequest(app);
const functions = require('firebase-functions');

const app = require('express')();

const {getAllScreams, postOneScream, getScream} = require('./handlers/screams');
const {
    signup,
    login,
    uploadImage,
    addUserDetails,
    getAuthenticatedUser
} = require('./handlers/users');

const fbAuth = require('./util/fbAuth');

//user
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', fbAuth, uploadImage);
app.post('/user', fbAuth, addUserDetails);
app.get('/user', fbAuth, getAuthenticatedUser);

//screams
app.get('/screams',getAllScreams);
app.post('/scream', fbAuth, postOneScream);
app.get('/scream/:screamId',getScream);

//TODO: delete a scream
//TODO: like a scream
//TODO: unlike a scream
//TODO: comment on a scream


exports.api = functions.region('europe-west1').https.onRequest(app);
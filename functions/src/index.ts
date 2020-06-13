export {};
const functions = require('firebase-functions');
const app = require('express')();
const fbAuth = require('./util/fbAuth');
const {db} = require('./util/admin');

const {
    getAllScreams,
    postOneScream,
    getScream,
    commentOnScream,
    likeScream,
    unlikeScream,
    deleteScream
} = require('./handlers/posts');

const {
    signup,
    login,
    uploadImage,
    addUserDetails,
    getAuthenticatedUser,
    getUserDetails,
    markNotificationsRead
} = require('./handlers/users');

//user
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', fbAuth, uploadImage);
app.post('/user', fbAuth, addUserDetails);
app.get('/user', fbAuth, getAuthenticatedUser);

app.get('/user/:handle', getUserDetails);
app.post('/notifications', fbAuth, markNotificationsRead);

//screams
app.get('/screams',getAllScreams);
app.post('/scream', fbAuth, postOneScream);
app.get('/scream/:screamId',getScream);
app.post('/scream/:screamId/comment',fbAuth,commentOnScream);
app.get('/scream/:screamId/like', fbAuth,likeScream);
app.get('/scream/:screamId/unlike', fbAuth, unlikeScream);
app.delete('/scream/:screamId', fbAuth, deleteScream);

//TODO: remove comments and likes to scream that has been deleted

exports.api = functions.region('europe-west1').https.onRequest(app);

exports.createNotificationOnLike = functions
    .region('europe-west1')
    .firestore.document('likes/{id}')
    .onCreate((snapshot:any) => {
        return db
            .doc(`/screams/${snapshot.data().screamId}`)
            .get()
            .then((doc:any) => {
                if (
                    doc.exists &&
                    doc.data().userHandle !== snapshot.data().userHandle
                ) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type: 'like',
                        read: false,
                        screamId: doc.id
                    });
                }
            })
            .catch((err:any) => console.error(err));
    });

//delte notificaton on posts that has been liked and the unliked
exports.deleteNotificationOnUnLike = functions
    .region('europe-west1')
    .firestore.document('likes/{id}')
    .onDelete((snapshot:any) => {
        return db
            .doc(`/notifications/${snapshot.id}`)
            .delete()
            .catch((err:any) => {
                console.error(err);
                return;
            });
    });

exports.createNotificationOnComment = functions
    .region('europe-west1')
    .firestore.document('comments/{id}')
    .onCreate((snapshot:any) => {
        return db
            .doc(`/screams/${snapshot.data().screamId}`)
            .get()
            .then((doc:any) => {
                if (
                    doc.exists &&
                    doc.data().userHandle !== snapshot.data().userHandle
                ) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type: 'comment',
                        read: false,
                        screamId: doc.id
                    });
                }
            })
            .catch((err:any) => {
                console.error(err);
                return;
            });
    });

//TODO change userImage in comments
exports.onUserImageChange = functions
    .region('europe-west1')
    .firestore.document('/users/{userId}')
    .onUpdate((change:any) => {
        console.log(change.before.data());
        console.log(change.after.data());

        if (change.before.data().imageUrl !== change.after.data().imageUrl) {
            console.log('image has changed');
            let batch = db.batch();
            return db.collection('screams')
                .where('userHandle', '==', change.before.data().handle)
                .get()
                .then((data: any) => {
                    data.forEach((doc: any) => {
                        const scream = db.doc(`/screams/${doc.id}`);
                        batch.update(scream, {userImage: change.after.data().imageUrl});
                    })
                    return batch.commit();
                })
        }
        else
            return true;
    })

exports.onScreamDelete = functions
    .region('europe-west1')
    .firestore.document('/screams/{screamId}')
    .onDelete((snapshot:any,context:any) => {
        const screamId = context.params.screamId;
        const batch = db.batch();
        return db.collection('comments')
            .where('screamId','==',screamId)
            .get()
            .then((data:any) => {
                data.forEach((doc:any) => {
                    batch.delete(db.doc(`/comments/${doc.id}`))
                })
                return db.collection('likes')
                    .where('screamId','==',screamId)
                    .get();
            })
            .then((data:any) => {
                data.forEach((doc:any) => {
                    batch.delete(db.doc(`/likes/${doc.id}`))
                })
                return db
                    .collection('notifications')
                    .where('screamId','==',screamId)
                    .get();
            })
            .then((data:any) => {
                data.forEach((doc:any) => {
                    batch.delete(db.doc(`/notifications/${doc.id}`))
                })
                return batch.commit();
            })
            .catch((err:any) => console.error(err));


    })



import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";
admin.initializeApp();

export const getUserDecima = functions.https.onRequest((req, res) => {
 const promise = admin.firestore().doc('users/Decima').get()
 const p2 = promise.then(snapshot => {
  const data = snapshot.data();
  res.send(data)
     });
 p2.catch(error => {
  console.log(error)
  res.status(500).send(error)
 })
});

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
 export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
 });
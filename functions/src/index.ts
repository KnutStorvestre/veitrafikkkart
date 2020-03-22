import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";
admin.initializeApp();

exports.createNewUser = functions.https.onRequest((req, res:any | undefined) => {

    if (req.method !== 'POST')
        return res.status(400).json({error: 'MMM'});
    /*
    if (req.method !== 'POST'){
        return res.status(400).json({ error: 'Method not allowed'});
    }
     */

    const newUser = {
        first: req.body.body,
        time: admin.firestore.Timestamp.fromDate(new Date())
    };

    admin
        .firestore()
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

export const getUsers = functions.https.onRequest((req, res) => {
 admin.firestore().collection('users').get()
     .then((data => {
      let scream = [];
      scream.push("");
      data.forEach((doc) => {
       scream.push(doc.data())
      });
      return res.json(scream)
     }))
     .catch((err) => console.log(err))
});

export const getUserDecima = functions.https.onRequest((req, res) => {
 admin.firestore().doc('users/Decima').get()
 .then(snapshot => {
  const data = snapshot.data();
  res.send(data)
     })
 .catch(error => {
  console.log(error);
  res.status(500).send(error)
 })
});

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
 export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
 });
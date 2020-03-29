const functions = require('firebase-functions');

const app = require('express')();

const {db,admin,firebase} = require('./util/admin');


app.get('/screams',(req:undefined, res:undefined | any) => {
    db
        .collection('screams')
        //.orderBy('createdAt','desc') denne er buggy
        .get()
        .then((data:any) => {
            let screams:any = [];
            data.forEach((doc:any) => {
                screams.push({
                    screamId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt
                })
            });
            return res.json(screams);
        })
        .catch((err:any) => console.log(err));
});

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

app.post('/scream', FBAuth,(req:any, res:any | undefined) => {
    if (req.body.body.trim() === ''){
        return res.status(400).json({ body: 'Body must not be empty' });
    }                          

    const newScream = {
        body: req.body.body,
        userHandle: req.user.handle,
        //turns date into string
        createdAt: new Date().toISOString()
        //time: admin.firestore.Timestamp.fromDate(new Date())
    };

    db
        .collection('screams')
        .add(newScream)
        .then((doc:any) => {
            res.json({ message: `document ${doc.id} created successfully`});
        })
        .catch((err:any) => {
            res.status(500).json({ error: 'something went wrong'});
            console.error(err)
        })
});

const isEmail = (email:any) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regEx))
        return true;
    else
        return false;

};

const isEmpty = (string:any) => {
    if (string.trim() === '')
        return true;
    else
        return false;
}

app.post('/signup',(req:any,res:any) => {
    const newUser = {
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
            handle: req.body.handle
    };

    interface LooseObject {
        [key: string]: any
    }

    let errors: LooseObject = {};

    if (isEmpty(newUser.email)){
    errors.email = 'Email must not be empty'
    }
    else if (!isEmail(newUser.email)){
        errors.email = 'Must be valid email address'
    }

    if (isEmpty(newUser.password))
        errors.password = 'Must not be empty';
    if (newUser.password !== newUser.confirmPassword)
        errors.confirmPassword = 'Passwords must match';
    if (isEmpty(newUser.handle))
        errors.handle = 'Must not be empty';

    if (Object.keys(errors).length > 0)
        return res.status(400).json(errors);
    //validate data
    let token:any, userId:any;
    db.doc(`/users/${newUser.handle}`).get()
        .then((doc:any) => {
            //if true = handle already exists
            if (doc.exists){
                return res.status(400).json({ handle: 'this handle is already taken'})
            }
            else {
                return firebase
                    .auth()
                    .createUserWithEmailAndPassword(newUser.email, newUser.password)
            }
        })
        .then((data:any) => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then((idToken:any) => {
            token = idToken;
            const userCredentials = {
                handle: newUser.handle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                userId
            };
            return db.doc(`/users/${newUser.handle}`).set(userCredentials);
            //return res.status(201).json({ token });
        })
        .then(() => {
            return res.status(201).json({ token })
        })
        .catch((err:any) => {
            console.error(err);
            if (err.code === 'auth/email-already-in-use'){
                return res.status(400).json({ email: 'Email already in use' })
            }
            else {
                return res.status(500).json({ error: err.code})
            }
        })
});

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
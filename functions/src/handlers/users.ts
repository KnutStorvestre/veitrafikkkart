export {};

const {db,firebase} = require('../util/admin');

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
};

exports.signup = (req:any,res:any) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    };

    let errors: {[k: string]: any} = {};

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
};
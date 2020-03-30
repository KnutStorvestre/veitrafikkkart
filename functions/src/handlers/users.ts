const config = require('../util/config');
export {};

const {admin,db,firebase} = require('../util/admin');

const { validateSignupData, validateLoginData } = require('../util/validation')

exports.login = (req:any, res:any) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };

    const {valid, errors} = validateLoginData(user);

    if (!valid)
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
};

exports.signup = (req:any,res:any) => {

    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    };

    const {valid, errors} = validateSignupData(newUser);

    if (!valid)
        return res.status(400).json(errors);

    const noImg = 'no-img.png';

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
                imageURL: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
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

exports.uploadImage = (req:any,res:any) => {
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');

    const busboy = new BusBoy({ headers: req.headers });


    interface IImageToBeUploaded {
        filepath?:any,
        mimetype?: any
    }

    let imageFileName:string;

    let imageToBeUploaded:IImageToBeUploaded = {};

    busboy.on('file', (fieldname:any, file:any, filename:any, encoding:any, mimetype:string) => {
        console.log(fieldname);
        console.log(filename);
        console.log(mimetype);
        const imageExtention = filename.split('.')[filename.split('.')-1];
        imageFileName = `${Math.round(Math.random()*100000000000)}.${imageExtention}`;
        const filepath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = { filepath, mimetype};
        file.pipe(fs.createWriteStream(filepath));
    });
    busboy.on('finish', () => {
        admin.storage().bucket().upload(imageToBeUploaded.filepath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        })
            .then(() => {
                const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
                return db.doc(`/users/${req.user.handle}`).upload({imageUrl})
            })
            .then(() => {
                return res.json({ message: 'Image uploaded successfully'});
            })
            .catch((err:any) => {
                console.error(err);
                return res.status(500).json({error: err.code})
            });
    });
};
const config = require('../util/config');
export {};
const {db,firebase,admin} = require('../util/admin');
const { validateSignupData, validateLoginData, reduceUserDetails } = require('../util/validators');

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
            console.log(err);
            return res
                .status(403)
                .json({general: 'Wrong credentials, please try again'});
        });
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
                imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
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
                return res.status(500).json({ general: 'Something went wrong, please try again'});
            }
        })
};

exports.addUserDetails = (req:any, res:any) => {
    const userDetails = reduceUserDetails(req.body);

    db.doc(`/users/${req.user.handle}`).update(userDetails)
        .then(() => {
            return res.json({ message: 'Details added successfully'});
        })
        .catch((err:any) => {
            console.log(err);
            return res.status(500).json({error: err.code});
        })
};

exports.getUserDetails = (req:any,res:any) => {
    interface IUserData {
        user:any,
        screams:any[]
    }

    let userData:IUserData = {user:"",screams:[]} ;

    db.doc(`/users/${req.params.handle}`)
        .get()
        .then((doc:any) => {
            if (doc.exists){
                userData.user = doc.data();
                return db.collection('screams')
                    .where('userHandle','==',req.params.handle)
                    .orderBy('createdAt','desc')
                    .get();
            }
            else
                return res.status(404).json({ error: 'User not found' });
        })
        .then((data:any) => {
            userData.screams = [];
            data.forEach((doc:any) => {
                userData.screams.push({
                    body: doc.data().body,
                    createdAt: doc.data().createdAt,
                    userHandle: doc.data().userHandle,
                    userImage: doc.data().userImage,
                    likeCount: doc.data().likeCount,
                    commentCount: doc.data().commentCount,
                    screamId: doc.data().id
                })
            });
            return res.json(userData);
        })
        .catch((err:any) => {
            console.error(err);
            return res.status(500).json({ error: err.code});
        });
};

//Get own user details
exports.getAuthenticatedUser = (req:any, res:any) => {

    interface IuserData {
        credentials:any,
        likes:any[],
        notifications:any[]
    }

    let userData:IuserData = {credentials:"",likes:[],notifications:[]}; //eksperimental

    db.doc(`/users/${req.user.handle}`).get()
        .then((doc:any) => {

            if (doc.exists) {
                userData.credentials = doc.data();
                return db
                    .collection('likes')
                    .where('userHandle', '==', req.user.handle)
                    .get();
            }
        })
        .then((data:any) => {
            userData.likes = [];
            data.forEach((doc:any) => {
                userData.likes.push(doc.data());
            });
            return db
                .collection('notifications')
                .where('recipient', '==', req.user.handle)
                .orderBy('createdAt', 'desc')
                .limit(10)
                .get();
        })
        .then((data:any) => {
            data.forEach((doc:any) => {
                userData.notifications.push({
                    recipient: doc.data().recipient,
                    sender: doc.data().sender,
                    createdAt: doc.data().createdAt,
                    screamId: doc.data().screamId,
                    type: doc.data().type,
                    read: doc.data().read,
                    notificationId: doc.id
                })
            });
            return res.json(userData);
        })
        .catch((err:any) => {
            console.log(err);
            return res.status(500).json({ error: err.code});
        });
};

//Uploads a profile image for user
exports.uploadImage = (req:any, res:any) => {
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');

    const busboy = new BusBoy({ headers: req.headers });

    interface IImageToBeUploaded {
        filepath?:any,
        mimetype?: any
    }

    let imageToBeUploaded:IImageToBeUploaded = {};

    let imageFileName:string = "s";

    busboy.on('file', (fieldname:any, file:any, filename:any, encoding:any, mimetype:any) => {
        console.log(fieldname, file, filename, encoding, mimetype);
        if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
            return res.status(400).json({ error: 'Wrong file type submitted' });
        }
        // my.image.png => ['my', 'image', 'png']
        const imageExtension = filename.split('.')[filename.split('.').length - 1];
        // 32756238461724837.png
        imageFileName = `${Math.round(
            Math.random() * 1000000000000
        ).toString()}.${imageExtension}`;
        const filepath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = { filepath, mimetype };
        file.pipe(fs.createWriteStream(filepath));
    });
    busboy.on('finish', () => {
        admin
            .storage()
            .bucket()
            .upload(imageToBeUploaded.filepath, {
                resumable: false,
                metadata: {
                    metadata: {
                        contentType: imageToBeUploaded.mimetype
                    }
                }
            })
            .then(() => {
                const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${
                    config.storageBucket
                }/o/${imageFileName}?alt=media`;
                return db.doc(`/users/${req.user.handle}`).update({ imageUrl });
            })
            .then(() => {
                return res.json({ message: 'image uploaded successfully' });
            })
            .catch((err:any) => {
                console.error(err);
                return res.status(500).json({ error: 'something went wrong' });
            });
    });
    busboy.end(req.rawBody);
};

exports.markNotificationsRead= (req:any,res:any) => {
    let batch = db.batch();
    req.body.forEach((notificationId: any) => {
        const notification = db.doc(`/notifications/${notificationId}`);
        batch.update(notification, {read: true});
    })
    batch.commit()
        .then(() => {
            return res.json({message: 'Notifications marked read'});
        })
        .catch((err: any) => {
            console.error(err);
            return res.status(500).json({error: err.code});
        });
};
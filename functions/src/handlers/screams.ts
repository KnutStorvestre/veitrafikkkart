export {}
const {db} = require('../util/admin');


exports.getAllScreams = (req:any, res:any) => {
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
};

exports.postOneScream = (req:any, res:any | undefined) => {
    if (req.body.body.trim() === ''){
        return res.status(400).json({ body: 'Body must not be empty' });
    }

    const newScream = {
        body: req.body.body,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl,
        //turns date into string
        createdAt: new Date().toISOString(),
        likeCont: 0,
        commentCount: 0,
        //time: admin.firestore.Timestamp.fromDate(new Date())
    };

    const resScream = {
        body: req.body.body,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl,
        //turns date into string
        createdAt: new Date().toISOString(),
        likeCont: 0,
        commentCount: 0,
        screamId: ""
        //time: admin.firestore.Timestamp.fromDate(new Date())
    };

    db
        .collection('screams')
        .add(newScream)
        .then((doc:any) => {
            //const resScream = newScream;
            resScream.screamId = doc.id;
            res.json(resScream);
        })
        .catch((err:any) => {
            res.status(500).json({ error: 'something went wrong'});
            console.error(err)
        })
};

exports.getScream = (req:any, res:any) => {
    //let screamData = {};
    interface IScreamData {
        screamId:any,
        comments:any[]
    }

    console.log(req.params.screamId);

    let screamData:IScreamData = {screamId:"", comments:[]};

    db.doc(`/screams/${req.params.screamId}`)
        .get()
        .then((doc:any) => {
            if (!doc.exists) {
                return res.status(404).json({ error: 'Scream not found' });
            }
            screamData = doc.data();
            screamData.screamId = doc.id;
            return db
                .collection('comments')
                .orderBy('createdAt', 'desc')
                .where('screamId', '==', req.params.screamId)
                .get();
        })
        .then((data:any) => {
            screamData.comments = [];
            data.forEach((doc:any) => {
                screamData.comments.push(doc.data());
            });
            return res.json(screamData);
        })
        .catch((err:any) => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });
};

exports.commentOnScream = (req:any,res:any) => {
    if (req.body.body.trim() === '')
        return res.status(400).json({comment: 'Must not be empty'});

    const newComment = {
        body: req.body.body,
        createdAt: new Date().toISOString(),
        screamId: req.params.screamId,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl
    };

    console.log(newComment);

    db.doc(`/screams/${req.params.screamId}`)
        .get()
        .then((doc:any) => {
            if (!doc.exists){
                return res.status(404).json({error: 'Scream not found'});
            }
            return db.collection('comments').add(newComment);
        })
        .then(() => {
            res.json(newComment);
        })
        .catch((err:any) => {
            console.log(err);
            res.status(500).json({ error: 'Something went wrong' })
        })
};

exports.likeScream = (req:any,res:any) => {
    const likeDocument = db.collection('likes')
        .where('userHandle',"==", req.user.handle)
        .where('screamId','==',req.params.screamId).limit(1);

    const screamDocument = db.doc(`/screams/${req.params.screamId}`);

    let screamData: {[k: string]: any} = {};

    screamDocument.get()
        .then((doc:any) => {
            if (doc.exists){
                screamData = doc.data();
                console.log(screamData); //temp
                console.log(doc.data()); //temp
                screamData.screamId = doc.id;
                return likeDocument.get();
            }
            else
                res.status(404).json({error: 'Scream not found'});
        })
        .then((data:any) => {
            if (data.empty){
                return db.collection('likes').add({
                    screamId: req.params.screamId,
                    userHandle: req.user.handle
                })
                    .then(() => {
                        screamData.likeCount++;
                        return screamDocument.update({ likeCount: screamData.likeCount })
                    })
                    .then(() => {
                        return res.json(screamData);
                    })
            }
            else {
                return res.status(400).json({ error: 'Scream already liked'});
            }
        })
        .catch((err:any) => {
            console.log(err);
            res.status(500).json({ error: err.code })
        })

}


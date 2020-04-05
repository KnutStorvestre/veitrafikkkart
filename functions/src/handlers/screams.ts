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
};


exports.getScream = (req:any, res:any) => {
    interface IScreamData {
        screamId:any,
        comments:any[]
    }

    let screamData:IScreamData = {screamId:"", comments:[]};
    db.doc(`/screams/${req.params.screamId}`)
        .get()
        .then((doc:any) => {
            if (!doc.exists){
                return res.status(404).json({error: 'Scream not found'})
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
            data.forEach((doc:any) => {
                screamData.comments.push(doc.data())
            });
            return res.json(screamData);
        })
        .catch((err:any) => {
            console.log(err);
            res.status(500).json({ error: err.code});
        })
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

    console.log(newComment)

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


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
const nano = require('nano')('http://localhost:5984');
const library = nano.db.use('library');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.loginUser = (req, res, next) => {
    const q = {
        selector: {
            _id: {"$eq": req.body.username},
            status: {"$eq": 1},
            deleted: {"$eq": 0}
        },
        fields: ["password"]
    };
    library.find(q).then((data) => {
        if (!data.docs.length) {
            return res.status(401).json({
                message: 'Login Failed'
            })
        }
        const userPassword = data.docs[0].password;
        return bcrypt.compare(req.body.password, userPassword)

    }).then((result) => {
        if (!result) {
            return res.status(401).json({
                message: 'Login Failed'
            })
        }
        const token = jwt.sign({userId: req.body.username}, 'MY_SECRET_KEY', {expiresIn: "3h"})
        res.status(200).json({
            token: token
        })
    });
}

exports.userDetails = (req, res, next) => {
    const q = {
        selector: {
            _id: {"$eq": req.userData.userId},
            docType: {"$eq": "user"},
        },
        fields: ["_id", "_rev", "firstName", "userType"]
    };
    library.find(q)
        .then(data => {
            let user = [];
            console.log(data);
            if (data.docs.length) {
                user = data.docs[0];
            }
            res.status(200).json({
                user: user
            });
        })
        .catch(err => {
            console.log(err);
        });
}

const nano = require('nano')('http://localhost:5984');
const library = nano.db.use('library');
const bcrypt = require('bcryptjs');

exports.getLibrarians = (req, res, next) => {
    library.view('librarianList', 'librarian-list')
        .then(data => {
            let users = [];
            if (data.rows.length) {
                users = data.rows.map(row => {
                    return {
                        id: row.id,
                        firstName: row.value.firstName,
                        lastName: row.value.lastName,
                        email: row.value.email,
                        phone: row.value.phone,
                        status: row.value.status,
                        deleted: 0,
                        _rev: row.value._rev
                    }
                });
            }
            res.status(200).json({
                list: users
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.addLibrarian = (req, res, next) => {

    const q = {
        selector: {
            _id: {"$eq": req.userData.userId},
            userType: {"$eq": "admin"},
        },
        fields: ["_id"]
    };
    library.find(q).then((data) => {
        if (!data.docs.length) {
            return res.status(401).json({
                message: 'Unauthorized User'
            })
        }

        bcrypt.hash(req.body.password, 10)
            .then((pass) => {
                const user = {
                    _id: req.body.firstName.toLowerCase() + '-' + Math.floor(99999 + (1 - 99999) * Math.random()),
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    phone: req.body.phone,
                    password: pass,
                    userType: 'librarian',
                    status: 0,
                    deleted: 0,
                    docType: 'user'
                };
                library.insert(user)
                    .then((data) => {
                        res.status(201).json({
                            user: {
                                ...user,
                                rev: data.rev
                            },
                            message: 'User added successfully'
                        });
                    })
                    .catch((err) => {
                        res.status(500).json({
                            message: 'There was some error'
                        });
                    });
            });
    })
};

exports.changeStatus = (req, res, next) => {
    const q = {
        selector: {
            _id: {"$eq": req.userData.userId},
            userType: {"$eq": "admin"},
        },
        fields: ["_id"]
    };
    library.find(q).then((data) => {
        if (!data.docs.length) {
            return res.status(401).json({
                message: 'Unauthorized User'
            })
        }
        const q = {
            selector: {
                _id: {"$eq": req.body.user.id},
                userType: {"$eq": "librarian"},
            },
            fields: ["_id", "_rev", "firstName", "lastName", "email", "phone", "password", "userType", "status", "deleted", "docType"]
        };
        library.find(q).then((data) => {
            if (!data.docs.length) {
                return res.status(400).json({
                    message: 'Invalid User'
                })
            }
            const doc = data.docs[0];
            const id = req.body.user.id;
            const _rev = req.body.user._rev;
            delete doc._id;
            delete doc._rev;
            doc.status = doc.status ? 0 : 1;
            library.insert({_id: id, _rev: _rev, ...doc}).then((body) => {
                res.status(201).json({
                    user: {
                        id: body.id,
                        _rev: body.rev
                    },
                    message: 'Status Updated successfully'
                });
            })

        })
    })
};

exports.removeLibrarian = (req, res, next) => {
    const q = {
        selector: {
            _id: {"$eq": req.userData.userId},
            userType: {"$eq": "admin"},
        },
        fields: ["_id"]
    };
    library.find(q).then((data) => {
        if (!data.docs.length) {
            return res.status(401).json({
                message: 'Unauthorized User'
            })
        }
        const q = {
            selector: {
                _id: {"$eq": req.body.user.id},
                userType: {"$eq": "librarian"},
            },
            fields: ["_id", "_rev", "firstName", "lastName", "email", "phone", "password", "userType", "status", "deleted", "docType"]
        };
        library.find(q).then((data) => {
            if (!data.docs.length) {
                return res.status(400).json({
                    message: 'Invalid User'
                })
            }
            const doc = data.docs[0];
            const id = req.body.user.id;
            const _rev = req.body.user._rev;
            delete doc._id;
            delete doc._rev;
            doc.deleted = 1;
            library.insert({_id: id, _rev: _rev, ...doc}).then((body) => {
                res.status(201).json({
                    user: {
                        id: body.id,
                        _rev: body.rev
                    },
                    message: 'Librarian deleted successfully'
                });
            })

        })
    })
};

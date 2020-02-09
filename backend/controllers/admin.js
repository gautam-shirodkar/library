const nano = require('nano')('http://localhost:5984');
const library = nano.db.use('library');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getLibrarians = (req, res, next) => {
    library.view('all_books', 'all-books')
        .then(data => {
            data.rows.forEach((doc) => {
                console.log(doc.value);
            });
        })
        .catch(err => {
            console.log(err);
        });

    res.status(200).json({
        books: [{
            id: 'category-isbn',
            name: 'book1',
            category: 'fiction',
            auhtor: 'john',
            publishDate: '12/12/2019'
        }]
    });
};

exports.addLibrarian = (req, res, next) => {

    bcrypt.hash(req.body.password, 10)
        .then((pass) => {
            const user = {
                _id: req.body.username + '-' + Math.floor(99999 + (1 - 99999) * Math.random()),
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phone: req.body.phone,
                password: pass,
                userType: 'librarian',
                status: 0,
                docType: 'user'
            };
            library.insert(user)
                .then((data) => {
                    res.status(201).json({
                        message: 'User added successfully'
                    });
                })
                .catch((err) => {
                    res.status(500).json({
                        message: 'There was some error'
                    });
                });
        });
};

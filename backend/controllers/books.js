const nano = require('nano')('http://localhost:5984');
const library = nano.db.use('library');

exports.getBooks = (req, res, next) => {
  library.view('books', 'books')
    .then(data => {
      let books = [];
      if (data.rows.length) {
        books = data.rows.map(row => {
          return {
            _id: row.id,
            title: row.value.title,
            isbn: row.value.isbn,
            category: row.value.category,
            author: row.value.author,
            publishDate: row.value.publishDate,
            image: row.value.imagePath,
            rating: row.value.rating,
            deleted: 0,
            _rev: row.value._rev
          }
        });
      }
      res.status(200).json({
        list: books
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.addBook = (req, res, next) => {

  library.view('validAdmins', 'valid-admins', {
    keys: [req.userData.userId, 'admin', 'librarian'], include_docs: true
  })
    .then((data) => {
      if (!data.rows.length) {
        return res.status(401).json({
          message: 'Unauthorized User'
        })
      }

      const book = {
        _id: req.body.category + '-' + req.body.isbn,
        isbn: req.body.isbn,
        title: req.body.title,
        category: req.body.category,
        author: req.body.author,
        publishDate: req.body.publishDate,
        userId: req.userData.userId,
        imagePath: req.file.filename,
        description: req.body.description,
        deleted: 0,
        docType: 'book'
      };

      library.insert(book)
        .then((data) => {
          res.status(201).json({
            message: 'Book added successfully'
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: 'There was some error'
          });
        });
    })
};

exports.getBookDetails = (req, res, next) => {
  const bookId = req.params.id;
  const q = {
    selector: {
      _id: {"$eq": bookId},
      docType: {"$eq": "book"},
    },
    fields: ["_id", "_rev", "title", "isbn", "category", "author", "publishDate", "imagePath", "description", "rating"]
  };
  library.find(q)
    .then(data => {
      let book = [];
      if (data.docs.length) {
        book = data.docs[0];
      }
      res.status(200).json({
        book: book
      });
    })
    .catch(err => {
    });
}

exports.requestBook = (req, res, next) => {

  const bookRequest = {
    _id: 'rq-' + req.userData.userId + '-' + req.body._id + '-' + (new Date().getTime()),
    bookId: req.body._id,
    userId: req.userData.userId,
    bookTitle: req.body.title,
    requestDate: (new Date()).toDateString(),
    requestStatus: 1,
    deleted: 0,
    docType: 'request'
  };

  library.insert(bookRequest)
    .then((data) => {
      res.status(200).json({
        message: 'Request placed successfully'
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: 'There was some error'
      });
    });
}


exports.requestsList = (req, res, next) => {
  library.view('requests', 'requests')
    .then(data => {
      let requests = [];
      if (data.rows.length) {
        requests = data.rows.map(row => {
          return {
            _id: row.id,
            bookId: row.value.bookId,
            userId: row.value.userId,
            bookTitle: row.value.bookTitle,
            requestDate: row.value.requestDate,
            requestStatus: row.value.requestStatus,
            _rev: row.value._rev
          }
        });
      }
      res.status(200).json({
        list: requests
      });
    })
    .catch(err => {
    });
};

exports.acceptRequest = (req, res, next) => {
  library.view('validAdmins', 'valid-admins', {
    keys: [req.userData.userId, 'admin', 'librarian'], include_docs: true
  })
    .then((data) => {
      if (!data.rows.length) {
        return res.status(401).json({
          message: 'Unauthorized User'
        })
      }

      const q = {
        selector: {
          _id: {"$eq": req.body.request._id},
          docType: {"$eq": "request"},
        },
        fields: ["_id", "_rev", "bookId", "userId", "bookTitle", "requestDate", "requestStatus", "deleted", "docType"]
      };
      library.find(q).then((data) => {
        if (!data.docs.length) {
          return res.status(400).json({
            message: 'Invalid Request'
          })
        }
        const doc = data.docs[0];
        const id = req.body.request._id;
        const _rev = req.body.request._rev;
        delete doc._id;
        delete doc._rev;
        doc.requestStatus = 2;
        library.insert({_id: id, _rev: _rev, ...doc}).then((body) => {
          res.status(200).json({
            user: {
              id: body.id,
              _rev: body.rev
            },
            message: 'Request Status Updated successfully'
          });
        })
      })
    })
}

exports.rejectRequest = (req, res, next) => {
  library.view('validAdmins', 'valid-admins', {
    keys: [req.userData.userId, 'admin', 'librarian'], include_docs: true
  })
    .then((data) => {
      if (!data.rows.length) {
        return res.status(401).json({
          message: 'Unauthorized User'
        })
      }

      const q = {
        selector: {
          _id: {"$eq": req.body.request._id},
          docType: {"$eq": "request"},
        },
        fields: ["_id", "_rev", "bookId", "userId", "bookTitle", "requestDate", "requestStatus", "deleted", "docType"]
      };
      library.find(q).then((data) => {
        if (!data.docs.length) {
          return res.status(400).json({
            message: 'Invalid Request'
          })
        }

        const doc = data.docs[0];
        const id = req.body.request._id;
        const _rev = req.body.request._rev;
        delete doc._id;
        delete doc._rev;
        doc.requestStatus = 3;
        library.insert({_id: id, _rev: _rev, ...doc}).then((body) => {
          res.status(200).json({
            user: {
              id: body.id,
              _rev: body.rev
            },
            message: 'Request Status Updated successfully'
          });
        })
      })
    })
};

exports.saveReview = (req, res, next) => {

  const bookId = req.body.bookId;

  const q = {
    selector: {
      _id: {"$eq": bookId},
      docType: {"$eq": "book"},
    },
    fields: ["_id", "_rev", "title", "isbn", "category", "author", "publishDate", "imagePath", "description", "userId", "deleted", "docType", "rating", "totalReviews"]
  };
  library.find(q)
    .then(data => {
      if (data.docs.length) {
        const doc = data.docs[0];
        const id = doc._id;
        const _rev = doc._rev;
        delete doc._id;
        delete doc._rev;
        const totalReviews = doc.totalReviews ? doc.totalReviews : 0;
        const rating = doc.rating ? doc.rating : 0;
        doc.totalReviews = totalReviews + 1;
        doc.rating = (rating + +req.body.rating) / doc.totalReviews;
        library.insert({_id: id, _rev: _rev, ...doc}).then((body) => {
          const bookRequest = {
            _id: 'review-' + req.userData.userId + '-' + req.body.bookId + '-' + (new Date().getTime()),
            bookId: req.body.bookId,
            userId: req.userData.userId,
            addedOn: (new Date()).toDateString(),
            comment: req.body.comment,
            rating: req.body.rating,
            status: 0,
            deleted: 0,
            docType: 'review'
          };

          library.insert(bookRequest)
            .then((data) => {
              res.status(200).json({
                message: 'Review added successfully'
              });
            })
            .catch((err) => {
              res.status(500).json({
                message: 'There was some error'
              });
            });
        })
          .catch(err => console.log(err));
      }
    })
    .catch(err => {
    });
}

exports.getReviews = (req, res, next) => {
  const bookId = req.params.id;
  const q = {
    selector: {
      bookId: {"$eq": bookId},
      docType: {"$eq": "review"},
    },
    fields: ["_id", "_rev", "bookId", "userId", "rating", "comment", "addedOn", "status"]
  };
  library.find(q).then((data) => {
    let reviews = [];
    console.log(data);
    if (data.docs.length) {
      reviews = data.docs.filter(rv => rv.status === 1)
      console.log(reviews);
    }
    res.status(200).json({
      list: reviews
    });
  })
}

exports.getAllReviews = (req, res, next) => {
  library.view('bookReviews', 'book-reviews')
    .then(data => {
      console.log(data);
      let books = [];
      if (data.rows.length) {
        books = data.rows.map(row => {
          return {
            _id: row.id,
            _rev: row.value._rev,
            bookId: row.value.bookId,
            userId: row.value.userId,
            reviewDate: row.value.addedOn,
            comment: row.value.comment,
            rating: row.value.rating,
            reviewStatus: row.value.status
          }
        });
      }
      res.status(200).json({
        list: books
      });
    })
    .catch(err => {
      console.log(err);
    });
}

exports.acceptReview = (req, res, next) => {
  library.view('validAdmins', 'valid-admins', {
    keys: [req.userData.userId, 'admin', 'librarian'], include_docs: true
  })
    .then((data) => {
      if (!data.rows.length) {
        return res.status(401).json({
          message: 'Unauthorized User'
        })
      }
      console.log(req.body)
      const q = {
        selector: {
          _id: {"$eq": req.body.review._id},
          docType: {"$eq": "review"},
        },
        fields: ["_id", "_rev", "bookId", "userId", "addedOn", "comment", "rating", "status", "deleted", "docType"]
      };
      library.find(q).then((data) => {
        if (!data.docs.length) {
          return res.status(400).json({
            message: 'Invalid Review'
          })
        }
        const doc = data.docs[0];
        const id = req.body.review._id;
        const _rev = req.body.review._rev;
        delete doc._id;
        delete doc._rev;
        doc.status = 1;
        library.insert({_id: id, _rev: _rev, ...doc}).then((body) => {
          res.status(200).json({
            user: {
              id: body.id,
              _rev: body.rev
            },
            message: 'Review Status Updated successfully'
          });
        })
      })
    })
}

exports.rejectReview = (req, res, next) => {
  library.view('validAdmins', 'valid-admins', {
    keys: [req.userData.userId, 'admin', 'librarian'], include_docs: true
  })
    .then((data) => {
      if (!data.rows.length) {
        return res.status(401).json({
          message: 'Unauthorized User'
        })
      }

      const q = {
        selector: {
          _id: {"$eq": req.body.review._id},
          docType: {"$eq": "review"},
        },
        fields: ["_id", "_rev", "bookId", "userId", "addedOn", "comment", "rating", "status", "deleted", "docType"]
      };
      library.find(q).then((data) => {
        if (!data.docs.length) {
          return res.status(400).json({
            message: 'Invalid Request'
          })
        }

        const doc = data.docs[0];
        const id = req.body.review._id;
        const _rev = req.body.review._rev;
        delete doc._id;
        delete doc._rev;
        doc.status = 2;
        library.insert({_id: id, _rev: _rev, ...doc}).then((body) => {
          res.status(200).json({
            user: {
              id: body.id,
              _rev: body.rev
            },
            message: 'Review Status Updated successfully'
          });
        })
      })
    })
};

exports.searchBooks = (req, res, next) => {
  const title = req.params.title;
  console.log(title);

  library.search('books', 'books', { q: title }).then((doc) => {
    console.log(doc);
  })
    .catch(err => console.log(err));
}

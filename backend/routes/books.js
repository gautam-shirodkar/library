const multer = require('multer');
const auth = require('../middleware/auth');
const router = require('express').Router();
const bookController = require('../controllers/books');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jps': 'jpg'
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid file");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images/books")
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
})
router.get('/list', bookController.getBooks);
router.get('/details/:id', bookController.getBookDetails);
router.post('/add', auth, multer({storage: storage}).single("image"), bookController.addBook);
router.post('/request', auth, bookController.requestBook);
router.get('/request-list', auth, bookController.requestsList);
router.put('/accept-request', auth, bookController.acceptRequest);
router.put('/reject-request', auth, bookController.rejectRequest);
router.post('/review', auth, bookController.saveReview);
router.get('/review/:id', bookController.getReviews);
router.get('/review/', bookController.getAllReviews);
router.put('/accept-review', auth, bookController.acceptReview);
router.put('/reject-review', auth, bookController.rejectReview);
router.get('/search-book/:title', bookController.searchBooks);
module.exports = router;

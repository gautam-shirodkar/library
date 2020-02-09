const router = require('express').Router();
const librariansController = require('../controllers/librarians');
const auth = require('../middleware/auth');

router.get('/list', auth, librariansController.getLibrarians);
router.post('/signup', auth, librariansController.addLibrarian);

module.exports = router;

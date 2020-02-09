const router = require('express').Router();
const librariansController = require('../controllers/librarians');
const auth = require('../middleware/auth');

router.get('/list', auth, librariansController.getLibrarians);
router.post('/signup', auth, librariansController.addLibrarian);
router.put('/status', auth, librariansController.changeStatus);
router.put('/remove', auth, librariansController.removeLibrarian);

module.exports = router;

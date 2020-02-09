const router = require('express').Router();
const authController = require('../controllers/auth');
const auth = require('../middleware/auth');

router.post('/login', authController.loginUser);
router.get('/user', auth, authController.userDetails);
module.exports = router;

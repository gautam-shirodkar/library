const router = require('express').Router();
const usersController = require('../controllers/users');
const auth = require('../middleware/auth');

router.get('/list', auth, usersController.getUsers);
router.post('/signup', usersController.addUser);

router.put('/status', auth, usersController.changeStatus);
router.put('/remove', auth, usersController.removeUser);

router.get('/requests', auth, usersController.getRequests);
module.exports = router;

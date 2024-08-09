const express = require('express');

const { requireRole } = require('../middleware/auth');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/sign-up', userController.signUp);
router.post('/sign-in', userController.signIn);
router.post('/sign-off', requireRole(), userController.signOff);
router.post('/refresh-token', userController.refreshToken);
router.get('/', requireRole(['admin', 'super_admin']), userController.search);

router.patch('/', requireRole(), userController.update);
router.delete('/', requireRole(), userController.remove);

module.exports = router;

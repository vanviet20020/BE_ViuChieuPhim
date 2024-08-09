const express = require('express');

const { requireRole } = require('../middleware/auth');
const uploadFileMiddleware = require('../middleware/upload');
const movieController = require('../controllers/movieController');

const router = express.Router();

router.post(
    '/create',
    requireRole(['admin', 'super_admin']),
    uploadFileMiddleware,
    movieController.create,
);
router.get('/search', movieController.search);
router.get('/:id', movieController.getByID);
router.patch(
    '/update/:id',
    requireRole(['admin', 'super_admin']),
    uploadFileMiddleware,
    movieController.update,
);
router.put(
    '/update/:id/status',
    requireRole(['admin', 'super_admin']),
    movieController.updateStatus,
);
router.delete(
    '/delete/:id',
    requireRole(['admin', 'super_admin']),
    movieController.remove,
);

module.exports = router;

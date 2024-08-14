const express = require('express');

const { requireRole } = require('../middleware/auth');
const uploadFileMiddleware = require('../middleware/upload');
const { UPLOAD_FOLDER_MOVIE } = require('../helpers/constants');
const movieController = require('../controllers/movieController');

const router = express.Router();

router.post(
    '/',
    requireRole(['admin', 'super_admin']),
    uploadFileMiddleware(UPLOAD_FOLDER_MOVIE),
    movieController.create,
);
router.get('/', movieController.search);
router.get('/:id', movieController.getByID);
router.patch(
    '/',
    requireRole(['admin', 'super_admin']),
    uploadFileMiddleware(UPLOAD_FOLDER_MOVIE),
    movieController.update,
);
router.patch(
    '/status',
    requireRole(['admin', 'super_admin']),
    movieController.updateStatus,
);
router.delete(
    '/',
    requireRole(['admin', 'super_admin']),
    movieController.remove,
);

module.exports = router;

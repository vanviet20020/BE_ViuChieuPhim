const express = require('express');

const { requireRole } = require('../middleware/auth');
const uploadFileMiddleware = require('../middleware/upload');
const { UPLOAD_FOLDER_SUPPLIER } = require('../helpers/constants');
const supplierController = require('../controllers/supplierController');

const router = express.Router();

router.post(
    '/',
    requireRole(['admin', 'super_admin']),
    uploadFileMiddleware(UPLOAD_FOLDER_SUPPLIER),
    supplierController.create,
);
router.get('/', supplierController.search);
router.get('/:id', supplierController.getByID);
router.patch(
    '/',
    requireRole(['admin', 'super_admin']),
    uploadFileMiddleware(UPLOAD_FOLDER_SUPPLIER),
    supplierController.update,
);
router.delete(
    '/',
    requireRole(['admin', 'super_admin']),
    supplierController.remove,
);

module.exports = router;

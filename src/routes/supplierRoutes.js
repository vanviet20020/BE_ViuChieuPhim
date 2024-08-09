const express = require('express');

const { requireRole } = require('../middleware/auth');
const uploadFileMiddleware = require('../middleware/upload');
const supplierController = require('../controllers/supplierController');

const router = express.Router();

router.post(
    '/',
    requireRole(['admin', 'super_admin']),
    uploadFileMiddleware,
    supplierController.create,
);
router.get('/:id', supplierController.getByID);
router.patch(
    '/:id',
    requireRole(['admin', 'super_admin']),
    uploadFileMiddleware,
    supplierController.update,
);
router.delete(
    '/:id',
    requireRole(['admin', 'super_admin']),
    supplierController.remove,
);

module.exports = router;

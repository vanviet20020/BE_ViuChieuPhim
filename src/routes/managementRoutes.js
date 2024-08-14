const express = require('express');

const { requireRole } = require('../middleware/auth');
const managementController = require('../controllers/managementController');

const router = express.Router();

router.get(
    '/',
    requireRole(['admin', 'super_admin']),
    managementController.management,
);

module.exports = router;

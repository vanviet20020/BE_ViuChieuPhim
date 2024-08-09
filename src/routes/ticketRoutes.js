const express = require('express');

const { requireRole } = require('../middleware/auth');
const ticketController = require('../controllers/tickerController');

const router = express.Router();

router.post(
    '/book',
    requireRole(['user', 'admin', 'super_admin']),
    ticketController.bookTicket,
);

module.exports = router;

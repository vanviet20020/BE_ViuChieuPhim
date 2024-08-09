const express = require('express');

const otherController = require('../controllers/homeController');

const router = express.Router();

router.get('/', otherController.home);

module.exports = router;

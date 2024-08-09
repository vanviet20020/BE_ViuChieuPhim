const express = require('express');

const { requireRole } = require('../middleware/auth');
const cinemaController = require('../controllers/cinemaController');

const router = express.Router();

router.post(
    '/',
    requireRole(['admin', 'super_admin']),
    cinemaController.create,
);
router.get('/', cinemaController.search);
router.get('/:id', cinemaController.getByID);
router.get('/geojson', cinemaController.geojson);
router.patch(
    '/:id',
    requireRole(['admin', 'super_admin']),
    cinemaController.update,
);
router.delete(
    '/:id',
    requireRole(['admin', 'super_admin']),
    cinemaController.remove,
);

module.exports = router;

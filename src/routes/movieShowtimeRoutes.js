const express = require('express');

const { requireRole } = require('../middleware/auth');
const movieShowtimeController = require('../controllers/movieShowtimeController');

const router = express.Router();

router.post(
    '/create',
    requireRole(['admin', 'super_admin']),
    movieShowtimeController.create,
);
router.get('/:id', movieShowtimeController.getByID);
router.get('/movie/:id', movieShowtimeController.getByIDMovie);
router.get('/cinema/:id', movieShowtimeController.getByIDCinema);
router.patch(
    '/update/:id',
    requireRole(['admin', 'super_admin']),
    movieShowtimeController.update,
);
router.delete(
    '/delete',
    requireRole(['admin', 'super_admin']),
    movieShowtimeController.remove,
);

module.exports = router;

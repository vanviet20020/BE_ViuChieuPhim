const express = require('express');

const { requireRole } = require('../middleware/auth');
const movieShowtimeController = require('../controllers/movieShowtimeController');

const router = express.Router();

router.post(
    '/',
    requireRole(['admin', 'super_admin']),
    movieShowtimeController.create,
);
router.get('/:id', movieShowtimeController.getByID);
router.get('/movie/:id_movie', movieShowtimeController.getByIDMovie);
router.get('/cinema/:id_cinema', movieShowtimeController.getByIDCinema);
router.patch(
    '/',
    requireRole(['admin', 'super_admin']),
    movieShowtimeController.update,
);
router.delete(
    '/',
    requireRole(['admin', 'super_admin']),
    movieShowtimeController.remove,
);

module.exports = router;

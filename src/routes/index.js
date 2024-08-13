const homeRoutes = require('./homeRoutes');
const managementRoutes = require('./managementRoutes');
const userRoutes = require('./userRoutes');
const supplierRoutes = require('./supplierRoutes');
const movieRoutes = require('./movieRoutes');
const cinemaRoutes = require('./cinemaRoutes');
const movieShowtimeRoutes = require('./movieShowtimeRoutes');
const ticketRoutes = require('./ticketRoutes');

const route = (app) => {
    app.use('/user', userRoutes);
    app.use('/supplier', supplierRoutes);
    app.use('/movie', movieRoutes);
    app.use('/cinema', cinemaRoutes);
    app.use('/movie-showtime', movieShowtimeRoutes);
    app.use('/movie-showtime', managementRoutes);
    app.use('/ticket', ticketRoutes);
    app.use('/', homeRoutes);
};

module.exports = route;

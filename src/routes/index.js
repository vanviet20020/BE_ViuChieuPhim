const userRoutes = require('./userRoutes');
const movieRoutes = require('./movieRoutes');
const cinemaRoutes = require('./cinemaRoutes');
const ticketRoutes = require('./ticketRoutes');
const supplierRoutes = require('./supplierRoutes');
const managementRoutes = require('./managementRoutes');
const movieShowtimeRoutes = require('./movieShowtimeRoutes');

const route = (app) => {
    app.use('/user', userRoutes);
    app.use('/supplier', supplierRoutes);
    app.use('/movie', movieRoutes);
    app.use('/cinema', cinemaRoutes);
    app.use('/movie-showtime', movieShowtimeRoutes);
    app.use('/ticket', ticketRoutes);
    app.use('/management', managementRoutes);
};

module.exports = route;

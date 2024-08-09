const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { connection } = require('../configs/connectBD');

const MovieShowtimeSchema = new Schema(
    {
        date: { type: String, required: true },
        start_time: { type: String, required: true },
        seats: { type: Number, required: true },
        ticket_price: { type: Number, required: true },
        movie: {
            type: Schema.Types.ObjectId,
            ref: 'movies',
            require: true,
        },
        cinema: {
            type: Schema.Types.ObjectId,
            ref: 'cinemas',
            require: true,
        },
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    },
);

const MovieShowtime = connection.model('movieshowtimes', MovieShowtimeSchema);

module.exports = MovieShowtime;

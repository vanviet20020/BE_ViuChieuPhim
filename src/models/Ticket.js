const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { connection } = require('../configs/connectBD');

const TicketSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            require: true,
        },
        movie_showtime: {
            type: Schema.Types.ObjectId,
            ref: 'movieshowtimes',
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

const Ticket = connection.model('tickets', TicketSchema);

module.exports = Ticket;

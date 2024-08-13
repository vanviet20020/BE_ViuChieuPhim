const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { connection } = require('../configs/connectBD');

const TicketSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
            index: true,
        },
        movie_showtime: {
            type: Schema.Types.ObjectId,
            ref: 'movieshowtime',
            required: true,
            index: true,
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

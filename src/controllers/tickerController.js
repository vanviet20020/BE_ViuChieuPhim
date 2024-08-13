const mongoose = require('mongoose');
const createError = require('http-errors');

const User = require('../models/User');
const Ticket = require('../models/Ticket');
const MovieShowtime = require('../models/MovieShowtime');
const Transaction = require('../models/Transaction');
const { getDataExists } = require('../helpers/dataExists');

const bookTicket = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { idMovieShowtime, numberTickets, user } = req.body;
        const vNumberTickets = parseInt(numberTickets);

        if (!vNumberTickets || vNumberTickets <= 0) {
            throw new createError.BadRequest('Số vé không hợp lệ');
        }

        const movieShowtime = await getDataExists(
            idMovieShowtime,
            'MovieShowtime',
        );
        if (!movieShowtime) {
            throw new createError.BadRequest('Lịch chiếu không tồn tại');
        }

        const { id: idUser, coin } = user;
        const { ticket_price, seats } = movieShowtime;

        if (coin < ticket_price * vNumberTickets) {
            throw new createError.BadRequest('Số xu không đủ');
        }

        if (seats < vNumberTickets) {
            throw new createError.BadRequest('Số ghế còn lại không đủ');
        }

        // Tạo vé xem phim
        const ticket = await Ticket.create(
            [{ user: idUser, movie_showtime: idMovieShowtime }],
            { session },
        );

        // Tính số ghế còn lại và update vào lịch chiếu
        const remainingSeats = seats - vNumberTickets;
        await MovieShowtime.findByIdAndUpdate(
            idMovieShowtime,
            { seats: remainingSeats },
            { session },
        );

        // Tính hóa đơn cho người dùng và lượng xu còn lại
        const payment = ticket_price * vNumberTickets;
        const new_coin = coin - payment;

        // Tạo lịch sử giao dịch của người dùng
        const queryTransaction = {
            status: 'Mua vé',
            payment,
            old_coin: coin,
            new_coin,
            user: idUser,
            message: `Mua ${numberTickets} vé`,
        };
        const transaction = await Transaction.create([queryTransaction], {
            session,
        });

        // Cập nhật thông tin cho người dùng
        await User.updateOne(
            { _id: idUser },
            {
                coin: new_coin,
                $push: {
                    tickets: ticket[0]._id,
                    transactions: transaction[0]._id,
                },
            },
            { session },
        );

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({ message: 'Đặt vé thành công' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ error: error.message });
    }
};

module.exports = { bookTicket };

module.exports = { bookTicket };

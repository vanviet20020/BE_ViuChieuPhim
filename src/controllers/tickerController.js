const mongoose = require('mongoose');

const User = require('../models/User');
const Ticket = require('../models/Ticket');
const MovieShowtime = require('../models/MovieShowtime');
const Transaction = require('../models/Transaction');
const { getDataExists } = require('../helpers/getDataExists');

const bookTicket = async (req, res, next) => {
    try {
        const { idMovieShowtime, numberTickets, user } = req.body;

        const vNumberTickets = parseInt(numberTickets);

        if (!vNumberTickets) {
            throw new Error('Số vé không hợp lệ');
        }

        const movieShowtime = await getDataExists(
            idMovieShowtime,
            'MovieShowtime',
        );

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { _id: idUser, coin } = user;
            const { ticket_price, seats } = movieShowtime;

            if (
                coin > ticket_price * vNumberTickets &&
                seats > vNumberTickets
            ) {
                // Tạo vé xem phim
                const ticket = await Ticket.create({
                    user: idUser,
                    movie_showtime: idMovieShowtime,
                });

                //Tính số ghế còn lại và update vào lịch chiếu
                const remainingSeats = seats - vNumberTickets;

                await MovieShowtime.findByIdAndUpdate(idMovieShowtime, {
                    seats: remainingSeats,
                });

                //Tính hóa đơn cho người dùng và lượng xu còn lại
                const payment = ticket_price * vNumberTickets;

                const new_coin = coin - payment;

                //Tạo lịch sử giao dịch của người dùng
                const queryTransaction = {
                    status: 'Mua vé',
                    payment,
                    old_coin: coin,
                    new_coin,
                    user: idUser,
                    message: `Mua ${numberTickets} vé`,
                };

                const transaction = await Transaction.create(queryTransaction);

                // Cập nhật thông tin cho người dùng
                await User.updateOne(
                    { _id: idUser },
                    {
                        coin: new_coin,
                        $push: {
                            tickets: ticket._id,
                            transactions: transaction._id,
                        },
                    },
                ).exec();
                return { message: 'Đặt vé thành công' };
            } else {
                throw new Error('Số xu hoặc số ghế còn lại không đủ');
            }
        } catch (err) {
            await session.abortTransaction();
            throw err;
        } finally {
            session.endSession();
        }
    } catch (error) {
        return res.status(400).json(error);
    }
};

module.exports = { bookTicket };

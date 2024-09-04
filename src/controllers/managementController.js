const User = require('../models/User');
const Ticket = require('../models/Ticket');
const Transaction = require('../models/Transaction');
const management = async (req, res, next) => {
    try {
        const queryOneMonth = {
            created_at: {
                $gte: new Date(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    1,
                ),
                $lte: new Date(
                    new Date().getFullYear(),
                    new Date().getMonth() + 1,
                    0,
                ),
            },
        };

        const user = await User.aggregate([
            {
                $match: {
                    $and: [{ ...queryOneMonth }, { is_deleted: { $ne: true } }],
                },
            },
            {
                $count: 'total',
            },
        ]).then((res) => (res[0] ? res[0].total : 0));

        const ticket = await Ticket.aggregate([
            {
                $match: { ...queryOneMonth },
            },
            {
                $count: 'total',
            },
        ]).then((res) => (res[0] ? res[0].total : 0));

        const sumCoin = await Transaction.aggregate([
            {
                $match: { ...queryOneMonth },
            },
            { $group: { _id: null, totalCoin: { $sum: '$payment' } } },
        ]).then((res) => (res[0] ? res[0].totalCoin : 0));

        const transactions = await Transaction.find({ $count: 'total' })
            .populate({
                path: 'user',
                match: { is_deleted: { $ne: true } },
                select: 'email -_id',
            })
            .lean();

        return res.status(200).json({ user, ticket, sumCoin, transactions });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

module.exports = { management };

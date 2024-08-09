const Movie = require('../models/Movie');

const home = async (req, res, next) => {
    try {
        const data = req.params.data;
        const page = parseInt(req.params.page) || 1;
        const limit = parseInt(req.params.limit) || 20;

        let query;

        if (data) {
            query = {
                $or: [
                    { name: { $regex: data } },
                    { director: { $regex: data } },
                    { cast: { $regex: data } },
                ],
            };
        } else {
            query = {};
        }

        const movies = await Movie.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        const count = await Movie.countDocuments(query);

        return res.status(200).json(movies, count, page, limit);
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

module.exports = { home };

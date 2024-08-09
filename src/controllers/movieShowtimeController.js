const createError = require('http-errors');

const Cinema = require('../models/Cinema');
const MovieShowtime = require('../models/MovieShowtime');
const { checkDataExists, getDataExists } = require('../helpers/getDataExists');

const getTicketPrice = async (id) => {
    const cinemaExists = await Cinema.findOne({
        _id: id,
        is_deleted: { $ne: true },
    })
        .populate({
            path: 'supplier',
            match: { is_deleted: { $ne: true } },
            select: 'ticket_price -_id',
        })
        .lean();

    if (!cinemaExists) {
        throw new createError.BadRequest('Lịch chiếu phim không tồn tại');
    }

    return cinemaExists.supplier.ticket_price;
};

const create = async (res, req, next) => {
    try {
        const { id_movie, id_cinema, date, start_time, seats } = req.body;

        await checkDataExists(id_movie, 'Movie');
        await checkDataExists(id_cinema, 'Cinema');

        const ticket_price = await getTicketPrice(id_cinema);

        const query = {
            movie: id_movie,
            cinema: id_cinema,
            date,
            start_time,
            seats,
            ticket_price,
        };

        const newMovieShowtime = await MovieShowtime.create(query);

        return res.status(200).json(newMovieShowtime);
    } catch (error) {
        return res.status(400).json(error);
    }
};

const getByIDMovie = async (req, res, next) => {
    try {
        const idMovie = req.params.id_movie;

        await checkDataExists(idMovie, 'Movie');

        const movieShowtimes = await MovieShowtime.find({
            movie: idMovie,
        })
            .populate({
                path: 'cinema',
                populate: {
                    path: 'supplier',
                },
            })
            .sort({ date: -1 })
            .lean();

        return res.status(200).json(movieShowtimes);
    } catch (error) {
        return res.status(400).json(error);
    }
};

const getByIDCinema = async (req, res, next) => {
    try {
        const idCinema = req.params.id_cinema;

        await checkDataExists(idCinema, 'Cinema');

        const movieShowtimes = await MovieShowtime.find({
            movie: idCinema,
        })
            .populate({
                path: 'movie',
            })
            .sort({ date: -1 })
            .lean();

        return res.status(200).json(movieShowtimes);
    } catch (error) {
        return res.status(400).json(error);
    }
};

const getByID = async (req, res, next) => {
    try {
        const id = req.params.id;

        const movieShowtime = await getDataExists(id, 'MovieShowtime');

        return res.status(200).json(movieShowtime);
    } catch (error) {
        return res.status(400).json(error);
    }
};

const update = async (req, res, next) => {
    try {
        const { id, id_movie, id_cinema, date, time, seats } = req.body;

        await checkDataExists(id, 'MovieShowtime');
        await checkDataExists(id_movie, 'Movie');
        await checkDataExists(id_cinema, 'Cinema');

        const query = { id_movie, id_cinema, date, time, seats };

        const movieShowtimeUpdate = await MovieShowtime.findByIdAndUpdate(
            id,
            query,
            { new: true },
        ).lean();

        return res.status(200).json(movieShowtimeUpdate);
    } catch (error) {
        return res.status(500).json(error);
    }
};

const remove = async (req, res, next) => {
    try {
        const id = req.body.id;

        await checkDataExists(id, 'MovieShowtime');

        await MovieShowtime.findByIdAndUpdate(
            id,
            { $set: { is_deleted: true } },
            { new: true },
        ).lean();

        return res.status(204).json({ message: 'Xoá lịch chiếu thành công' });
    } catch (error) {
        return res.status(500).json(error);
    }
};

module.exports = {
    create,
    getByIDMovie,
    getByIDCinema,
    getByID,
    update,
    remove,
};

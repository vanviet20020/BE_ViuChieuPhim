const createError = require('http-errors');

const Movie = require('../models/Movie');
const { checkDataExists, getDataExists } = require('../helpers/getDataExists');

const checkNameUnique = async (id, name) => {
    const query = { is_deleted: { $ne: true } };

    if (id && id.length) {
        Object.assign(query, { _id: { $ne: id } });
    }

    if (name && name.length) {
        Object.assign(query, { name });
    }

    const namelExists = await Movie.findOne(query).lean();

    if (namelExists) {
        throw new createError.BadRequest('Bộ phim đã tồn tại!');
    }

    return true;
};

const create = async (req, res, next) => {
    try {
        const {
            name,
            trailer_link,
            description,
            director,
            cast,
            release_date,
            runtime,
            language,
            genre,
        } = req.body;

        const file = req.file;

        await checkNameUnique(name);

        const query = {
            name,
            image: `img/uploads/movie/${file.filename}`,
            trailer_link,
            description,
            director,
            cast,
            release_date,
            runtime,
            language,
            genre,
        };

        const newMovie = await Movie.create(query);

        return res.status(201).json(newMovie);
    } catch (error) {
        return res.status(400).json(error);
    }
};

const search = async (req, res, next) => {
    try {
        const page = parseInt(req.params.page) || 1;
        const limit = parseInt(req.params.limit) || 20;
        const { searchData, status = 'Screening' } = req.params;

        const query = { status, is_deleted: { $ne: true } };
        const searchRgx = new RegExp(`.*${searchData}.*`, 'i');

        if (data) {
            Object.assign(query, {
                $or: [
                    { name: { $regex: searchRgx } },
                    { director: { $regex: searchRgx } },
                    { cast: { $regex: searchRgx } },
                ],
            });
        }

        const movies = await Movie.find(query)
            .sort({ updated_at: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        const count = await Cinema.countDocuments(query);

        return res.status(200).json({ movies, count, page, limit });
    } catch (error) {
        return res.status(400).json(error);
    }
};

const getByID = async (req, res, next) => {
    try {
        const id = req.params.id;

        const movie = await getDataExists(id, 'Movie');

        return res.status(200).json(movie);
    } catch (error) {
        return res.status(400).json(error);
    }
};

const update = async (req, res, next) => {
    try {
        const {
            id,
            name,
            trailer_link,
            description,
            director,
            cast,
            release_date,
            runtime,
            language,
            genre,
        } = req.body;

        const file = req.file;

        await checkDataExists(id, 'Movie');

        await checkNameUnique(id, name);

        const query = {
            name,
            image: `img/uploads/${file.filename}`,
            trailer_link,
            description,
            director,
            cast,
            release_date,
            runtime,
            language,
            genre,
        };

        const movieUpdate = await Movie.findByIdAndUpdate(id, query, {
            new: true,
        }).lean();

        return res.status(200).json(movieUpdate);
    } catch (error) {
        return res.status(500).json(error);
    }
};

const updateStatus = async (res, req, next) => {
    try {
        const { id_movie: idMovie, status } = req.body;

        await checkDataExists(idMovie, 'Movie');

        const movieUpdate = await Movie.findByIdAndUpdate(idMovie, {
            status,
        }).lean();

        return res.status(200).json(movieUpdate);
    } catch (error) {
        return res.status(500).json(error);
    }
};

const remove = async (req, res, next) => {
    try {
        const id = req.body.id;
        await checkDataExists(id, 'Movie');

        await Movie.findByIdAndUpdate(
            id,
            { $set: { is_deleted: true } },
            { new: true },
        ).lean();

        return res.status(204).json({ message: 'Xoá phim thành công' });
    } catch (error) {
        return res.status(500).json(error);
    }
};

module.exports = { create, search, getByID, update, updateStatus, remove };

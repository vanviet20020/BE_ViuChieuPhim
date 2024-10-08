const path = require('path');
const createError = require('http-errors');

const Movie = require('../models/Movie');
const { movieSchema } = require('../helpers/checkDataInput');
const { checkDataExists, getDataExists } = require('../helpers/dataExists');
const { checkDataUnique } = require('../helpers/checkDataUnique');
const { UPLOAD_FOLDER_MOVIE } = require('../helpers/constants');
const { deleteFile } = require('../helpers/deleteFile');

const validateInput = (data) => {
    const { error } = movieSchema.validate(data);

    if (error) {
        throw new createError.BadRequest(error.details[0].message);
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

        validateInput({ name, trailer_link, release_date, runtime });

        const file = req.file;
        if (!file) {
            throw new createError.BadRequest('Vui lòng tải hình ảnh lên');
        }

        await checkDataUnique({ name }, 'Movie');

        const query = {
            name,
            image: `/public/img/${UPLOAD_FOLDER_MOVIE}/${file.filename}`,
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
        if (req.file) {
            const filePath = path.join(
                __dirname,
                '..',
                'public',
                'img',
                UPLOAD_FOLDER_MOVIE,
                req.file.filename,
            );

            deleteFile(filePath);
        }

        return res.status(400).json(error);
    }
};

const search = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const { searchData, status } = req.query;

        const query = { is_deleted: { $ne: true } };

        if (status) {
            Object.assign(query, { status });
        }

        if (searchData) {
            const searchRgx = new RegExp(`.*${searchData}.*`, 'i');
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

        const count = await Movie.countDocuments(query);

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

        validateInput({ name, trailer_link, release_date, runtime });

        const oldMovie = await getDataExists(id, 'Movie');

        await checkDataUnique({ id, name }, 'Movie');

        const query = {
            name,
            trailer_link,
            description,
            director,
            cast,
            release_date,
            runtime,
            language,
            genre,
        };

        const file = req.file;
        if (file) {
            Object.assign(query, {
                image: `/public/img/${UPLOAD_FOLDER_MOVIE}${file.filename}`,
            });
        }

        const movieUpdate = await Movie.findByIdAndUpdate(id, query, {
            new: true,
        }).lean();

        if (file && movieUpdate) {
            const filePath = path.join(__dirname, '..', oldMovie.image);

            deleteFile(filePath);
        }

        return res.status(200).json(movieUpdate);
    } catch (error) {
        if (req.file) {
            const filePath = path.join(
                __dirname,
                '..',
                'public',
                'img',
                UPLOAD_FOLDER_MOVIE,
                req.file.filename,
            );

            deleteFile(filePath);
        }

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
        const id = req.body?.id;
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

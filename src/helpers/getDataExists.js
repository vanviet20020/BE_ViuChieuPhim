const { Types } = require('mongoose');
const createError = require('http-errors');

const User = require('../models/User');
const Supplier = require('../models/Supplier');
const Cinema = require('../models/Cinema');
const Movie = require('../models/Movie');
const MovieShowtime = require('../models/MovieShowtime');

const userExists = async (id) => {
    return await User.findOne({
        _id: id,
        is_deleted: { $ne: true },
    }).lean();
};

const supplierExists = async (id) => {
    return await Supplier.findOne({
        _id: id,
        is_deleted: { $ne: true },
    }).lean();
};

const cinemaExists = async (id) => {
    return await Cinema.findOne({
        _id: id,
        is_deleted: { $ne: true },
    }).lean();
};

const movieExists = async (id) => {
    return await Movie.findOne({
        _id: id,
        is_deleted: { $ne: true },
    }).lean();
};

const movieShowtimeExists = async (id) => {
    return await MovieShowtime.findOne({
        _id: id,
        is_deleted: { $ne: true },
    }).lean();
};

const getDataExistsStrategies = {
    User: userExists,
    Supplier: supplierExists,
    Cinema: cinemaExists,
    Moive: movieExists,
    MovieShowtime: movieShowtimeExists,
};

const dataExists = async (id, collec) => {
    if (!Types.ObjectId.isValid(`${id}`)) {
        throw new createError.BadRequest(`ID không hợp lệ`);
    }

    return await getDataExistsStrategies[collec](id);
};

exports.checkDataExists = async (id, collec) => {
    const data = await dataExists(id, collec);

    if (!data) {
        throw new createError.BadRequest(`Dữ liệu không tồn tại`);
    }

    return true;
};

exports.getDataExists = async (id, collec) => {
    const data = await dataExists(id, collec);

    if (!data) {
        throw new createError.BadRequest(`Dữ liệu không tồn tại`);
    }

    return data;
};

const { Types } = require('mongoose');
const createError = require('http-errors');

const User = require('../models/User');
const Supplier = require('../models/Supplier');
const Cinema = require('../models/Cinema');
const Movie = require('../models/Movie');
const MovieShowtime = require('../models/MovieShowtime');

const checkExists = async (Model, id) => {
    return await Model.findOne({
        _id: id,
        is_deleted: { $ne: true },
    }).lean();
};

const getDataExistsStrategies = {
    User: (id) => checkExists(User, id),
    Supplier: (id) => checkExists(Supplier, id),
    Cinema: (id) => checkExists(Cinema, id),
    Movie: (id) => checkExists(Movie, id),
    MovieShowtime: (id) => checkExists(MovieShowtime, id),
};

const dataExists = async (id, Model) => {
    if (!Types.ObjectId.isValid(`${id}`)) {
        throw new createError.BadRequest(`ID không hợp lệ`);
    }

    const strategy = getDataExistsStrategies[Model];

    if (!strategy) {
        throw new createError.BadRequest(`Model không hợp lệ`);
    }

    return await strategy(id);
};

const checkDataExists = async (id, Model) => {
    const data = await dataExists(id, Model);

    if (!data) {
        throw new createError.BadRequest(`Dữ liệu không tồn tại`);
    }

    return true;
};

const getDataExists = async (id, Model) => {
    const data = await dataExists(id, Model);

    if (!data) {
        throw new createError.BadRequest(`Dữ liệu không tồn tại`);
    }

    return data;
};

module.exports = { checkDataExists, getDataExists };

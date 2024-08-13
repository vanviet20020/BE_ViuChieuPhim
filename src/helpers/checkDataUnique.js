const createError = require('http-errors');

const User = require('../models/User');
const Supplier = require('../models/Supplier');
const Cinema = require('../models/Cinema');
const Movie = require('../models/Movie');

class UniqueCheckStrategy {
    async check(query, Model, errorMessage) {
        const exists = await Model.findOne(query).lean();

        if (exists) {
            throw new createError.BadRequest(errorMessage);
        }

        return true;
    }
}

class UserUniqueCheckStrategy extends UniqueCheckStrategy {
    async check({ id, email, phone_number }) {
        const query = {
            $or: [{ email: email }, { phone_number: phone_number }],
            is_deleted: { $ne: true },
        };

        if (id) {
            Object.assign(query, { _id: { $ne: id } });
        }

        return super.check(
            query,
            User,
            'Email hoặc số điện thoại đã được sử dụng. Hãy sử thử thông tin khác!',
        );
    }
}

class SupplierUniqueCheckStrategy extends UniqueCheckStrategy {
    async check({ id, name }) {
        const query = { name, is_deleted: { $ne: true } };

        if (id && id.length) {
            Object.assign(query, { _id: { $ne: id } });
        }

        return super.check(query, Supplier, 'Tên nhà cung cấp đã tồn tại!');
    }
}

class MovieUniqueCheckStrategy extends UniqueCheckStrategy {
    async check({ id, name }) {
        const query = { name, is_deleted: { $ne: true } };

        if (id && id.length) {
            Object.assign(query, { _id: { $ne: id } });
        }

        return super.check(query, Movie, 'Tên bộ phim đã tồn tại!');
    }
}

class CinemaUniqueCheckStrategy extends UniqueCheckStrategy {
    async check({ id, name }) {
        const query = { name, is_deleted: { $ne: true } };

        if (id && id.length) {
            Object.assign(query, { _id: { $ne: id } });
        }

        return super.check(query, Cinema, 'Tên rạp chiếu phim đã tồn tại!');
    }
}

const uniqueCheckStrategies = {
    User: new UserUniqueCheckStrategy(),
    Supplier: new SupplierUniqueCheckStrategy(),
    Movie: new MovieUniqueCheckStrategy(),
    Cinema: new CinemaUniqueCheckStrategy(),
};

const checkDataUnique = async (data, Model) => {
    const strategy = uniqueCheckStrategies[Model];

    if (!strategy) {
        throw new createError.BadRequest(`Model không hợp lệ`);
    }

    return strategy.check(data);
};

module.exports = { checkDataUnique };

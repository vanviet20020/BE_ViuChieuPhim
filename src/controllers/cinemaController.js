const createError = require('http-errors');

const Cinema = require('../models/Cinema');

const { cinemaSchema } = require('../helpers/checkDataInput');
const { checkDataExists } = require('../helpers/dataExists');
const { checkDataUnique } = require('../helpers/checkDataUnique');

const validateInput = (data) => {
    const { error } = cinemaSchema.validate(data);

    if (error) {
        throw new createError.BadRequest(error.details[0].message);
    }

    return true;
};

const handleQuery = (args) => {
    const { name, district, id_supplier } = args;

    const query = { is_deleted: { $ne: true } };

    if (name && name.length) {
        const nameRgx = new RegExp(`.*${name}.*`, 'i');
        Object.assign(query, { name: { $regex: nameRgx } });
    }

    if (district && district.length) {
        Object.assign(query, { district });
    }

    if (supplier && supplier.length) {
        Object.assign(query, { supplier: id_supplier });
    }

    return query;
};

const handleSearch = async (req) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const idSupplier = req.query.supplier;

    await checkDataExists(idSupplier, 'Supplier');

    const query = handleQuery(req.query);

    const cinemas = await Cinema.find(query)
        .sort({ updated_at: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

    const count = await Cinema.countDocuments(query);

    return { cinemas, count, page, limit };
};

const create = async (req, res, next) => {
    try {
        const { supplier, name, address, district, hotline, lat, lng } =
            req.body;

        validateInput({ name, address, district });

        await checkDataExists(supplier, 'Supplier');
        await checkDataUnique({ name }, 'Cinema');

        const location = {
            type: 'Point',
            coordinates: [lng, lat],
        };

        const query = {
            supplier: supplier,
            name,
            address,
            district,
            hotline,
            location,
        };

        const newCinema = await Cinema.create(query);

        return res.status(201).json(newCinema);
    } catch (error) {
        return res.status(400).json(error);
    }
};

const search = async (req, res, next) => {
    try {
        const { cinemas, count, page, limit } = await handleSearch(req);

        return res.status(200).json({ cinemas, count, page, limit });
    } catch (error) {
        return res.status(400).json(error);
    }
};

const geojson = async (req, res, next) => {
    try {
        const { cinemas, count, page, limit } = await handleSearch(req);

        const cinemasFeatures = cinemas.map((i) => {
            const properties_temp = {
                id: i._id,
                name: i.name,
                district: i.district,
                address: i.address,
                hotline: i.hotline,
            };

            return {
                type: 'Feature',
                properties: properties_temp,
                geometry: i.location,
            };
        });

        return res.status(200).json(cinemasFeatures, count, page, limit);
    } catch (error) {
        return res.status(400).json(error);
    }
};

const getByID = async (req, res, next) => {
    try {
        const id = req.params.id;

        const cinema = await Cinema.findOne({
            _id: id,
            is_deleted: { $ne: true },
        })
            .populate({
                path: 'supplier',
            })
            .lean();

        return res.status(200).json(cinema);
    } catch (error) {
        return res.status(400).json(error);
    }
};

const update = async (req, res, next) => {
    try {
        const {
            id_cinema,
            id_supplier,
            name,
            address,
            district,
            hotline,
            lat,
            lng,
        } = req.body;

        validateInput({ name, address, district });

        await checkDataExists(id_cinema, 'Cinema');

        await checkDataExists(id_supplier, 'Supplier');

        await checkDataUnique({ id_cinema, name }, 'Cinema');

        const location = {
            type: 'Point',
            coordinates: [lng, lat],
        };

        const query = {
            supplier: supplier,
            name,
            address,
            district,
            hotline,
            location,
        };

        const cinemaUpdate = await Cinema.findByIdAndUpdate(id_cinema, query, {
            new: true,
        }).lean();

        return res.status(200).json(cinemaUpdate);
    } catch (error) {
        return res.status(500).json(error);
    }
};

const remove = async (req, res, next) => {
    try {
        const id = req.body.id;

        await checkDataExists(id, 'Cinema');

        await Cinema.findByIdAndUpdate(
            id,
            { $set: { is_deleted: true } },
            { new: true },
        ).lean();

        return res.status(204).json({ message: 'Xoá rạp chiếu thành công' });
    } catch (error) {
        return res.status(500).json(error);
    }
};

module.exports = { create, search, geojson, getByID, update, remove };

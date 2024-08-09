const createError = require('http-errors');

const Supplier = require('../models/Supplier');
const { checkDataExists, getDataExists } = require('../helpers/getDataExists');

const checkNameUnique = async (id, name) => {
    const query = { is_deleted: { $ne: true } };

    if (id && id.length) {
        Object.assign(query, { _id: { $ne: id } });
    }

    if (name && name.length) {
        Object.assign(query, { name });
    }

    const namelExists = await Supplier.findOne(query).lean();

    if (namelExists) {
        throw new createError.BadRequest('Nhà cung cấp đã tồn tại!');
    }

    return true;
};

const create = async (req, res, next) => {
    try {
        const { name, ticket_price } = req.body;

        const file = req.file;

        await checkNameUnique(name);

        const query = {
            name,
            ticket_price,
            image_ticket_price: `img/uploads/ticket_price/${file.name}`,
        };

        const newSupplier = await Supplier.create(query);

        return res.status(201).json(newSupplier);
    } catch (error) {
        return res.status(400).json(error);
    }
};

const getAll = async (req, res, next) => {
    try {
        const suppliers = await Supplier.find().lean();
        return res.status(200).json(suppliers);
    } catch (error) {
        return res.status(400).json(error);
    }
};

const getByID = async (req, res, next) => {
    try {
        const id = req.params.id;

        const supplier = await getDataExists(id, 'Supplier');

        return res.status(200).json(supplier);
    } catch (error) {
        return res.status(400).json(error);
    }
};

const update = async (req, res, next) => {
    try {
        const { id, name, ticket_price } = req.body;

        const file = req.file;

        await checkDataExists(id, 'Supplier');

        await checkNameUnique(id, name);

        const query = {
            name,
            ticket_price,
            image_ticket_price: `img/uploads/ticket_price/${file.name}`,
        };

        const supplierUpdate = await Supplier.findByIdAndUpdate(id, query, {
            new: true,
        }).lean();
        return res.status(200).json(supplierUpdate);
    } catch (error) {
        return res.status(500).json(error);
    }
};

const remove = async (req, res, next) => {
    try {
        const id = req.body.id;

        await checkDataExists(id, 'Supplier');

        await Supplier.findByIdAndUpdate(
            id,
            { $set: { is_deleted: true } },
            { new: true },
        ).lean();

        return res.status(204).json({ message: 'Xoá phim thành công' });
    } catch (error) {
        return res.status(500).json(error);
    }
};

module.exports = { create, getAll, getByID, update, remove };

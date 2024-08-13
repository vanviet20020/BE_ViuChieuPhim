const createError = require('http-errors');

const Supplier = require('../models/Supplier');
const { supplierSchema } = require('../helpers/checkDataInput');
const { checkDataExists, getDataExists } = require('../helpers/dataExists');
const { checkDataUnique } = require('../helpers/checkDataUnique');

const validateInput = (data) => {
    const { error } = supplierSchema.validate(data);

    if (error) {
        throw new createError.BadRequest(error.details[0].message);
    }

    return true;
};

const create = async (req, res, next) => {
    try {
        const { name, ticket_price } = req.body;

        validateInput({ name, ticket_price });

        const file = req.file;

        await checkDataUnique({ name }, 'Supplier');

        const query = {
            name,
            ticket_price,
            ticket_price_image: `img/uploads/ticket_price/${file.name}`,
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

        validateInput({ name, ticket_price });

        const file = req.file;

        await checkDataExists(id, 'Supplier');

        await checkDataUnique({ id, name }, 'Supplier');

        const query = {
            name,
            ticket_price,
            ticket_price_image: `img/uploads/ticket_price/${file.name}`,
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

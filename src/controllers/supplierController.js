const path = require('path');
const createError = require('http-errors');

const Supplier = require('../models/Supplier');
const { supplierSchema } = require('../helpers/checkDataInput');
const { checkDataExists, getDataExists } = require('../helpers/dataExists');
const { checkDataUnique } = require('../helpers/checkDataUnique');
const { UPLOAD_FOLDER_SUPPLIER } = require('../helpers/constants');
const { deleteFile } = require('../helpers/deleteFile');

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
        if (!file) {
            throw new createError.BadRequest('Vui lòng tải hình ảnh lên');
        }

        await checkDataUnique({ name }, 'Supplier');

        const query = {
            name,
            ticket_price,
            ticket_price_image: `/public/img/${UPLOAD_FOLDER_SUPPLIER}/${file.filename}`,
        };

        const newSupplier = await Supplier.create(query);

        return res.status(201).json(newSupplier);
    } catch (error) {
        if (req.file) {
            const filePath = path.join(
                __dirname,
                '..',
                'public',
                'img',
                UPLOAD_FOLDER_SUPPLIER,
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
        const name = req.query?.name;

        const query = { is_deleted: { $ne: true } };

        if (name) {
            const nameRgx = new RegExp(`.*${name}.*`, 'i');
            Object.assign(query, { name: { $regex: nameRgx } });
        }

        const suppliers = await Supplier.find(query)
            .sort({ updated_at: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        const count = await Supplier.countDocuments(name);

        return res.status(200).json({ suppliers, count, page, limit });
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

        const oldSupplier = await getDataExists(id, 'Supplier');

        await checkDataUnique({ id, name }, 'Supplier');

        const query = {
            name,
            ticket_price,
        };

        const file = req.file;
        if (file) {
            Object.assign(query, {
                ticket_price_image: `/public/img/${UPLOAD_FOLDER_SUPPLIER}/${file.filename}`,
            });
        }

        const supplierUpdate = await Supplier.findByIdAndUpdate(id, query, {
            new: true,
        }).lean();

        if (file && supplierUpdate) {
            const filePath = path.join(
                __dirname,
                '..',
                oldSupplier.ticket_price_image,
            );

            deleteFile(filePath);
        }

        return res.status(200).json(supplierUpdate);
    } catch (error) {
        if (req.file) {
            const filePath = path.join(
                __dirname,
                '..',
                'public',
                'img',
                UPLOAD_FOLDER_SUPPLIER,
                req.file.filename,
            );

            deleteFile(filePath);
        }

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

module.exports = { create, search, getByID, update, remove };

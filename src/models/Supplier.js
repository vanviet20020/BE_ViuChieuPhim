const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { connection } = require('../configs/connectBD');

const SupplierSchema = new Schema(
    {
        name: { type: String, required: true },
        ticket_price: { type: Number, required: true },
        ticket_price_image: { type: String, required: true },
        is_deleted: { type: Boolean, default: false },
        cinemas: [
            {
                type: Schema.Types.ObjectId,
                ref: 'cinemas',
            },
        ],
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    },
);

const Supplier = connection.model('suppliers', SupplierSchema);

module.exports = Supplier;

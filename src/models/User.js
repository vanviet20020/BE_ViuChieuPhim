const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { connection } = require('../configs/connectBD');

const UserSchema = new Schema(
    {
        fullname: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        password: { type: String, minlength: 4, required: true },
        phone_number: {
            type: String,
            unique: true,
            minlength: 10,
            maxlength: 10,
        },
        coin: { type: Number, default: 0 },
        roles: {
            type: [String],
            enum: ['user', 'admin', 'super_admin'],
            default: ['user'],
        },
        is_deleted: { type: Boolean, default: false },
        tickets: [
            {
                type: Schema.Types.ObjectId,
                ref: 'tickets',
            },
        ],
        transactions: [
            {
                type: Schema.Types.ObjectId,
                ref: 'transactions',
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

const User = connection.model('users', UserSchema);

module.exports = User;

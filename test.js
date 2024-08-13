/* Hàm đếm thời gian thực thi hàm */
// function measureExecutionTime(fn) {
//     const startTime = performance.now();
//     fn();
//     const endTime = performance.now();
//     const executionTime = endTime - startTime;
//     console.log(`Execution time: ${executionTime} milliseconds`);
//     return executionTime;
// }

// function exampleFunction() {
//     //Todo
// }

// measureExecutionTime(exampleFunction);

// function test(id, ...rest) {
//     const [name] = rest;
//     console.log(id);
//     console.log(name);
//     console.log(arguments);
// }

// const id = 5,
//     name = 'việt';

// test(name);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CinemaSchema = new Schema(
    {
        name: { type: String, unique: true },
        address: { type: String, required: true },
        district: { type: String, required: true },
        hotline: String,
        location: { type: Schema.Types.Mixed, required: true },
        is_deleted: { type: Boolean, default: false },
        supplier: {
            type: Schema.Types.ObjectId,
            ref: 'suppliers',
            required: true,
            index: true,
        },
        movieshowtimes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'movieshowtimes',
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

const MovieSchema = new Schema(
    {
        name: { type: String, required: true },
        image: { type: String, required: true },
        trailer_link: { type: String, required: true },
        description: { type: String },
        director: { type: String },
        cast: { type: String },
        release_date: { type: Date, required: true },
        runtime: { type: String, required: true },
        language: { type: String },
        genre: { type: String },
        // recommend: { type: String },
        status: {
            type: String,
            enum: ['Expired', 'Screening', 'Coming soon'],
            default: 'Screening',
        },
        is_deleted: { type: Boolean, default: false },
        movieshowtimes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'movieshowtimes',
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

const MovieShowtimeSchema = new Schema(
    {
        date: { type: Date, required: true },
        start_time: { type: String, required: true },
        seats: { type: Number, required: true },
        ticket_price: { type: Number, required: true },
        movie: {
            type: Schema.Types.ObjectId,
            ref: 'movies',
            required: true,
            index: true,
        },
        cinema: {
            type: Schema.Types.ObjectId,
            ref: 'cinemas',
            required: true,
            index: true,
        },
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    },
);

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

const TicketSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
            index: true,
        },
        movie_showtime: {
            type: Schema.Types.ObjectId,
            ref: 'movieshowtime',
            required: true,
            index: true,
        },
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    },
);

const TransactionSchema = new Schema(
    {
        status: { type: String, enmum: ['Nạp tiền', 'Mua vé'], require: true },
        payment: { type: Number, require: true },
        old_coin: { type: Number, require: true },
        new_coin: { type: Number, require: true },
        message: { type: String },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            require: true,
            index: true,
        },
    },
    {
        timestamps: {
            createdAt: 'created_at',
        },
    },
);

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

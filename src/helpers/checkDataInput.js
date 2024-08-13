const Joi = require('joi');

const userSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Email không hợp lệ',
        'string.empty': 'Email không được để trống',
        'any.required': 'Email là bắt buộc',
    }),
    password: Joi.string().min(4).required().messages({
        'string.min': 'Mật khẩu phải có ít nhất {#limit} ký tự',
        'string.empty': 'Mật khẩu không được để trống',
        'any.required': 'Mật khẩu là bắt buộc',
    }),
});

const extendedUserSchema = userSchema.append({
    fullname: Joi.string().required().messages({
        'string.base': 'Tên người dùng phải là một chuỗi',
        'string.empty': 'Tên người dùng không được để trống',
        'any.required': 'Tên người dùng là bắt buộc',
    }),
    phone_number: Joi.string().length(10).required().messages({
        'string.base': 'Số điện thoại phải là một chuỗi',
        'string.empty': 'Số điện thoại không được để trống',
        'string.length': 'Số điện thoại phải có đúng {#limit} ký tự',
        'any.required': 'Số điện thoại là bắt buộc',
    }),
});

const supplierSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.base': 'Tên nhà cung cấp phải là một chuỗi',
        'string.empty': 'Tên nhà cung cấp không được để trống',
        'any.required': 'Tên nhà cung cấp là bắt buộc',
    }),
    ticket_price: Joi.number().required().messages({
        'number.base': 'Giá vé nhà cung cấp phải là một số',
        'string.empty': 'Giá vé nhà cung cấp không được để trống',
        'any.required': 'Giá vé nhà cung cấp là bắt buộc',
    }),
});

const movieSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.base': 'Tên phim phải là một chuỗi',
        'string.empty': 'Tên phim không được để trống',
        'any.required': 'Tên phim là bắt buộc',
    }),
    trailer_link: Joi.string().required().messages({
        'string.base': 'Link trailer phải là một chuỗi',
        'string.empty': 'Link trailer không được để trống',
        'any.required': 'Link trailer là bắt buộc',
    }),
    release_date: Joi.date().required().messages({
        'date.base': 'Thời gian công chiếu phải là một ngày hợp lệ',
        'any.required': 'Thời gian công chiếu là bắt buộc',
    }),
    runtime: Joi.string().required().messages({
        'string.base': 'Thời gian phim phải là một chuỗi',
        'string.empty': 'Thời gian phim không được để trống',
        'any.required': 'Thời gian phim là bắt buộc',
    }),
});

const cinemaSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.base': 'Tên rạp chiếu phim phải là một chuỗi',
        'string.empty': 'Tên rạp chiếu phim không được để trống',
        'any.required': 'Tên rạp chiếu phim là bắt buộc',
    }),
    address: Joi.string().required().messages({
        'string.base': 'Địa chỉ rạp chiếu phim phải là một chuỗi',
        'string.empty': 'Địa chỉ rạp chiếu phim không được để trống',
        'any.required': 'Địa chỉ rạp chiếu phim là bắt buộc',
    }),
    district: Joi.string().required().messages({
        'string.base': 'Quận của rạp chiếu phim phải là một chuỗi',
        'string.empty': 'Quận của rạp chiếu phim không được để trống',
        'any.required': 'Quận của rạp chiếu phim là bắt buộc',
    }),
});

const movieShowtimeSchema = Joi.object({
    date: Joi.date().greater('now').required().messages({
        'date.base': 'Ngày chiếu phim phải là một ngày hợp lệ',
        'date.greater': 'Ngày chiếu phim phải lớn hơn ngày hiện tại',
        'any.required': 'Ngày chiếu phim là bắt buộc',
    }),
    start_time: Joi.string().required().messages({
        'string.base': 'Thời gian bắt đầu chiếu phim phải là một chuỗi',
        'string.empty': 'Thời gian bắt đầu chiếu phim không được để trống',
        'any.required': 'Thời gian bắt đầu chiếu phim là bắt buộc',
    }),
    seats: Joi.number().integer().required().messages({
        'number.base': 'Số ghế của phim phải là một số nguyên',
        'number.integer': 'Số ghế của phim phải là một số nguyên',
        'any.required': 'Số ghế của phim là bắt buộc',
    }),
});

module.exports = {
    userSchema,
    extendedUserSchema,
    supplierSchema,
    movieSchema,
    cinemaSchema,
    movieShowtimeSchema,
};

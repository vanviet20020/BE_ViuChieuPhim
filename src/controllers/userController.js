const createError = require('http-errors');
const bcrypt = require('bcrypt');

const User = require('../models/User');
const {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} = require('../helpers/JWT');

const { userSchema, extendedUserSchema } = require('../helpers/checkDataInput');
const { checkDataExists } = require('../helpers/dataExists');
const { checkDataUnique } = require('../helpers/checkDataUnique');
const client = require('../configs/connectRedis');

const salt = bcrypt.genSaltSync(10);

const validateInput = (data) => {
    const { error } = extendedUserSchema.validate(data);

    if (error) {
        throw new createError.BadRequest(error.details[0].message);
    }

    return true;
};

const validateInputSignIn = (data) => {
    const { error } = userSchema.validate(data);

    if (error) {
        throw new createError.BadRequest(error.details[0].message);
    }

    return true;
};

const checkPassword = async (user, password) => {
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw new createError.BadRequest('Mật khẩu không chính xác!');
    }
};

const handleQuery = (searchData) => {
    const query = { is_deleted: { $ne: true } };

    if (searchData && searchData.length) {
        const searchRgx = new RegExp(`.*${searchData}.*`, 'i');
        const queryRgx = {
            $or: [
                { fullname: { $regex: searchRgx } },
                { email: { $regex: searchRgx } },
                { phone_number: { $regex: searchRgx } },
            ],
        };
        Object.assign(query, queryRgx);
    }

    return query;
};

const signUp = async (req, res, next) => {
    try {
        const { fullname, email, password, phone_number } = req.body;

        validateInput({ email, password, fullname, phone_number });

        if (!phone_number || phone_number.length !== 10) {
            throw new createError.BadRequest('Số điện thoại phải là 10 số');
        }

        await checkDataUnique({ email, phone_number }, 'User');

        const hashPassword = bcrypt.hashSync(password, salt);

        const query = {
            fullname,
            email,
            password: hashPassword,
            phone_number,
        };

        const newUser = await User.create(query);

        return res.status(201).json(newUser);
    } catch (error) {
        return res.status(400).json(error);
    }
};

const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        validateInputSignIn({ email, password });

        const user = await User.findOne({
            email,
            is_deleted: { $ne: true },
        }).lean();

        if (!user) {
            throw new createError.BadRequest('Email không chính xác!');
        }

        await checkPassword(user, password);

        const userInfo = {
            id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phone_number,
            coin: user.coin,
            roles: user.roles,
        };

        const accessToken = await signAccessToken(userInfo);
        const refreshToken = await signRefreshToken(userInfo);

        if (accessToken && refreshToken) {
            return res.status(200).json({
                currentUser: userInfo,
                token: accessToken,
                refreshToken,
                message: 'Đăng nhập thành công',
            });
        } else {
            return res
                .status(400)
                .json({ message: 'Đăng nhập không thành công' });
        }
    } catch (error) {
        return res.status(400).json(error);
    }
};

const refreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.body.refreshToken;

        if (!refreshToken) {
            throw createError.BadRequest('Đăng nhập không thành công');
        }

        const decoded = await verifyRefreshToken(refreshToken);

        const userInfo = {
            id: decoded.id,
            fullname: decoded.fullname,
            email: decoded.email,
            phoneNumber: decoded.phone_number,
            coin: decoded.coin,
            roles: decoded.roles,
        };

        const accessToken = await signAccessToken(userInfo);
        const newRefreshToken = await signRefreshToken(userInfo);

        if (accessToken && refreshToken) {
            return res.status(200).json({
                currentUser: userInfo,
                token: accessToken,
                refreshToken: newRefreshToken,
                message: 'Đăng nhập thành công',
            });
        } else {
            return res
                .status(400)
                .json({ message: 'Đăng nhập không thành công' });
        }
    } catch (error) {
        return res.status(400).json(error);
    }
};

const signOff = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken)
            throw new createError.BadRequest('Không thể đăng xuất!');

        const { id } = await verifyRefreshToken(refreshToken);

        client.del(id.toString());

        return res.status(200).json({ message: 'Đăng xuất thành công' });
    } catch (error) {
        return res.status(401).json(error);
    }
};

const search = async (req, res, next) => {
    try {
        const page = parseInt(req.params.page) || 1;
        const limit = parseInt(req.params.limit) || 20;
        const searchData = req.params.searchData;

        const query = handleQuery(searchData);

        const users = await User.find(query)
            .sort({ updated_at: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        const count = await User.countDocuments(query);

        return res.status(200).json({ users, count, page, limit });
    } catch (error) {
        return res.status(400).json(error);
    }
};

const update = async (req, res, next) => {
    try {
        const { id, fullname, email, password, phone_number } = req.body;

        validateInput({ email, password, fullname, phone_number });

        await checkDataExists(id, 'User');

        if (!phone_number || phone_number.length !== 10) {
            throw new createError.BadRequest('Số điện thoại phải là 10 số');
        }

        await checkDataUnique({ id, email, phone_number }, 'User');

        const hashPassword = bcrypt.hashSync(password, salt);

        const query = {
            fullname,
            email,
            password: hashPassword,
            phone_number,
        };

        const userUpdate = await User.findByIdAndUpdate(id, query);

        return res.status(200).json(userUpdate);
    } catch (error) {
        return res.status(500).json(error);
    }
};

const remove = async (req, res, next) => {
    try {
        const id = req.body.id;
        await checkDataExists(id, 'User');

        await User.findByIdAndUpdate(
            id,
            { $set: { is_deleted: true } },
            { new: true },
        ).lean();

        return res.status(204).json({ message: 'Xoá nguời dùng thành công!' });
    } catch (error) {
        return res.status(500).json(error);
    }
};

module.exports = {
    signIn,
    signUp,
    refreshToken,
    signOff,
    search,
    update,
    remove,
};

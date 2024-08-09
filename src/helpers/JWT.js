const jwt = require('jsonwebtoken');
require('dotenv').config();

const client = require('../configs/connectRedis');

const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET;

const signAccessToken = async (data) => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            data,
            SECRET_KEY,
            {
                expiresIn: '15m',
            },
            (err, token) => {
                if (err) {
                    console.error('Error generating token:', err);
                    return reject(err);
                }

                resolve(token);
            },
        );
    });
};

const signRefreshToken = async (data) => {
    const userID = data.id.toString();

    return new Promise(async (resolve, reject) => {
        jwt.sign(
            data,
            REFRESH_SECRET_KEY,
            {
                expiresIn: '30d',
            },
            async (err, token) => {
                if (err) {
                    console.error('Error generating refresh token:', err);
                    return reject(err);
                }

                await client.set(userID, token, {
                    EX: 30 * 24 * 60 * 60,
                });

                resolve(token);
            },
        );
    });
};

const verifyAccessToken = async (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, SECRET_KEY, async (err, decoded) => {
            if (err) return reject(err);

            resolve(decoded);
        });
    });
};

const verifyRefreshToken = async (refreshToken) => {
    return new Promise((resolve, reject) => {
        jwt.verify(refreshToken, REFRESH_SECRET_KEY, async (err, decoded) => {
            if (err) return reject(err);

            const reply = await client.get(decoded.id.toString());

            if (reply === refreshToken) {
                return resolve(decoded);
            }

            reject('Unauthorized');
        });
    });
};

module.exports = {
    signAccessToken,
    signRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
};

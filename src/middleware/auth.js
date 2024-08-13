require('dotenv').config();

const { verifyAccessToken } = require('../helpers/JWT');

const setUserInRequest = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            req.user = null;
            return next();
        }

        const decoded = await verifyAccessToken(token);
        req.user = decoded || null;
    } catch (error) {
        req.user = null;
        console.error('Token verification error:', error);
    }
    next();
};

const requireRole = (roles = ['user']) => {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(' ')[1];
            if (!token) {
                return res.status(401).send('Không có quyền truy cập');
            }

            const decoded = await verifyAccessToken(token);
            if (!decoded) {
                return res.status(401).send('Không có quyền truy cập');
            }

            const { roles: rolesUser } = decoded;
            const hasValidRole = roles.some((role) => rolesUser.includes(role));

            if (!hasValidRole) {
                return res.status(403).send('Bạn không có quyền truy cập!');
            }

            next();
        } catch (err) {
            res.status(401).send('Không có quyền truy cập');
        }
    };
};

module.exports = { setUserInRequest, requireRole };

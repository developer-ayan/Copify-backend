const jwt = require('jsonwebtoken');
require('dotenv').config();
const AdminUsers = require("../models/admin/admin-users");
const { secret_key } = require('../../utils/static-values');
const Users = require('../models/app/user');

async function authAdminMiddleware(req, res, next) {
    const authHeader = req.headers['authorization']; // Use 'authorization' header directly
    const token = authHeader && authHeader.replace('Bearer ', '');

    if (!token) {
        return res.status(200).json({
            status: false,
            message: 'Access denied. No token provided.',
        });
    }

    try {
        const decoded = jwt.verify(token, secret_key);
        Users.findOne({ user_id: decoded.user_id, token: token })
            .then(user => {
                if (!user) {
                    return res.status(200).json({
                        status: false,
                        message: 'Invalid token.',
                    });
                }

                req.user = user; // Attach the user to the request object
                req.token = token; // Attach the token to the request object
                next(); // Proceed to the next middleware or route handler
            })
            .catch(err => {
                res.status(200).json({
                    status: false,
                    message: 'Internal server error.',
                });
            });
    } catch (error) {
        res.status(200).json({
            status: false,
            message: 'Invalid token.',
        });
    }
}

async function authAppMiddleware(req, res, next) {
    const authHeader = req.headers['authorization']; // Use 'authorization' header directly
    const token = authHeader && authHeader.replace('Bearer ', '');

    if (!token) {
        return res.status(200).json({
            status: false,
            message: 'Access denied. No token provided.',
        });
    }

    try {
        const decoded = jwt.verify(token, secret_key);
        Users.findOne({ user_id: decoded.user_id, token: token })
            .then(user => {
                if (!user) {
                    return res.status(200).json({
                        status: false,
                        message: 'Invalid token.',
                    });
                }

                req.user = user; // Attach the user to the request object
                req.token = token; // Attach the token to the request object
                next(); // Proceed to the next middleware or route handler
            })
            .catch(err => {
                res.status(200).json({
                    status: false,
                    message: 'Internal server error.',
                });
            });
    } catch (error) {
        res.status(200).json({
            status: false,
            message: 'Invalid token.',
        });
    }
}

module.exports = {
    authAdminMiddleware,
    authAppMiddleware
};

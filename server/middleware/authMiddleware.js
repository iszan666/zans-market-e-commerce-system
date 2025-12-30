const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const supabase = require('../config/supabaseClient');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const { data: user, error } = await supabase
                .from('profiles')
                .select('id, email, role')
                .eq('id', decoded.id)
                .single();

            if (error || !user) {
                throw new Error('User not found');
            }

            // Normalize for compatibility
            req.user = {
                ...user,
                _id: user.id,
                isAdmin: user.role === 'admin'
            };

            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
};

module.exports = { protect, admin };

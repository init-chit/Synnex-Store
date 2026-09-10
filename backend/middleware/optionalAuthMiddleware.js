const jwt = require('jsonwebtoken');
require('dotenv').config();

// Optional auth - ไม่บังคับให้ login แต่ถ้ามี token จะ parse
module.exports = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
        try {
            const verified = jwt.verify(token, process.env.JWT_SECRET);
            req.user = verified;
        } catch (err) {
            // Token ไม่ valid แต่ไม่ error เพราะเป็น optional
            req.user = null;
        }
    } else {
        req.user = null;
    }
    
    next();
};





const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    // 1. ดึง Token จาก Header (Authorization: Bearer <token>)
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Access Denied (No Token)' });
    }

    try {
        // 2. ตรวจสอบ Token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // แปะข้อมูล user (id, role) ไว้ใน req
        next(); // ปล่อยผ่านไปทำขั้นตอนถัดไป
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};
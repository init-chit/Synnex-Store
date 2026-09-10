module.exports = (req, res, next) => {
    // req.user มาจาก authMiddleware ที่ทำงานก่อนหน้านี้
    if (req.user && req.user.role === 'admin') {
        next(); // เป็นแอดมินจริง เชิญผ่านได้
    } else {
        res.status(403).json({ message: 'Access Denied: Admin only!' }); // ไม่ใช่แอดมิน ห้ามเข้า!
    }
};
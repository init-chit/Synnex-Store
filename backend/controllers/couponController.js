const db = require('../db');

// เช็คว่าคูปองใช้ได้ไหม
exports.checkCoupon = async (req, res) => {
    const { code } = req.body;

    try {
        const result = await db.query('SELECT * FROM coupons WHERE code = $1', [code]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'ไม่พบโค้ดส่วนลดนี้' });
        }

        const coupon = result.rows[0];

        if (coupon.used_count >= coupon.usage_limit) {
            return res.status(400).json({ message: 'โค้ดนี้สิทธิ์เต็มแล้ว' });
        }

        res.json({
            message: 'คูปองใช้ได้!',
            discount: coupon.discount_amount,
            code: coupon.code
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
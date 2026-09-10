const db = require('../db');

// ฟังก์ชันซื้อเกม (รองรับทั้งซื้อแบบสุ่ม และแบบเลือกไอดีเฉพาะ)
exports.buyGame = async (req, res) => {
    const { game_id, code_id, coupon_code } = req.body; 
    const user_id = req.user.user_id;

    try {
        await db.query('BEGIN');

        let gameCode;

        // 🔹 กรณีที่ 1: ซื้อไอดีเฉพาะชิ้น (มี code_id)
        if (code_id) {
            const codeCheck = await db.query(
                `SELECT * FROM game_codes WHERE code_id = $1 AND status = 'available' FOR UPDATE`,
                [code_id]
            );

            if (codeCheck.rows.length === 0) {
                await db.query('ROLLBACK');
                return res.status(400).json({ message: 'ไอดีนี้ถูกขายไปแล้วหรือไม่มีในระบบ' });
            }

            gameCode = codeCheck.rows[0];
        } 
        // 🔹 กรณีที่ 2: ซื้อแบบสุ่ม (ไม่มี code_id มีแค่ game_id)
        else if (game_id) {
            const codeCheck = await db.query(
                `SELECT * FROM game_codes 
                 WHERE game_id = $1 AND status = 'available' AND is_public = FALSE 
                 LIMIT 1 FOR UPDATE`,
                [game_id]
            );

            if (codeCheck.rows.length === 0) {
                await db.query('ROLLBACK');
                return res.status(400).json({ message: 'สินค้าหมด (Out of Stock)' });
            }

            gameCode = codeCheck.rows[0];
        } else {
            await db.query('ROLLBACK');
            return res.status(400).json({ message: 'กรุณาระบุ game_id หรือ code_id' });
        }

        // คำนวณราคา & เช็คคูปอง
        let finalPrice = parseFloat(gameCode.price);
        let discount = 0;

        if (coupon_code) {
            const couponRes = await db.query('SELECT * FROM coupons WHERE code = $1', [coupon_code]);
            if (couponRes.rows.length > 0) {
                const coupon = couponRes.rows[0];
                if (coupon.used_count < coupon.usage_limit) {
                    discount = parseFloat(coupon.discount_amount);
                    finalPrice = finalPrice - discount;
                    if (finalPrice < 0) finalPrice = 0;

                    await db.query('UPDATE coupons SET used_count = used_count + 1 WHERE coupon_id = $1', [coupon.coupon_id]);
                }
            }
        }

        // เช็คเงินในกระเป๋า
        const userRes = await db.query('SELECT wallet_balance FROM users WHERE user_id = $1', [user_id]);
        const balance = parseFloat(userRes.rows[0].wallet_balance);

        if (balance < finalPrice) {
            await db.query('ROLLBACK');
            return res.status(400).json({ message: 'ยอดเงินไม่พอ กรุณาเติมเงิน' });
        }

        // หักเงินลูกค้า
        await db.query('UPDATE users SET wallet_balance = wallet_balance - $1 WHERE user_id = $2', [finalPrice, user_id]);
        
        // ตัดสต็อกสินค้า
        await db.query(`UPDATE game_codes SET status = 'sold' WHERE code_id = $1`, [gameCode.code_id]);

        // บันทึกประวัติ
        const note = discount > 0 ? ` (Discount ${discount}฿ from ${coupon_code})` : '';
        const newTransaction = await db.query(
            `INSERT INTO transactions (buyer_id, game_code_id, amount, status, details, game_id)
             VALUES ($1, $2, $3, 'completed', $4, $5)
             RETURNING *`,
            [user_id, gameCode.code_id, finalPrice, `Game Code: ${gameCode.code}${note}`, gameCode.game_id] 
        );

        await db.query('COMMIT');

        res.json({
            message: 'ซื้อสำเร็จ!',
            game_code: gameCode.code,
            price_paid: finalPrice,
            transaction: newTransaction.rows[0]
        });

    } catch (err) {
        await db.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ฟังก์ชันดึงประวัติของฉัน
exports.getMyHistory = async (req, res) => {
    const user_id = req.user.user_id;
    try {
        const result = await db.query(
            `SELECT 
                t.*,
                g.name as game_name,
                g.image_url as game_image,
                g.platform,
                g.original_price,
                gc.code as game_code
             FROM transactions t
             LEFT JOIN games g ON t.game_id = g.game_id
             LEFT JOIN game_codes gc ON t.game_code_id = gc.code_id
             WHERE t.buyer_id = $1 
             ORDER BY t.transaction_date DESC`, 
            [user_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
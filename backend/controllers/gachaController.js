const db = require('../db');

exports.getAllBoxes = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM mystery_boxes ORDER BY box_id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.spinBox = async (req, res) => {
    const { box_id } = req.body;
    const user_id = req.user.user_id;

    try {
        await db.query('BEGIN');

        // 1. ดึงข้อมูลกล่อง
        const boxRes = await db.query('SELECT * FROM mystery_boxes WHERE box_id = $1', [box_id]);
        if (boxRes.rows.length === 0) {
            await db.query('ROLLBACK');
            return res.status(404).json({ message: 'ไม่พบกล่องสุ่มนี้' });
        }
        const box = boxRes.rows[0];

        // 2. เช็คเงิน
        const userRes = await db.query('SELECT wallet_balance FROM users WHERE user_id = $1', [user_id]);
        const balance = parseFloat(userRes.rows[0].wallet_balance);

        if (balance < parseFloat(box.price)) {
            await db.query('ROLLBACK');
            return res.status(400).json({ message: 'ยอดเงินไม่พอ' });
        }

        // 3. หักเงิน
        await db.query('UPDATE users SET wallet_balance = wallet_balance - $1 WHERE user_id = $2', [box.price, user_id]);

        // 4. สุ่มของ
        const itemsRes = await db.query('SELECT * FROM box_items WHERE box_id = $1', [box_id]);
        const items = itemsRes.rows;
        
        // (กันเหนียว: ถ้ากล่องไม่มีของ ให้ Error ไปเลย)
        if (items.length === 0) throw new Error("Box has no items!");

        const randomNum = Math.random() * 100;
        let cumulativeWeight = 0;
        let selectedItem = null;

        for (const item of items) {
            cumulativeWeight += parseFloat(item.drop_rate);
            if (randomNum <= cumulativeWeight) {
                selectedItem = item;
                break;
            }
        }
        if (!selectedItem) selectedItem = items[items.length - 1];

        // 5. บันทึกประวัติ (Transactions)
        // ** จุดสำคัญ: ใส่ game_id เป็น NULL และใส่ details **
        await db.query(
            `INSERT INTO transactions (buyer_id, amount, status, game_id, details) 
             VALUES ($1, $2, 'completed', NULL, $3)`,
            [user_id, box.price, `Gacha Reward: ${selectedItem.name} (${selectedItem.prize_data || '-'})`]
        );

        await db.query('COMMIT');
        
        console.log(`User ${user_id} spun box ${box_id} -> Got ${selectedItem.name}`); // Log ดูผล

        res.json({
            message: 'สุ่มสำเร็จ!',
            prize: selectedItem,
            remaining_balance: balance - parseFloat(box.price)
        });

    } catch (err) {
        await db.query('ROLLBACK');
        console.error("Gacha Error:", err.message); // ดู Error ในจอดำ
        res.status(500).json({ message: 'Gacha failed' });
    }
};
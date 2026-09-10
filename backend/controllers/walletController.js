const db = require('../db');

// 1. ดึงยอดเงินปัจจุบัน
exports.getMyWallet = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        
        // แก้บรรทัดนี้: เพิ่มคำว่า ", role" เข้าไปใน SQL
        const result = await db.query(
            'SELECT user_id, username, email, wallet_balance, last_daily_claim, role FROM users WHERE user_id = $1', 
            [user_id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// 2. เติมเงิน (Simulation)
exports.topUp = async (req, res) => {
    const { amount } = req.body;
    const user_id = req.user.user_id;

    if (!amount || amount <= 0) {
        return res.status(400).json({ message: 'ยอดเงินต้องมากกว่า 0' });
    }

    try {
        await db.query('BEGIN');

        await db.query(
            'UPDATE users SET wallet_balance = wallet_balance + $1 WHERE user_id = $2',
            [amount, user_id]
        );

        await db.query(
            'INSERT INTO topup_history (user_id, amount, status, method) VALUES ($1, $2, $3, $4)',
            [user_id, amount, 'completed', 'simulation']
        );

        await db.query('COMMIT');

        res.json({ message: `เติมเงิน ${amount} บาท สำเร็จ!` });

    } catch (err) {
        await db.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ message: 'Topup failed' });
    }
};

// 3. รับเงินฟรีประจำวัน (Daily Reward) <--- ฟังก์ชันนี้แหละที่หายไป
exports.dailyCheckIn = async (req, res) => {
    const user_id = req.user.user_id;
    const REWARD_AMOUNT = 5.00; // แจกฟรี 5 บาท

    try {
        // A. เช็คเวลาล่าสุด
        const userRes = await db.query('SELECT last_daily_claim FROM users WHERE user_id = $1', [user_id]);
        const lastClaim = userRes.rows[0].last_daily_claim;

        if (lastClaim) {
            const now = new Date();
            const last = new Date(lastClaim);
            const diffTime = Math.abs(now - last);
            const diffHours = diffTime / (1000 * 60 * 60); // แปลงเป็นชั่วโมงแบบทศนิยม

            if (diffHours < 24) {
                const waitHours = Math.ceil(24 - diffHours);
                return res.status(400).json({ message: `ใจเย็นวัยรุ่น! รออีก ${waitHours} ชั่วโมงนะ` });
            }
        }

        // B. แจกเงิน
        await db.query('BEGIN');
        
        // อัปเดตเงิน + เวลาล่าสุด (NOW())
        await db.query('UPDATE users SET wallet_balance = wallet_balance + $1, last_daily_claim = NOW() WHERE user_id = $2', [REWARD_AMOUNT, user_id]);
        
        await db.query(
            `INSERT INTO topup_history (user_id, amount, method, status) VALUES ($1, $2, 'daily_reward', 'completed')`,
            [user_id, REWARD_AMOUNT]
        );

        await db.query('COMMIT');

        res.json({ message: `ยินดีด้วย! คุณได้รับเงินฟรี ฿${REWARD_AMOUNT}` });

    } catch (err) {
        await db.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
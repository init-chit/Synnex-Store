const db = require('../db');

exports.getMyWallet = async (req, res) => {
    try {
        const result = await db.query(
            'SELECT user_id, username, email, wallet_balance, last_daily_claim, role FROM users WHERE user_id = $1',
            [req.user.user_id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.topUp = async (req, res) => {
    const amount = Number(req.body.amount);
    const { method, reference_id } = req.body;
    const user_id = req.user.user_id;

    if (!Number.isFinite(amount) || amount < 1000) {
        return res.status(400).json({ message: 'Minimum top-up amount is 1,000 MMK.' });
    }
    if (!method || !String(reference_id || '').trim()) {
        return res.status(400).json({ message: 'Payment method and payment reference are required.' });
    }

    try {
        const result = await db.query(
            `INSERT INTO topup_history (user_id, amount, method, status, reference_id)
             VALUES ($1, $2, $3, 'pending', $4) RETURNING topup_id, amount, method, status, reference_id, created_at`,
            [user_id, amount, String(method).trim(), String(reference_id).trim()]
        );
        res.status(201).json({ message: 'Top-up submitted for admin approval.', topup: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Top-up submission failed' });
    }
};

exports.dailyCheckIn = async (req, res) => {
    const user_id = req.user.user_id;
    const REWARD_AMOUNT = 5.00;
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        const userRes = await client.query('SELECT last_daily_claim FROM users WHERE user_id = $1 FOR UPDATE', [user_id]);
        if (!userRes.rows[0]) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'User not found' });
        }
        const lastClaim = userRes.rows[0].last_daily_claim;
        if (lastClaim) {
            const diffHours = (Date.now() - new Date(lastClaim).getTime()) / 3600000;
            if (diffHours < 24) {
                await client.query('ROLLBACK');
                return res.status(400).json({ message: `Daily reward is not available yet. Try again in ${Math.ceil(24 - diffHours)} hours.` });
            }
        }
        await client.query('UPDATE users SET wallet_balance = wallet_balance + $1, last_daily_claim = NOW() WHERE user_id = $2', [REWARD_AMOUNT, user_id]);
        await client.query(
            `INSERT INTO topup_history (user_id, amount, method, status) VALUES ($1, $2, 'daily_reward', 'completed')`,
            [user_id, REWARD_AMOUNT]
        );
        await client.query('COMMIT');
        res.json({ message: `Congratulations! You received ${REWARD_AMOUNT.toFixed(2)} MMK.` });
    } catch (err) {
        await client.query('ROLLBACK').catch(() => {});
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    } finally {
        client.release();
    }
};

const db = require('../db');

exports.listPending = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT t.topup_id, t.user_id, u.username, u.email, t.amount, t.method, t.reference_id, t.status, t.created_at
      FROM topup_history t
      JOIN users u ON u.user_id = t.user_id
      WHERE t.status = 'pending'
      ORDER BY t.created_at ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to load pending top-ups' });
  }
};

exports.review = async (req, res) => {
  const topupId = Number(req.params.id);
  const { action } = req.body;
  if (!Number.isInteger(topupId) || !['approve', 'reject'].includes(action)) {
    return res.status(400).json({ message: 'Invalid top-up review request' });
  }

  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query('SELECT * FROM topup_history WHERE topup_id = $1 FOR UPDATE', [topupId]);
    const topup = result.rows[0];
    if (!topup) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Top-up not found' });
    }
    if (topup.status !== 'pending') {
      await client.query('ROLLBACK');
      return res.status(409).json({ message: 'This top-up has already been reviewed' });
    }

    if (action === 'approve') {
      await client.query('UPDATE users SET wallet_balance = wallet_balance + $1 WHERE user_id = $2', [topup.amount, topup.user_id]);
      await client.query('UPDATE topup_history SET status = \'completed\' WHERE topup_id = $1', [topupId]);
    } else {
      await client.query('UPDATE topup_history SET status = \'rejected\' WHERE topup_id = $1', [topupId]);
    }

    await client.query('COMMIT');
    res.json({ message: action === 'approve' ? 'Top-up approved and wallet credited.' : 'Top-up rejected.' });
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    console.error(error);
    res.status(500).json({ message: 'Top-up review failed' });
  } finally {
    client.release();
  }
};

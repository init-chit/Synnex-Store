const db = require('../db');

exports.list = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM payment_methods ORDER BY sort_order ASC, payment_method_id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to load payment methods' });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, type, account_name, account_number, qr_image_url, instructions, is_active = true, sort_order = 0 } = req.body;
    if (!name || !type) return res.status(400).json({ message: 'Name and type are required' });
    const result = await db.query(
      `INSERT INTO payment_methods (name, type, account_name, account_number, qr_image_url, instructions, is_active, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [name, type, account_name || null, account_number || null, qr_image_url || null, instructions || null, is_active, sort_order]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create payment method' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, account_name, account_number, qr_image_url, instructions, is_active, sort_order } = req.body;
    const result = await db.query(
      `UPDATE payment_methods SET name=$1, type=$2, account_name=$3, account_number=$4,
       qr_image_url=$5, instructions=$6, is_active=$7, sort_order=$8, updated_at=CURRENT_TIMESTAMP
       WHERE payment_method_id=$9 RETURNING *`,
      [name, type, account_name || null, account_number || null, qr_image_url || null, instructions || null, is_active !== false, sort_order || 0, id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Payment method not found' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update payment method' });
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await db.query('DELETE FROM payment_methods WHERE payment_method_id=$1 RETURNING payment_method_id', [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ message: 'Payment method not found' });
    res.json({ message: 'Payment method deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete payment method' });
  }
};

const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Register a new user.
exports.register = async (req, res) => {
    const username = String(req.body.username || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    try {
        const userCheck = await db.query(
            'SELECT * FROM users WHERE username = $1 OR LOWER(email) = $2',
            [username, email]
        );
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await db.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id, username, email, role',
            [username, email, passwordHash]
        );

        res.status(201).json({
            message: 'User registered successfully!',
            user: newUser.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Log a user in.
exports.login = async (req, res) => {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    try {
        const result = await db.query('SELECT * FROM users WHERE LOWER(email) = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            {
                user_id: user.user_id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Login successful!',
            token,
            user: {
                id: user.user_id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Change the authenticated user's password.
exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user_id = req.user.user_id;

    try {
        const userRes = await db.query('SELECT password_hash FROM users WHERE user_id = $1', [user_id]);
        if (userRes.rows.length === 0) return res.status(404).json({ message: 'User not found' });

        const validPassword = await bcrypt.compare(oldPassword, userRes.rows[0].password_hash);
        if (!validPassword) return res.status(400).json({ message: 'Current password is incorrect' });

        const salt = await bcrypt.genSalt(10);
        const newHash = await bcrypt.hash(newPassword, salt);

        await db.query('UPDATE users SET password_hash = $1 WHERE user_id = $2', [newHash, user_id]);

        res.json({ message: 'Password changed successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

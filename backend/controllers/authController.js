const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Register a new user.
exports.register = async (req, res) => {
    const username = String(req.body.username || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email and password are required' });
    }
    if (username.length < 3) {
        return res.status(400).json({ message: 'Username must be at least 3 characters long' });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ message: 'Please enter a valid email address' });
    }
    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

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
        console.error('Registration failed:', err);
        if (err.code === '23505') {
            return res.status(400).json({ message: 'Username or email already exists' });
        }
        res.status(500).json({ message: 'Unable to create account. Please try again.' });
    }
};

// Log a user in.
exports.login = async (req, res) => {
    const identifier = String(req.body.email || req.body.username || '').trim();
    const normalizedIdentifier = identifier.toLowerCase();
    const password = String(req.body.password || '');

    try {
        const result = await db.query(
            'SELECT * FROM users WHERE LOWER(email) = $1 OR LOWER(username) = $1 LIMIT 1',
            [normalizedIdentifier]
        );

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

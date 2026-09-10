const db = require('../db');

// ดึง wishlist ของ user
const getWishlist = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const result = await db.query(`
            SELECT w.wishlist_id, w.created_at as added_at,
                   g.game_id, g.name, g.platform, g.description,
                   g.image_url, g.price, g.original_price,
                   COALESCE(AVG(r.rating), 0) as avg_rating,
                   COUNT(DISTINCT r.review_id) as review_count,
                   COUNT(DISTINCT gc.code_id) FILTER (WHERE gc.status = 'available') as stock_count
            FROM wishlists w
            JOIN games g ON w.game_id = g.game_id
            LEFT JOIN reviews r ON g.game_id = r.game_id
            LEFT JOIN game_codes gc ON g.game_id = gc.game_id
            WHERE w.user_id = $1
            GROUP BY w.wishlist_id, g.game_id
            ORDER BY w.created_at DESC
        `, [userId]);

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
};

// เพิ่มเกมเข้า wishlist
const addToWishlist = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { gameId } = req.params;

        // เช็คว่าเกมมีอยู่จริงหรือไม่
        const gameCheck = await db.query(
            'SELECT game_id FROM games WHERE game_id = $1',
            [gameId]
        );

        if (gameCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Game not found' });
        }

        // เพิ่มเข้า wishlist
        const result = await db.query(`
            INSERT INTO wishlists (user_id, game_id)
            VALUES ($1, $2)
            ON CONFLICT (user_id, game_id) DO NOTHING
            RETURNING *
        `, [userId, gameId]);

        if (result.rows.length === 0) {
            return res.status(200).json({ message: 'Game already in wishlist' });
        }

        res.status(201).json({
            message: 'Added to wishlist',
            wishlist_id: result.rows[0].wishlist_id
        });
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        res.status(500).json({ error: 'Failed to add to wishlist' });
    }
};

// ลบเกมออกจาก wishlist
const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { gameId } = req.params;

        const result = await db.query(
            'DELETE FROM wishlists WHERE user_id = $1 AND game_id = $2 RETURNING *',
            [userId, gameId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Game not in wishlist' });
        }

        res.json({ message: 'Removed from wishlist' });
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        res.status(500).json({ error: 'Failed to remove from wishlist' });
    }
};

// เช็คว่าเกมอยู่ใน wishlist หรือไม่
const checkWishlist = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { gameId } = req.params;

        const result = await db.query(
            'SELECT wishlist_id FROM wishlists WHERE user_id = $1 AND game_id = $2',
            [userId, gameId]
        );

        res.json({ inWishlist: result.rows.length > 0 });
    } catch (error) {
        console.error('Error checking wishlist:', error);
        res.status(500).json({ error: 'Failed to check wishlist' });
    }
};

// Toggle wishlist (เพิ่มหรือลบ)
const toggleWishlist = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const gameId = parseInt(req.params.gameId);

        if (isNaN(gameId)) {
            return res.status(400).json({ error: 'Invalid game ID' });
        }

        // เช็คว่าเกมมีอยู่จริงหรือไม่
        const gameCheck = await db.query(
            'SELECT game_id FROM games WHERE game_id = $1',
            [gameId]
        );

        if (gameCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Game not found' });
        }

        // เช็คว่าอยู่ใน wishlist หรือยัง
        const existing = await db.query(
            'SELECT wishlist_id FROM wishlists WHERE user_id = $1 AND game_id = $2',
            [userId, gameId]
        );

        if (existing.rows.length > 0) {
            // ลบออก
            await db.query(
                'DELETE FROM wishlists WHERE user_id = $1 AND game_id = $2',
                [userId, gameId]
            );
            res.json({ inWishlist: false, message: 'Removed from wishlist' });
        } else {
            // เพิ่มเข้า
            await db.query(
                'INSERT INTO wishlists (user_id, game_id) VALUES ($1, $2)',
                [userId, gameId]
            );
            res.json({ inWishlist: true, message: 'Added to wishlist' });
        }
    } catch (error) {
        console.error('Error toggling wishlist:', error);
        res.status(500).json({ error: 'Failed to update wishlist', details: error.message });
    }
};

// ดึง wishlist IDs (สำหรับ sync กับ localStorage)
const getWishlistIds = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const result = await db.query(
            'SELECT game_id FROM wishlists WHERE user_id = $1',
            [userId]
        );

        res.json(result.rows.map(row => row.game_id));
    } catch (error) {
        console.error('Error fetching wishlist IDs:', error);
        res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
};

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    checkWishlist,
    toggleWishlist,
    getWishlistIds
};

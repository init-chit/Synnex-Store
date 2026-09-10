const db = require('../db');

// ดึงรีวิวของเกม
const getGameReviews = async (req, res) => {
    try {
        const { gameId } = req.params;
        const { page = 1, limit = 10, sort = 'newest' } = req.query;
        const offset = (page - 1) * limit;

        let orderBy = 'r.created_at DESC';
        if (sort === 'oldest') orderBy = 'r.created_at ASC';
        if (sort === 'highest') orderBy = 'r.rating DESC';
        if (sort === 'lowest') orderBy = 'r.rating ASC';
        if (sort === 'helpful') orderBy = 'r.helpful_count DESC';

        // ดึงรีวิว
        const reviewsResult = await db.query(`
            SELECT r.*, u.username, u.avatar_url
            FROM reviews r
            JOIN users u ON r.user_id = u.user_id
            WHERE r.game_id = $1
            ORDER BY ${orderBy}
            LIMIT $2 OFFSET $3
        `, [gameId, limit, offset]);

        // นับจำนวนรีวิวทั้งหมด
        const countResult = await db.query(
            'SELECT COUNT(*) FROM reviews WHERE game_id = $1',
            [gameId]
        );

        // สถิติรีวิว
        const statsResult = await db.query(`
            SELECT
                COALESCE(AVG(rating), 0) as avg_rating,
                COUNT(*) as total_reviews,
                COUNT(*) FILTER (WHERE rating = 5) as five_star,
                COUNT(*) FILTER (WHERE rating = 4) as four_star,
                COUNT(*) FILTER (WHERE rating = 3) as three_star,
                COUNT(*) FILTER (WHERE rating = 2) as two_star,
                COUNT(*) FILTER (WHERE rating = 1) as one_star
            FROM reviews WHERE game_id = $1
        `, [gameId]);

        res.json({
            reviews: reviewsResult.rows,
            stats: statsResult.rows[0],
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(countResult.rows[0].count / limit),
                totalReviews: parseInt(countResult.rows[0].count)
            }
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
};

// เพิ่มรีวิว
const createReview = async (req, res) => {
    try {
        const { gameId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.user_id;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        // เช็คว่าเคยซื้อเกมนี้หรือยัง
        const purchaseCheck = await db.query(`
            SELECT t.transaction_id
            FROM transactions t
            JOIN game_codes gc ON t.game_code_id = gc.code_id
            WHERE t.buyer_id = $1 AND gc.game_id = $2
            LIMIT 1
        `, [userId, gameId]);

        const isVerifiedPurchase = purchaseCheck.rows.length > 0;

        // เช็คว่าเคยรีวิวเกมนี้แล้วหรือยัง
        const existingReview = await db.query(
            'SELECT review_id FROM reviews WHERE user_id = $1 AND game_id = $2',
            [userId, gameId]
        );

        if (existingReview.rows.length > 0) {
            return res.status(400).json({ error: 'You have already reviewed this game' });
        }

        const result = await db.query(`
            INSERT INTO reviews (user_id, game_id, rating, comment, is_verified_purchase)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `, [userId, gameId, rating, comment || '', isVerifiedPurchase]);

        // ดึงข้อมูล user ด้วย
        const reviewWithUser = await db.query(`
            SELECT r.*, u.username, u.avatar_url
            FROM reviews r
            JOIN users u ON r.user_id = u.user_id
            WHERE r.review_id = $1
        `, [result.rows[0].review_id]);

        res.status(201).json(reviewWithUser.rows[0]);
    } catch (error) {
        console.error('Error creating review:', error);
        if (error.code === '23505') {
            return res.status(400).json({ error: 'You have already reviewed this game' });
        }
        res.status(500).json({ error: 'Failed to create review' });
    }
};

// แก้ไขรีวิว
const updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.user_id;

        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        const result = await db.query(`
            UPDATE reviews
            SET rating = COALESCE($1, rating),
                comment = COALESCE($2, comment),
                updated_at = CURRENT_TIMESTAMP
            WHERE review_id = $3 AND user_id = $4
            RETURNING *
        `, [rating, comment, reviewId, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Review not found or unauthorized' });
        }

        // ดึงข้อมูล user ด้วย
        const reviewWithUser = await db.query(`
            SELECT r.*, u.username, u.avatar_url
            FROM reviews r
            JOIN users u ON r.user_id = u.user_id
            WHERE r.review_id = $1
        `, [result.rows[0].review_id]);

        res.json(reviewWithUser.rows[0]);
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ error: 'Failed to update review' });
    }
};

// ลบรีวิว
const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user.user_id;
        const userRole = req.user.role;

        let result;
        if (userRole === 'admin') {
            // Admin สามารถลบรีวิวใครก็ได้
            result = await db.query(
                'DELETE FROM reviews WHERE review_id = $1 RETURNING *',
                [reviewId]
            );
        } else {
            // User ลบได้แค่รีวิวของตัวเอง
            result = await db.query(
                'DELETE FROM reviews WHERE review_id = $1 AND user_id = $2 RETURNING *',
                [reviewId, userId]
            );
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Review not found or unauthorized' });
        }

        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ error: 'Failed to delete review' });
    }
};

// Mark review as helpful
const markHelpful = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const result = await db.query(`
            UPDATE reviews
            SET helpful_count = helpful_count + 1
            WHERE review_id = $1
            RETURNING helpful_count
        `, [reviewId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Review not found' });
        }

        res.json({ helpful_count: result.rows[0].helpful_count });
    } catch (error) {
        console.error('Error marking review helpful:', error);
        res.status(500).json({ error: 'Failed to update review' });
    }
};

// ดึงรีวิวของ user
const getUserReviews = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const result = await db.query(`
            SELECT r.*, g.name as game_name, g.image_url as game_image, g.platform
            FROM reviews r
            JOIN games g ON r.game_id = g.game_id
            WHERE r.user_id = $1
            ORDER BY r.created_at DESC
        `, [userId]);

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching user reviews:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
};

module.exports = {
    getGameReviews,
    createReview,
    updateReview,
    deleteReview,
    markHelpful,
    getUserReviews
};

const db = require('../db');

// แนะนำเกมตามหมวดหมู่ที่ผู้ใช้ซื้อบ่อย
exports.getRecommendations = async (req, res) => {
    try {
        const userId = req.user?.user_id;
        
        if (!userId) {
            // ถ้าไม่ได้ login ให้แนะนำเกมที่ขายดี
            const popularGames = await db.query(`
                SELECT g.*, COUNT(t.transaction_id) as purchase_count
                FROM games g
                LEFT JOIN transactions t ON g.game_id = t.game_id
                WHERE g.is_featured = TRUE
                GROUP BY g.game_id
                ORDER BY purchase_count DESC, g.created_at DESC
                LIMIT 10
            `);
            return res.json(popularGames.rows);
        }

        // หาหมวดหมู่ที่ผู้ใช้ซื้อบ่อย
        const userCategories = await db.query(`
            SELECT g.category_id, COUNT(*) as purchase_count
            FROM transactions t
            JOIN games g ON t.game_id = g.game_id
            WHERE t.buyer_id = $1
            GROUP BY g.category_id
            ORDER BY purchase_count DESC
            LIMIT 3
        `, [userId]);

        const categoryIds = userCategories.rows.map(c => c.category_id).filter(Boolean);

        if (categoryIds.length === 0) {
            // ถ้ายังไม่เคยซื้อ ให้แนะนำเกมที่ขายดี
            const popularGames = await db.query(`
                SELECT g.*, COUNT(t.transaction_id) as purchase_count
                FROM games g
                LEFT JOIN transactions t ON g.game_id = t.game_id
                WHERE g.is_featured = TRUE
                GROUP BY g.game_id
                ORDER BY purchase_count DESC, g.created_at DESC
                LIMIT 10
            `);
            return res.json(popularGames.rows);
        }

        // แนะนำเกมในหมวดหมู่ที่ซื้อบ่อย (ยกเว้นเกมที่ซื้อไปแล้ว)
        const purchasedGames = await db.query(`
            SELECT DISTINCT game_id FROM transactions WHERE buyer_id = $1
        `, [userId]);
        const purchasedGameIds = purchasedGames.rows.map(g => g.game_id);

        const recommendations = await db.query(`
            SELECT g.*, COUNT(t.transaction_id) as purchase_count
            FROM games g
            LEFT JOIN transactions t ON g.game_id = t.game_id
            WHERE g.category_id = ANY($1::int[])
            ${purchasedGameIds.length > 0 ? 'AND g.game_id != ALL($2::int[])' : ''}
            GROUP BY g.game_id
            ORDER BY purchase_count DESC, g.created_at DESC
            LIMIT 10
        `, [categoryIds, purchasedGameIds]);

        res.json(recommendations.rows);
    } catch (error) {
        console.error('Error getting recommendations:', error);
        res.status(500).json({ error: 'Failed to get recommendations' });
    }
};

// แนะนำเกมที่คล้ายกัน (ตามหมวดหมู่)
exports.getSimilarGames = async (req, res) => {
    try {
        const { gameId } = req.params;
        
        // หาหมวดหมู่ของเกมนี้
        const gameResult = await db.query('SELECT category_id FROM games WHERE game_id = $1', [gameId]);
        
        if (gameResult.rows.length === 0) {
            return res.json([]);
        }

        const categoryId = gameResult.rows[0].category_id;

        if (!categoryId) {
            return res.json([]);
        }

        // หาเกมในหมวดหมู่เดียวกัน (ยกเว้นเกมนี้)
        const similarGames = await db.query(`
            SELECT g.*, COUNT(t.transaction_id) as purchase_count
            FROM games g
            LEFT JOIN transactions t ON g.game_id = t.game_id
            WHERE g.category_id = $1 AND g.game_id != $2
            GROUP BY g.game_id
            ORDER BY purchase_count DESC, g.created_at DESC
            LIMIT 6
        `, [categoryId, gameId]);

        res.json(similarGames.rows);
    } catch (error) {
        console.error('Error getting similar games:', error);
        res.status(500).json({ error: 'Failed to get similar games' });
    }
};





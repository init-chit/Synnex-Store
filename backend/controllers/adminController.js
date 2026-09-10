const db = require('../db');

// Helper function to get base URL
const getBaseUrl = () => {
    // ใน production ใช้ environment variable
    if (process.env.BASE_URL) {
        return process.env.BASE_URL;
    }
    // ใน development ใช้ localhost
    return process.env.NODE_ENV === 'production' 
        ? 'https://game-key-marketplace.onrender.com' 
        : 'http://localhost:5000';
};

// ===== เพิ่มเกม =====
exports.addGame = async (req, res) => {
    const { name, platform, description, price } = req.body;
    const image_url = req.file ? `${getBaseUrl()}/uploads/${req.file.filename}` : '';

    if (!name || !price) {
        return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' });
    }

    try {
        const result = await db.query(
            `INSERT INTO games (name, platform, description, price, image_url) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING *`,
            [name, platform, description, price, image_url]
        );
        res.json({ message: 'เพิ่มเกมสำเร็จ!', game: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Helper function to ensure image URLs are full URLs
const ensureFullImageUrl = (image_url) => {
    if (!image_url) return '';
    if (image_url.startsWith('http://') || image_url.startsWith('https://')) {
        return image_url;
    }
    // If it's a relative path, prepend base URL
    if (image_url.startsWith('/uploads/')) {
        return `${getBaseUrl()}${image_url}`;
    }
    return `${getBaseUrl()}/uploads/${image_url}`;
};

// ===== ดึงเกมทั้งหมด (สำหรับ Admin) =====
exports.getAllGames = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM games ORDER BY game_id DESC');
        
        // Ensure all image URLs are full URLs
        const games = result.rows.map(game => ({
            ...game,
            image_url: ensureFullImageUrl(game.image_url)
        }));
        
        res.json(games);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ===== แก้ไขเกม =====
exports.updateGame = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, platform, description, price, existing_image } = req.body;
        
        // Validate required fields
        if (!name || !price) {
            return res.status(400).json({ message: 'กรุณากรอกชื่อเกมและราคา' });
        }

        // ถ้ามีไฟล์ใหม่ให้ใช้ไฟล์ใหม่ ถ้าไม่มีให้ใช้ existing_image
        let image_url;
        if (req.file) {
            image_url = `${getBaseUrl()}/uploads/${req.file.filename}`;
            console.log('New image uploaded:', req.file.filename);
        } else if (existing_image) {
            image_url = existing_image;
            console.log('Using existing image:', existing_image);
        } else {
            // ถ้าไม่มีทั้งสองอย่าง ให้ดึงจาก database
            const currentGame = await db.query('SELECT image_url FROM games WHERE game_id = $1', [id]);
            image_url = currentGame.rows[0]?.image_url || '';
            console.log('Using database image:', image_url);
        }

        const result = await db.query(
            `UPDATE games 
             SET name = $1, platform = $2, description = $3, price = $4, image_url = $5 
             WHERE game_id = $6 
             RETURNING *`,
            [name, platform, description, price, image_url, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'ไม่พบเกมนี้' });
        }

        // Return updated game with full image URL
        const updatedGame = result.rows[0];
        if (updatedGame.image_url && !updatedGame.image_url.startsWith('http')) {
            updatedGame.image_url = `${getBaseUrl()}${updatedGame.image_url}`;
        }
        res.json({ message: 'แก้ไขเกมสำเร็จ!', game: updatedGame });
    } catch (err) {
        console.error('Error updating game:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// ===== ลบเกม =====
exports.deleteGame = async (req, res) => {
    const { id } = req.params;

    try {
        // ลบสต็อกที่เกี่ยวข้องก่อน
        await db.query('DELETE FROM game_codes WHERE game_id = $1', [id]);
        
        // ลบเกม
        const result = await db.query('DELETE FROM games WHERE game_id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'ไม่พบเกมนี้' });
        }

        res.json({ message: 'ลบเกมสำเร็จ!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ===== เพิ่มสต็อก =====
exports.addStock = async (req, res) => {
    const { game_id, code, price, title, description, is_public } = req.body;
    const admin_id = req.user.user_id;
    const image_url = req.file ? `${getBaseUrl()}/uploads/${req.file.filename}` : '';

    try {
        const result = await db.query(
            `INSERT INTO game_codes (game_id, code, price, seller_id, title, description, image_url, is_public) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
             RETURNING *`,
            [
                game_id, 
                code, 
                price, 
                admin_id, 
                title || null, 
                description || null, 
                image_url || null,
                is_public || false
            ]
        );
        res.json({ message: 'เพิ่มสต็อกสำเร็จ!', stock: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ===== ดึงสต็อกทั้งหมด (สำหรับ Admin) =====
exports.getAllStocks = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT gc.*, g.name as game_name 
            FROM game_codes gc 
            LEFT JOIN games g ON gc.game_id = g.game_id 
            ORDER BY gc.code_id DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ===== แก้ไขสต็อก =====
exports.updateStock = async (req, res) => {
    const { id } = req.params;
    const { code, price, title, description, is_public, status } = req.body;
    const image_url = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : req.body.existing_image;

    try {
        const result = await db.query(
            `UPDATE game_codes 
             SET code = $1, price = $2, title = $3, description = $4, is_public = $5, status = $6, image_url = $7
             WHERE code_id = $8 
             RETURNING *`,
            [code, price, title, description, is_public, status, image_url, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'ไม่พบสต็อกนี้' });
        }

        res.json({ message: 'แก้ไขสต็อกสำเร็จ!', stock: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ===== ลบสต็อก =====
exports.deleteStock = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query('DELETE FROM game_codes WHERE code_id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'ไม่พบสต็อกนี้' });
        }

        res.json({ message: 'ลบสต็อกสำเร็จ!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ===== ดึงคูปองทั้งหมด (สำหรับ Admin) =====
exports.getAllCoupons = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM coupons ORDER BY coupon_id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ===== เพิ่มคูปอง =====
exports.addCoupon = async (req, res) => {
    const { code, discount_amount, usage_limit } = req.body;

    if (!code || !discount_amount || !usage_limit) {
        return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' });
    }

    try {
        // เช็คว่ามีโค้ดซ้ำหรือไม่
        const checkRes = await db.query('SELECT * FROM coupons WHERE code = $1', [code]);
        if (checkRes.rows.length > 0) {
            return res.status(400).json({ message: 'โค้ดคูปองนี้มีอยู่แล้ว' });
        }

        const result = await db.query(
            `INSERT INTO coupons (code, discount_amount, usage_limit, used_count) 
             VALUES ($1, $2, $3, 0) 
             RETURNING *`,
            [code, discount_amount, usage_limit]
        );
        res.json({ message: 'เพิ่มคูปองสำเร็จ!', coupon: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ===== แก้ไขคูปอง =====
exports.updateCoupon = async (req, res) => {
    const { id } = req.params;
    const { code, discount_amount, usage_limit } = req.body;

    try {
        // เช็คว่ามีโค้ดซ้ำหรือไม่ (ยกเว้นตัวที่กำลังแก้ไข)
        const checkRes = await db.query('SELECT * FROM coupons WHERE code = $1 AND coupon_id != $2', [code, id]);
        if (checkRes.rows.length > 0) {
            return res.status(400).json({ message: 'โค้ดคูปองนี้มีอยู่แล้ว' });
        }

        const result = await db.query(
            `UPDATE coupons 
             SET code = $1, discount_amount = $2, usage_limit = $3
             WHERE coupon_id = $4 
             RETURNING *`,
            [code, discount_amount, usage_limit, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'ไม่พบคูปองนี้' });
        }

        res.json({ message: 'แก้ไขคูปองสำเร็จ!', coupon: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ===== ลบคูปอง =====
exports.deleteCoupon = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query('DELETE FROM coupons WHERE coupon_id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'ไม่พบคูปองนี้' });
        }

        res.json({ message: 'ลบคูปองสำเร็จ!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ===== Dashboard Statistics =====
exports.getDashboardStats = async (req, res) => {
    try {
        // 1. ยอดขายรวม
        const totalSalesRes = await db.query(
            `SELECT COALESCE(SUM(amount), 0) as total_sales 
             FROM transactions 
             WHERE status = 'completed'`
        );
        const totalSales = parseFloat(totalSalesRes.rows[0].total_sales);

        // 2. จำนวนผู้ใช้ทั้งหมด
        const totalUsersRes = await db.query('SELECT COUNT(*) as count FROM users');
        const totalUsers = parseInt(totalUsersRes.rows[0].count);

        // 3. จำนวนเกมทั้งหมด
        const totalGamesRes = await db.query('SELECT COUNT(*) as count FROM games');
        const totalGames = parseInt(totalGamesRes.rows[0].count);

        // 4. จำนวนสต็อกทั้งหมด
        const totalStocksRes = await db.query('SELECT COUNT(*) as count FROM game_codes');
        const totalStocks = parseInt(totalStocksRes.rows[0].count);

        // 5. จำนวนสต็อกที่ขายได้
        const soldStocksRes = await db.query(
            `SELECT COUNT(*) as count FROM game_codes WHERE status = 'sold'`
        );
        const soldStocks = parseInt(soldStocksRes.rows[0].count);

        // 6. จำนวนสต็อกที่ยังขายได้
        const availableStocks = totalStocks - soldStocks;

        // 7. จำนวนคูปองทั้งหมด
        const totalCouponsRes = await db.query('SELECT COUNT(*) as count FROM coupons');
        const totalCoupons = parseInt(totalCouponsRes.rows[0].count);

        // 8. จำนวนคูปองที่ใช้แล้ว
        const usedCouponsRes = await db.query(
            `SELECT COUNT(*) as count FROM coupons WHERE used_count >= usage_limit`
        );
        const usedCoupons = parseInt(usedCouponsRes.rows[0].count);

        // 9. จำนวนการซื้อทั้งหมด
        const totalTransactionsRes = await db.query(
            `SELECT COUNT(*) as count FROM transactions WHERE status = 'completed'`
        );
        const totalTransactions = parseInt(totalTransactionsRes.rows[0].count);

        // 10. เกมที่ขายดีที่สุด (Top 5)
        const topGamesRes = await db.query(`
            SELECT g.game_id, g.name, g.platform, COUNT(t.transaction_id) as sales_count, 
                   COALESCE(SUM(t.amount), 0) as revenue
            FROM games g
            LEFT JOIN transactions t ON g.game_id = t.game_id AND t.status = 'completed'
            GROUP BY g.game_id, g.name, g.platform
            ORDER BY sales_count DESC, revenue DESC
            LIMIT 5
        `);

        // 11. รายได้รายวัน (7 วันล่าสุด)
        const dailyRevenueRes = await db.query(`
            SELECT 
                DATE(transaction_date) as date,
                COUNT(*) as transaction_count,
                COALESCE(SUM(amount), 0) as revenue
            FROM transactions
            WHERE status = 'completed' 
                AND transaction_date >= CURRENT_DATE - INTERVAL '7 days'
            GROUP BY DATE(transaction_date)
            ORDER BY date ASC
        `);

        res.json({
            overview: {
                totalSales,
                totalUsers,
                totalGames,
                totalStocks,
                soldStocks,
                availableStocks,
                totalCoupons,
                usedCoupons,
                totalTransactions
            },
            topGames: topGamesRes.rows,
            dailyRevenue: dailyRevenueRes.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ===== ดึง Gacha Boxes ทั้งหมด (สำหรับ Admin) =====
exports.getAllGachaBoxes = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM mystery_boxes ORDER BY box_id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ===== เพิ่ม Gacha Box =====
exports.addGachaBox = async (req, res) => {
    const { name, description, price } = req.body;
    const image_url = req.file ? `${getBaseUrl()}/uploads/${req.file.filename}` : null;

    if (!name || !price) {
        return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' });
    }

    try {
        const result = await db.query(
            `INSERT INTO mystery_boxes (name, description, price, image_url) 
             VALUES ($1, $2, $3, $4) 
             RETURNING *`,
            [name, description, price, image_url]
        );
        res.json({ message: 'เพิ่มกล่องสำเร็จ!', box: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ===== แก้ไข Gacha Box =====
exports.updateGachaBox = async (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;
    const image_url = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : req.body.existing_image;

    try {
        const result = await db.query(
            `UPDATE mystery_boxes 
             SET name = $1, description = $2, price = $3, image_url = $4
             WHERE box_id = $5 
             RETURNING *`,
            [name, description, price, image_url, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'ไม่พบกล่องนี้' });
        }

        res.json({ message: 'แก้ไขกล่องสำเร็จ!', box: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ===== ลบ Gacha Box =====
exports.deleteGachaBox = async (req, res) => {
    const { id } = req.params;

    try {
        // ลบของในกล่องก่อน
        await db.query('DELETE FROM box_items WHERE box_id = $1', [id]);
        
        // ลบกล่อง
        const result = await db.query('DELETE FROM mystery_boxes WHERE box_id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'ไม่พบกล่องนี้' });
        }

        res.json({ message: 'ลบกล่องสำเร็จ!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
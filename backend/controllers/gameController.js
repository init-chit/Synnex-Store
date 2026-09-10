const db = require('../db');

// Helper function to get base URL
const getBaseUrl = () => {
    if (process.env.BASE_URL) {
        return process.env.BASE_URL;
    }
    return process.env.NODE_ENV === 'production' 
        ? 'https://game-key-marketplace.onrender.com' 
        : 'http://localhost:5000';
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

// ดึงเกมทั้งหมด (หน้าแรก)
exports.getAllGames = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                g.*,
                c.name as category_name,
                c.name_th as category_name_th
            FROM games g
            LEFT JOIN categories c ON g.category_id = c.category_id
            ORDER BY g.game_id DESC
        `);
        
        // Ensure all image URLs are full URLs
        const games = result.rows.map(game => ({
            ...game,
            image_url: ensureFullImageUrl(game.image_url)
        }));
        
        console.log(`Fetched ${games.length} games from database`);
        res.json(games);
    } catch (err) {
        console.error('Error fetching games:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ดึงสต็อกรายเกม (รายการไอดีที่ขายแยก)
exports.getGameStock = async (req, res) => {
    const { id } = req.params; 
    try {
        const result = await db.query(
            `SELECT code_id, title, description, price, image_url 
             FROM game_codes 
             WHERE game_id = $1 AND status = 'available' AND is_public = TRUE`,
            [id]
        );
        
        // Ensure all image URLs are full URLs
        const stocks = result.rows.map(stock => ({
            ...stock,
            image_url: stock.image_url ? ensureFullImageUrl(stock.image_url) : ''
        }));
        
        res.json(stocks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
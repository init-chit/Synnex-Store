const db = require('../db');

// ดึงหมวดหมู่ทั้งหมด
const getAllCategories = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT c.*,
                   COUNT(g.game_id) as game_count
            FROM categories c
            LEFT JOIN games g ON c.category_id = g.category_id
            GROUP BY c.category_id
            ORDER BY c.name
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};

// ดึงหมวดหมู่ตาม ID พร้อมเกมในหมวด
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        // ดึงข้อมูลหมวดหมู่
        const categoryResult = await db.query(
            'SELECT * FROM categories WHERE category_id = $1',
            [id]
        );

        if (categoryResult.rows.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // ดึงเกมในหมวดหมู่นี้
        const gamesResult = await db.query(`
            SELECT g.*,
                   COALESCE(AVG(r.rating), 0) as avg_rating,
                   COUNT(DISTINCT r.review_id) as review_count,
                   COUNT(DISTINCT gc.code_id) FILTER (WHERE gc.status = 'available') as stock_count
            FROM games g
            LEFT JOIN reviews r ON g.game_id = r.game_id
            LEFT JOIN game_codes gc ON g.game_id = gc.game_id
            WHERE g.category_id = $1
            GROUP BY g.game_id
            ORDER BY g.name
        `, [id]);

        res.json({
            category: categoryResult.rows[0],
            games: gamesResult.rows
        });
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ error: 'Failed to fetch category' });
    }
};

// สร้างหมวดหมู่ใหม่ (Admin)
const createCategory = async (req, res) => {
    try {
        const { name, name_th, icon, color } = req.body;

        if (!name || !name_th) {
            return res.status(400).json({ error: 'Name and Thai name are required' });
        }

        const result = await db.query(
            `INSERT INTO categories (name, name_th, icon, color)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [name, name_th, icon || 'Gamepad2', color || '#6366F1']
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Failed to create category' });
    }
};

// อัพเดทหมวดหมู่ (Admin)
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, name_th, icon, color } = req.body;

        const result = await db.query(
            `UPDATE categories
             SET name = COALESCE($1, name),
                 name_th = COALESCE($2, name_th),
                 icon = COALESCE($3, icon),
                 color = COALESCE($4, color)
             WHERE category_id = $5
             RETURNING *`,
            [name, name_th, icon, color, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Failed to update category' });
    }
};

// ลบหมวดหมู่ (Admin)
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            'DELETE FROM categories WHERE category_id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Failed to delete category' });
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db'); 
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const walletRoutes = require('./routes/walletRoutes');
const gachaRoutes = require('./routes/gachaRoutes');
const transactionRoutes = require('./routes/transactionRoutes'); 
const couponRoutes = require('./routes/couponRoutes');
const adminRoutes = require('./routes/adminRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const path = require('path');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/gacha', gachaRoutes);
app.use('/api/transactions', transactionRoutes); 
app.use('/api/coupons', couponRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send('Hello! Backend is running...');
});

app.get('/test-db', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.json({ 
            message: 'Database Connected!', 
            time: result.rows[0].now 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database connection error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
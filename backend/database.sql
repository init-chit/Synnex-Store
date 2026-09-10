-- =============================================
-- Synnex Store - Database Schema
-- =============================================

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    name_th VARCHAR(50) NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    wallet_balance DECIMAL(10, 2) DEFAULT 0.00,
    last_daily_claim TIMESTAMP,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE games (
    game_id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(category_id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    description TEXT,
    image_url TEXT,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    original_price DECIMAL(10, 2),
    is_featured BOOLEAN DEFAULT FALSE,
    release_date DATE,
    developer VARCHAR(100),
    publisher VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE game_codes (
    code_id SERIAL PRIMARY KEY,
    game_id INT REFERENCES games(game_id) ON DELETE CASCADE,
    seller_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    code VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'available',
    is_public BOOLEAN DEFAULT TRUE,
    title VARCHAR(100),
    description TEXT,
    image_url TEXT,
    region VARCHAR(50) DEFAULT 'Global',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    buyer_id INT REFERENCES users(user_id),
    game_code_id INT REFERENCES game_codes(code_id),
    game_id INT REFERENCES games(game_id),
    amount DECIMAL(10, 2) NOT NULL,
    original_amount DECIMAL(10, 2),
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    coupon_code VARCHAR(50),
    status VARCHAR(20) DEFAULT 'completed',
    details TEXT,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE coupons (
    coupon_id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) DEFAULT 'fixed',
    discount_amount DECIMAL(10, 2) NOT NULL,
    min_purchase DECIMAL(10, 2) DEFAULT 0.00,
    max_discount DECIMAL(10, 2),
    usage_limit INT DEFAULT 100,
    used_count INT DEFAULT 0,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mystery_boxes (
    box_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_th VARCHAR(100),
    description TEXT,
    description_th TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    rarity VARCHAR(20) DEFAULT 'common',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE box_items (
    item_id SERIAL PRIMARY KEY,
    box_id INT REFERENCES mystery_boxes(box_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    item_type VARCHAR(50) DEFAULT 'game_code',
    prize_data TEXT,
    drop_rate DECIMAL(5, 2) NOT NULL,
    rarity VARCHAR(20) DEFAULT 'common',
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE topup_history (
    topup_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    method VARCHAR(50) DEFAULT 'simulation',
    status VARCHAR(20) DEFAULT 'completed',
    reference_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payment_methods (
    payment_method_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    account_name VARCHAR(150),
    account_number VARCHAR(150),
    qr_image_url TEXT,
    instructions TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    game_id INT REFERENCES games(game_id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, game_id)
);

CREATE TABLE wishlists (
    wishlist_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    game_id INT REFERENCES games(game_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, game_id)
);

CREATE INDEX idx_games_category ON games(category_id);
CREATE INDEX idx_games_platform ON games(platform);
CREATE INDEX idx_games_featured ON games(is_featured);
CREATE INDEX idx_game_codes_game ON game_codes(game_id);
CREATE INDEX idx_game_codes_status ON game_codes(status);
CREATE INDEX idx_transactions_buyer ON transactions(buyer_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_reviews_game ON reviews(game_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_wishlists_user ON wishlists(user_id);
CREATE INDEX idx_payment_methods_active ON payment_methods(is_active, sort_order);

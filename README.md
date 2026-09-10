# 🎮 Game Key Marketplace

A full-stack e-commerce platform for buying and selling game keys (CD-Keys) across multiple platforms including Steam, PlayStation, Xbox, Nintendo Switch, and Epic Games.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-production%20ready-success.svg)
![License](https://img.shields.io/badge/license-ISC-lightgrey.svg)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## ✨ Features

### 🛒 E-Commerce Marketplace
- **Multi-platform Support**: Steam, PlayStation, Xbox, Nintendo Switch, Epic Games
- **Game Management**: Add, edit, delete games with images and descriptions
- **Stock Management**: Manage game codes inventory
- **Category System**: 41+ game categories with filtering
- **Search & Filter**: Real-time search with advanced filtering options

### 💳 Wallet & Payment System
- **Digital Wallet**: In-app wallet system
- **Top-up System**: Add funds to wallet
- **Transaction History**: Complete purchase history
- **Coupon System**: Fixed and percentage discount coupons
- **Order Management**: Track all orders and purchases

### 🎁 Gacha/Mystery Box System
- **Random Rewards**: Mystery box system for random game rewards
- **Admin Control**: Manage mystery boxes and items
- **Probability System**: Configurable drop rates

### 👤 User Management
- **Authentication**: JWT-based authentication system
- **Role-based Access**: User, Seller, and Admin roles
- **User Profiles**: Manage user information
- **Wishlist**: Save favorite games
- **Recently Viewed**: Track recently viewed games
- **Game Reviews**: Rate and review games

### 📊 Admin Dashboard
- **Dashboard**: Statistics and analytics overview
- **Game Management**: Full CRUD operations for games
- **Stock Management**: Manage game codes inventory
- **Coupon Management**: Create and manage discount coupons
- **Gacha Management**: Configure mystery boxes
- **User Management**: View and manage users

### 🎨 User Experience
- **Responsive Design**: Mobile-first, works on all devices
- **Real-time Search**: Instant search results
- **Toast Notifications**: Modern notification system
- **Loading States**: Skeleton loading for better UX
- **Error Handling**: Comprehensive error boundaries
- **Game Comparison**: Compare multiple games side-by-side

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI Framework
- **React Router DOM v7** - Client-side Routing
- **Vite** - Build Tool & Dev Server
- **Tailwind CSS** - Utility-first CSS Framework
- **Axios** - HTTP Client
- **Lucide React** - Icon Library
- **ESLint** - Code Linting

### Backend
- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **PostgreSQL** - Relational Database
- **JWT** - Authentication
- **Multer** - File Upload Middleware
- **bcryptjs** - Password Hashing
- **dotenv** - Environment Variables
- **CORS** - Cross-Origin Resource Sharing

---

## 📁 Project Structure

```
game-key-marketplace/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── utils/           # Utility functions
│   │   └── config/          # Configuration files
│   └── package.json
│
├── backend/                  # Node.js backend application
│   ├── controllers/         # Business logic
│   ├── routes/              # API routes
│   ├── middleware/          # Custom middleware
│   ├── database.sql         # Database schema
│   ├── seed.sql            # Seed data
│   └── package.json
│
└── README.md
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Step 1: Clone the repository
```bash
git clone https://github.com/your-username/game-key-marketplace.git
cd game-key-marketplace
```

### Step 2: Install dependencies
```bash
# Install all dependencies (root, backend, frontend)
npm run install:all

# Or install separately
npm install
cd backend && npm install
cd ../frontend && npm install
```

### Step 3: Database Setup
1. Create a PostgreSQL database:
```sql
CREATE DATABASE game_key_marketplace;
```

2. Run the database schema:
```bash
psql -U postgres -d game_key_marketplace -f backend/database.sql
```

3. (Optional) Seed the database with sample data:
```bash
psql -U postgres -d game_key_marketplace -f backend/seed.sql
```

### Step 4: Environment Variables

#### Backend (.env)
Create `backend/.env`:
```env
# Database
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=game_key_marketplace
DB_PASSWORD=your_password
DB_PORT=5432

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# Base URL (for production)
BASE_URL=http://localhost:5000
```

#### Frontend (.env)
Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
```

---

## ⚙️ Configuration

### Development Mode
Run both frontend and backend concurrently:
```bash
npm run dev
```

Or run separately:
```bash
# Backend (Terminal 1)
cd backend
npm run dev

# Frontend (Terminal 2)
cd frontend
npm run dev
```

### Production Build
```bash
# Build frontend
cd frontend
npm run build

# Start backend
cd backend
npm start
```

---

## 📖 Usage

### Default Admin Account
After seeding the database:
- **Email**: `admin@nickykey.com`
- **Password**: `admin123`

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

#### Games
- `GET /api/games` - Get all games
- `GET /api/games/:id` - Get game by ID
- `GET /api/games/:id/stock` - Get game stock

#### Wallet
- `GET /api/wallet/me` - Get wallet balance
- `POST /api/wallet/topup` - Add funds
- `GET /api/wallet/history` - Get transaction history

#### Admin (Requires Admin Role)
- `POST /api/admin/games` - Create game
- `PUT /api/admin/games/:id` - Update game
- `DELETE /api/admin/games/:id` - Delete game
- `POST /api/admin/games/:id/stock` - Add game stock
- `POST /api/admin/coupons` - Create coupon
- `POST /api/admin/gacha` - Create mystery box

For complete API documentation, see [API Documentation](#-api-documentation)

---

## 📚 API Documentation

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

### Game Endpoints

#### Get All Games
```http
GET /api/games
```

#### Get Game by ID
```http
GET /api/games/:id
```

#### Get Game Stock
```http
GET /api/games/:id/stock
```

### Wallet Endpoints

#### Get Wallet Balance
```http
GET /api/wallet/me
Authorization: Bearer <token>
```

#### Top Up Wallet
```http
POST /api/wallet/topup
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 1000
}
```

---

## 🚢 Deployment

### Backend Deployment (Render/Railway)

1. **Set Environment Variables**:
   - `DATABASE_URL` - PostgreSQL connection string
   - `JWT_SECRET` - Secret key for JWT
   - `NODE_ENV=production`
   - `BASE_URL` - Your backend URL

2. **Build Command**: (Not needed for Node.js)
3. **Start Command**: `cd backend && npm start`

### Frontend Deployment (Vercel)

1. **Connect your GitHub repository**
2. **Set Environment Variables**:
   - `VITE_API_URL` - Your backend API URL

3. **Build Settings**:
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Database (Supabase/Neon)

1. Create a new PostgreSQL database
2. Run `database.sql` to create tables
3. (Optional) Run `seed.sql` for sample data
4. Use Connection Pooling URL for production

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**Nicky**

- GitHub: [@nicky-wrc](https://github.com/nicky-wrc)

---

## 🙏 Acknowledgments

- All game information and images are for demonstration purposes only
- Built with modern web technologies and best practices

---

## 📞 Support

For support, email nick.worachatz@gmail.com or open an issue in the repository.

---

**Made with ❤️ using React, Node.js, and PostgreSQL**

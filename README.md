# Synnex Store

Synnex Store is a full-stack digital game-key marketplace built with React, Node.js, Express and PostgreSQL. It supports games, inventory, wallet/top-up, coupons, reviews, wishlist, comparison, gacha and an admin dashboard.

## Initial administrator login

The development seed administrator is:

- **Username:** `admin`
- **Email:** `admin@synnex.store`
- **Password:** `admin123`

For production, do not use the seed password. Set `INITIAL_ADMIN_USERNAME`, `INITIAL_ADMIN_EMAIL`, and `INITIAL_ADMIN_PASSWORD` (at least 12 characters) in the server environment and run the idempotent bootstrap:

```bash
docker compose run --rm backend node scripts/ensureInitialAdmin.js
```

The login form accepts either the administrator email or username. The bootstrap promotes an existing matching user to administrator and synchronizes the configured credentials without committing secrets to Git.

## Production stack

- Frontend: React 19, React Router, Vite, Tailwind CSS, Axios, Lucide
- Backend: Node.js 22, Express 5, PostgreSQL, JWT, bcryptjs, Multer
- Production: Docker Compose + Nginx + PostgreSQL 16
- Frontend public port: `3000`
- Backend public port: `5000`

## Docker deployment

Copy `.env.example` to `.env`, replace all placeholder secrets, and start the stack with `docker compose up -d --build`. The frontend uses the configured `VITE_API_URL`, or the backend on port 5000 on the current hostname when that variable is omitted.

The frontend is English-language and uses the **SYNNEX** brand consistently. The registration page includes a **Back to Home** button, and the service banner reads **24/hr Services**.

## Development

```bash
cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev
```

Never commit database passwords, JWT secrets, payment credentials, or production administrator passwords.

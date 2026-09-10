# Synnex Store

Synnex Store is a full-stack digital game-key marketplace built with React, Node.js, Express and PostgreSQL. It supports games, inventory, wallet/top-up, coupons, reviews, wishlist, comparison, gacha and an admin dashboard.

## Initial administrator login

The administrator credentials are controlled by the server environment. Copy `.env.example` to `.env` and set `INITIAL_ADMIN_USERNAME`, `INITIAL_ADMIN_EMAIL`, and `INITIAL_ADMIN_PASSWORD` (8–16 characters). Docker reads these values from the **root `.env`**; local backend development reads them from `backend/.env`.

On startup, the idempotent bootstrap creates or synchronizes the administrator from those values:

```bash
docker compose run --rm backend node scripts/ensureInitialAdmin.js
```

The login form accepts either the configured administrator email or username and redirects administrators to `/admin`. The bootstrap promotes an existing matching user to administrator and synchronizes the configured credentials without committing secrets to Git.

For development only, the seed data contains `admin@synnex.store` / `admin123`. If the `INITIAL_ADMIN_*` variables are set, those environment values take precedence and should be used for login.

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

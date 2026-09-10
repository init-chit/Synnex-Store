# Synnex Store

Synnex Store is a full-stack digital game-key marketplace built with React, Node.js, Express and PostgreSQL. It supports games, inventory, wallet/top-up, coupons, reviews, wishlist, comparison, gacha and an admin dashboard.

## Production stack

- Frontend: React 19, React Router, Vite, Tailwind CSS, Axios, Lucide
- Backend: Node.js 22, Express 5, PostgreSQL, JWT, bcryptjs, Multer
- Production: Docker Compose + Nginx + PostgreSQL 16
- Frontend public port: `3000`
- Backend public port: `5000`

## Docker deployment

### 1. Configure environment

Copy `.env.example` to `.env` and replace all placeholder secrets. Do **not** commit real `.env` files or credentials.

Set the public URLs for your server, for example:

```env
DB_DATABASE=synnex_store
DB_USER=postgres
DB_PASSWORD=YOUR_STRONG_DB_PASSWORD
JWT_SECRET=YOUR_LONG_RANDOM_SECRET
BASE_URL=http://YOUR_SERVER_IP:3000
FRONTEND_URL=http://YOUR_SERVER_IP:3000
VITE_API_URL=http://YOUR_SERVER_IP:5000
```

### 2. Start

```bash
docker compose up -d --build
```

### 3. Check services

```bash
docker compose ps
curl http://localhost:3000/health
curl http://localhost:5000/health
```

The frontend Nginx configuration uses `try_files ... /index.html`, so React Router navigation works after direct URL access and refreshes without requiring a full-page application restart.

### 4. Stop

```bash
docker compose down
```

Use `docker compose down -v` only when you intentionally want to delete the PostgreSQL data volume.

## Secure initial admin

The initial administrator is created only when all three `INITIAL_ADMIN_*` variables are supplied. Real credentials must never be committed to Git.

Add these to the root `.env` temporarily:

```env
INITIAL_ADMIN_USERNAME=admin
INITIAL_ADMIN_EMAIL=admin@example.com
INITIAL_ADMIN_PASSWORD=YOUR_STRONG_PASSWORD_AT_LEAST_12_CHARS
```

Start the stack, then run the one-time bootstrap:

```bash
docker compose run --rm backend node scripts/ensureInitialAdmin.js
```

The bootstrap is idempotent, uses bcrypt with cost 12, promotes an existing matching user to admin when necessary, and does not overwrite an existing admin password. After successful bootstrap, remove or unset the `INITIAL_ADMIN_*` values from the server `.env`.

The login page accepts the configured admin email and password. Its Back button always returns to `/`.

## Admin-managed payment methods

Admins can configure payment methods from `/admin/payment-methods`.

The backend exposes:

- `GET /api/payment-methods` — public active/configured methods
- `POST /api/payment-methods` — admin create
- `PUT /api/payment-methods/:id` — admin update
- `DELETE /api/payment-methods/:id` — admin delete

Payment methods support a display name, type, account name/number, QR image URL, instructions, active state and sort order.

## Wallet top-up

Customer top-ups use MMK and start at **1,000 MMK**. A customer selects an active payment method, enters the payment reference, and submits the request. The request is stored as `pending`; wallet balance is not credited automatically. An administrator must verify the payment before crediting funds.

Daily rewards are separate from purchased top-ups and use a database transaction with row locking to prevent duplicate claims.

## Development

```bash
cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev
```

For local development, create `backend/.env` from `backend/.env.example` and configure PostgreSQL. The Docker setup is the recommended production path.

## Production safety

- Never put database passwords, JWT secrets or payment credentials in Git.
- Change all placeholder secrets before exposing the service to the Internet.
- Back up PostgreSQL before destructive migrations.
- Use HTTPS at the reverse-proxy/load-balancer layer in production.
- Existing PostgreSQL volumes are not reinitialized automatically when `database.sql` changes; apply schema migrations explicitly to an existing deployment.

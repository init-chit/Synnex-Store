# Synnex Store

Synnex Store is a full-stack digital game-key marketplace built with React, Node.js, Express and PostgreSQL. It supports games, inventory, wallet/top-up, coupons, reviews, wishlist, comparison, gacha and an admin dashboard.

## Current stack

- Frontend: React 19, React Router, Vite, Tailwind CSS, Axios, Lucide
- Backend: Node.js 22, Express 5, PostgreSQL, JWT, bcryptjs, Multer
- Production: Docker Compose + Nginx + PostgreSQL 16

## Docker deployment

The repository is now deployable as a three-service stack:

- `frontend`: production Vite build served by Nginx on port `80`
- `backend`: Node.js API on port `5000`
- `db`: PostgreSQL 16 with a persistent Docker volume

### 1. Configure environment

Copy `.env.example` to `.env` and replace the placeholder password and JWT secret. Do **not** commit real `.env` files or secrets.

### 2. Start

```bash
docker compose up -d --build
```

### 3. Check services

```bash
docker compose ps
curl http://localhost/health
curl http://localhost:5000/health
```

The frontend Nginx configuration uses `try_files ... /index.html`, so React Router navigation works after direct URL access and page refreshes.

### 4. Stop

```bash
docker compose down
```

Use `docker compose down -v` only when you intentionally want to delete the PostgreSQL data volume.

## Environment variables

The Docker Compose stack keeps secrets outside the repository:

```env
DB_DATABASE=synnex_store
DB_USER=postgres
DB_PASSWORD=change-me
JWT_SECRET=replace-with-a-long-random-secret
BASE_URL=http://localhost
FRONTEND_URL=http://localhost
VITE_API_URL=http://localhost:5000
```

The frontend API URL is a Vite build-time variable. If the browser reaches the site through a public domain, set `VITE_API_URL` to the public API URL before rebuilding the frontend image.

## Admin-managed payment methods

Admins can configure payment methods from:

`/admin/payment-methods`

The backend exposes:

- `GET /api/payment-methods` — public list of configured methods
- `POST /api/payment-methods` — admin create
- `PUT /api/payment-methods/:id` — admin update
- `DELETE /api/payment-methods/:id` — admin delete

Payment methods support a display name, type, account name/number, QR image URL, instructions, active state and sort order.

## Development

```bash
cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev
```

For local development, create `backend/.env` from `backend/.env.example` and configure PostgreSQL. The Docker setup is the recommended production path.

## Important production notes

- Never put database passwords, JWT secrets or payment credentials in Git.
- Change all placeholder secrets before exposing the service to the Internet.
- Back up the PostgreSQL volume/database before destructive migrations.
- Use HTTPS at the reverse-proxy/load-balancer layer in production.
- The current wallet top-up implementation still contains the original simulation flow; real payment-provider verification should be added before accepting live customer payments.

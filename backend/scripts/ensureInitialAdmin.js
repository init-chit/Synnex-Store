const bcrypt = require('bcryptjs');
const db = require('../db');

const username = process.env.INITIAL_ADMIN_USERNAME;
const email = process.env.INITIAL_ADMIN_EMAIL;
const password = process.env.INITIAL_ADMIN_PASSWORD;

async function main() {
  if (!username && !email && !password) {
    console.log('Initial admin bootstrap skipped: INITIAL_ADMIN_* variables are not set.');
    return;
  }

  if (!username || !email || !password) {
    throw new Error('INITIAL_ADMIN_USERNAME, INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD must all be set together.');
  }

  if (password.length < 12) {
    throw new Error('INITIAL_ADMIN_PASSWORD must be at least 12 characters long.');
  }

  const existing = await db.query(
    'SELECT user_id, username, email, role FROM users WHERE username = $1 OR email = $2 LIMIT 1',
    [username, email]
  );

  if (existing.rows.length > 0) {
    const user = existing.rows[0];
    if (user.role !== 'admin') {
      await db.query('UPDATE users SET role = $1 WHERE user_id = $2', ['admin', user.user_id]);
      console.log(`Existing user ${user.username} promoted to admin.`);
    } else {
      console.log(`Admin ${user.username} already exists; no password changes were made.`);
    }
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await db.query(
    `INSERT INTO users (username, email, password_hash, role)
     VALUES ($1, $2, $3, 'admin')`,
    [username, email, passwordHash]
  );

  console.log(`Initial admin ${username} created successfully.`);
}

main()
  .catch((error) => {
    console.error('Initial admin bootstrap failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.pool.end();
  });

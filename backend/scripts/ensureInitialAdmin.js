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

  const passwordHash = await bcrypt.hash(password, 12);

  if (existing.rows.length > 0) {
    const user = existing.rows[0];
    await db.query(
      `UPDATE users
       SET username = $1, email = $2, password_hash = $3, role = 'admin'
       WHERE user_id = $4`,
      [username, email, passwordHash, user.user_id]
    );
    console.log(`Initial admin ${username} verified and credentials synchronized.`);
    return;
  }

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

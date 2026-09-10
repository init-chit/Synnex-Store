const { Pool } = require('pg');
require('dotenv').config();

// Configuration for database connection
const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT) || 5432,
  // Force IPv4 connection to avoid IPv6 issues
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 20,
};

// If using Supabase Connection Pooling, use port 6543
if (process.env.DB_USE_POOLING === 'true' || process.env.DB_PORT === '6543') {
  dbConfig.port = 6543;
}

const pool = new Pool(dbConfig);

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database successfully!');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
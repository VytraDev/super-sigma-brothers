const { Pool, types } = require('pg');

// Keep PostgreSQL DATE values as YYYY-MM-DD, without a UTC conversion.
types.setTypeParser(1082, (value) => value);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;

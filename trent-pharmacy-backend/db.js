const { Pool } = require('pg');

// Ensure you have a DATABASE_URL in your .env file, for example:
// DATABASE_URL=postgres://username:password@hostname:port/databasename
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Uncomment the following if your database requires SSL (commonly for remote databases)
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;

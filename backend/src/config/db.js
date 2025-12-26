const { Pool } = require('pg');

// These settings must match your docker-compose.yml environment variables
const pool = new Pool({
  user: 'user',
  host: 'database', // This tells Node to look for the Docker container named 'database'
  database: 'saas_db',
  password: 'password',
  port: 5432,
});

// Test the connection immediately
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err.stack);
  } else {
    console.log('Database connected successfully at:', res.rows[0].now);
  }
});

module.exports = pool;
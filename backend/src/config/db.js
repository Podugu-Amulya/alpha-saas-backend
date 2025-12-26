const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

// Use the Internal Database URL from Render for the best performance
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Render/Cloud connections
  }
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection error:', err.stack);
  } else {
    console.log('✅ Cloud Database connected at:', res.rows[0].now);
  }
});

module.exports = pool;
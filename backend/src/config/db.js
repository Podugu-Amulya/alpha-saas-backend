const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // FIXED: Render PostgreSQL requires SSL/TLS. 
  // We set rejectUnauthorized to false to allow the connection from local Docker.
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000, 
});

// --- AUTO-SEED LOGIC ---
const seedDatabase = async () => {
  try {
    // 1. Create Tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tenants (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        subdomain VARCHAR(255) UNIQUE NOT NULL
      );
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        tenant_id INTEGER REFERENCES tenants(id),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'tenant_admin'
      );
    `);

    // 2. Check if demo tenant exists
    const tenantCheck = await pool.query("SELECT id FROM tenants WHERE subdomain = 'demo'");
    
    if (tenantCheck.rows.length === 0) {
      // 3. Insert Demo Data
      const tenantRes = await pool.query("INSERT INTO tenants (name, subdomain) VALUES ('Demo Co', 'demo') RETURNING id");
      const tenantId = tenantRes.rows[0].id;
      
      // Note: Use 'Demo@123' as the password in your login screen later
      await pool.query(`
        INSERT INTO users (tenant_id, email, password_hash, role) 
        VALUES ($1, 'admin@demo.com', 'Demo@123', 'tenant_admin')
      `, [tenantId]);
      
      console.log('✅ DATABASE SEEDED: User admin@demo.com created!');
    } else {
      console.log('ℹ️  Database already seeded.');
    }
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
  }
};

// Initial Connection Test
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ DATABASE CONNECTION ERROR:', err.message);
  } else {
    console.log('✅ Connected to Render Database (Singapore)!');
    seedDatabase(); 
  }
});

module.exports = pool;
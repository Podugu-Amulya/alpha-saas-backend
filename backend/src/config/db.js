const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } 
});

const init = async () => {
  let client;
  try {
    client = await pool.connect();
    console.log("✅ CONNECTION SUCCESSFUL TO RENDER");
    
    // 1. Core Tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS tenants (id SERIAL PRIMARY KEY, name TEXT, subdomain TEXT UNIQUE);
      CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, tenant_id INT REFERENCES tenants(id), email TEXT UNIQUE, password_hash TEXT, role TEXT);
      CREATE TABLE IF NOT EXISTS projects (id SERIAL PRIMARY KEY, tenant_id INT REFERENCES tenants(id), name TEXT, description TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
    `);

    // 2. THE STABLE FIX: Add the column if it's missing (No dropping needed)
    await client.query(`ALTER TABLE projects ADD COLUMN IF NOT EXISTS created_by INT REFERENCES users(id);`);

    // 3. Seed Data
    const hash = await bcrypt.hash('Demo@123', 10);
    const tenantRes = await client.query("INSERT INTO tenants (name, subdomain) VALUES ('Demo', 'demo') ON CONFLICT (subdomain) DO UPDATE SET name = 'Demo' RETURNING id");
    const tenantId = tenantRes.rows[0].id;

    await client.query("INSERT INTO users (tenant_id, email, password_hash, role) VALUES ($1, 'admin@demo.com', $2, 'tenant_admin') ON CONFLICT (email) DO UPDATE SET password_hash = $2", [tenantId, hash]);

    console.log("✅ DATABASE UPDATED SUCCESSFULLY");
  } catch (err) {
    console.error("❌ DATABASE INIT ERROR:", err.message);
  } finally {
    if (client) client.release();
  }
};

init();
module.exports = pool;
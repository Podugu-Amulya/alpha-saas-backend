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
    
    // 1. Create Tenants Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS tenants (
        id SERIAL PRIMARY KEY, 
        name TEXT, 
        subdomain TEXT UNIQUE
      );
    `);

    // 2. Create Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY, 
        tenant_id INT REFERENCES tenants(id), 
        email TEXT UNIQUE, 
        password_hash TEXT, 
        role TEXT
      );
    `);

    // 3. Create Projects Table (This fixes your "created_by" error)
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        tenant_id INT REFERENCES tenants(id),
        name TEXT,
        description TEXT,
        created_by INT REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Seed Tenant and Admin User
    const hash = await bcrypt.hash('Demo@123', 10);
    const tenantRes = await client.query(`
      INSERT INTO tenants (name, subdomain) 
      VALUES ('Demo', 'demo') 
      ON CONFLICT (subdomain) DO UPDATE SET name = 'Demo' 
      RETURNING id
    `);
    
    const tenantId = tenantRes.rows[0].id;

    await client.query(`
      INSERT INTO users (tenant_id, email, password_hash, role) 
      VALUES ($1, 'admin@demo.com', $2, 'tenant_admin') 
      ON CONFLICT (email) DO UPDATE SET password_hash = $2
    `, [tenantId, hash]);

    console.log("✅ ALL TABLES READY AND SEEDED SUCCESSFULLY");
  } catch (err) {
    console.error("❌ DATABASE INIT ERROR:", err.message);
  } finally {
    if (client) client.release();
  }
};

init();
module.exports = pool;
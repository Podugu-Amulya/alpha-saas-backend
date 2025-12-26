const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

// The connection string is pulled from the .env file you just made
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Required for remote connection to Render
});

const createTablesQuery = `
  CREATE TABLE IF NOT EXISTS tenants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

async function setup() {
  try {
    console.log("⏳ Connecting to Render database...");
    await client.connect();
    console.log("📡 Connected! Creating tables...");
    await client.query(createTablesQuery);
    console.log("✅ Tables 'tenants' and 'projects' created successfully!");
  } catch (err) {
    console.error("❌ Error during database setup:", err);
  } finally {
    await client.end();
  }
}

setup();
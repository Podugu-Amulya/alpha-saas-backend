const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- TENANT REGISTRATION (Requirement 1) ---
exports.registerTenant = async (req, res) => {
    const { tenantName, subdomain, adminEmail, adminPassword, adminFullName } = req.body;
    
    try {
        const client = await pool.connect();
        await client.query('BEGIN');

        // 1. Create Tenant
        const tenantRes = await client.query(
            'INSERT INTO tenants (name, subdomain) VALUES ($1, $2) RETURNING id',
            [tenantName, subdomain]
        );
        const tenantId = tenantRes.rows[0].id;

        // 2. Hash Password and Create Admin User
        const hashedPw = await bcrypt.hash(adminPassword, 10);
        await client.query(
            'INSERT INTO users (tenant_id, email, password_hash, full_name, role) VALUES ($1, $2, $3, $4, $5)',
            [tenantId, adminEmail, hashedPw, adminFullName, 'tenant_admin']
        );

        await client.query('COMMIT');
        client.release();

        res.status(201).json({ success: true, message: "Tenant registered successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// --- USER LOGIN (Requirement 2) ---
exports.login = async (req, res) => {
    const { email, password, subdomain } = req.body;

    try {
        // 1. Find the tenant by subdomain
        const tenantRes = await pool.query('SELECT id FROM tenants WHERE subdomain = $1', [subdomain]);
        if (tenantRes.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Tenant not found" });
        }
        const tenantId = tenantRes.rows[0].id;

        // 2. Find the user in that tenant
        const userRes = await pool.query('SELECT * FROM users WHERE email = $1 AND tenant_id = $2', [email, tenantId]);
        if (userRes.rows.length === 0) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }
        const user = userRes.rows[0];

        // 3. Compare password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        // 4. Generate JWT Token
        const token = jwt.sign(
            { id: user.id, tenant_id: tenantId, role: user.role },
            process.env.JWT_SECRET || 'test_secret_123',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token: token,
            user: { id: user.id, name: user.full_name, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
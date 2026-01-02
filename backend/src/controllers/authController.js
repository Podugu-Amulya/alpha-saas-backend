// 1. Import necessary modules
// Use '../config/db' because this file is inside 'controllers' and db is in 'config'
const pool = require('../config/db'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- Login Logic ---
exports.login = async (req, res) => {
    const { subdomain, email, password } = req.body;

    try {
        // 1. Validate that the tenant exists by subdomain
        const tenantRes = await pool.query(
            'SELECT id FROM tenants WHERE subdomain = $1',
            [subdomain.toLowerCase()]
        );

        if (tenantRes.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found in this subdomain' });
        }

        const tenantId = tenantRes.rows[0].id;

        // 2. Find the user within that specific tenant
        const userRes = await pool.query(
            'SELECT * FROM users WHERE email = $1 AND tenant_id = $2',
            [email.toLowerCase(), tenantId]
        );

        if (userRes.rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const user = userRes.rows[0];

        // 3. Compare passwords (Bcrypt hash vs plain text)
        // If your DB uses plain text for testing, use: if (password !== user.password_hash)
        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!isMatch && password !== user.password_hash) { 
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // 4. Generate JWT Token valid for 24 hours
        const token = jwt.sign(
            { id: user.id, tenant_id: user.tenant_id, role: user.role },
            process.env.JWT_SECRET || 'your_test_secret_key',
            { expiresIn: '24h' }
        );

        // 5. Send successful response
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                tenant_id: user.tenant_id
            }
        });

    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
};

// --- Registration Logic ---
exports.register = async (req, res) => {
    const { tenantName, subdomain, email, password, fullName } = req.body;

    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Start transaction

        // 1. Create the Tenant
        const tenantRes = await client.query(
            'INSERT INTO tenants (name, subdomain) VALUES ($1, $2) RETURNING id',
            [tenantName, subdomain.toLowerCase()]
        );
        const tenantId = tenantRes.rows[0].id;

        // 2. Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create the Admin User for this tenant
        await client.query(
            'INSERT INTO users (tenant_id, email, password_hash, full_name, role) VALUES ($1, $2, $3, $4, $5)',
            [tenantId, email.toLowerCase(), hashedPassword, fullName, 'tenant_admin']
        );

        await client.query('COMMIT'); // Commit transaction
        res.status(201).json({ success: true, message: 'Tenant registered successfully' });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Registration Error:', err.message);
        res.status(500).json({ success: false, message: 'Error creating tenant: ' + err.message });
    } finally {
        client.release();
    }
};
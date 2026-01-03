const pool = require('../config/db'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- Login Logic ---
exports.login = async (req, res) => {
    const { subdomain, email, password } = req.body;

    try {
        const tenantRes = await pool.query(
            'SELECT id FROM tenants WHERE subdomain = $1',
            [subdomain.toLowerCase()]
        );

        if (tenantRes.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Subdomain not found' });
        }

        const tenantId = tenantRes.rows[0].id;

        const userRes = await pool.query(
            'SELECT * FROM users WHERE email = $1 AND tenant_id = $2',
            [email.toLowerCase(), tenantId]
        );

        if (userRes.rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const user = userRes.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!isMatch) { 
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user.id, tenant_id: user.tenant_id, role: user.role },
            process.env.JWT_SECRET || 'your_test_secret_key',
            { expiresIn: '24h' }
        );

        res.status(200).json({
            success: true,
            token,
            user: { id: user.id, email: user.email, role: user.role, tenant_id: user.tenant_id }
        });

    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
};

// --- Registration Logic ---
exports.register = async (req, res) => {
    const { tenantName, subdomain, email, password } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const tenantRes = await client.query(
            'INSERT INTO tenants (name, subdomain) VALUES ($1, $2) RETURNING id',
            [tenantName, subdomain.toLowerCase()]
        );
        const tenantId = tenantRes.rows[0].id;

        const hashedPassword = await bcrypt.hash(password, 10);

        // FIXED: Removed 'full_name' column to match the database schema
        await client.query(
            'INSERT INTO users (tenant_id, email, password_hash, role) VALUES ($1, $2, $3, $4)',
            [tenantId, email.toLowerCase(), hashedPassword, 'tenant_admin']
        );

        await client.query('COMMIT');
        res.status(201).json({ success: true, message: 'Registered successfully' });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('REGISTRATION ERROR:', err.message); 
        res.status(500).json({ success: false, message: 'Registration failed: ' + err.message });
    } finally {
        client.release();
    }
};
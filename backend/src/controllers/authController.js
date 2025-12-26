const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- REGISTER ---
exports.registerTenant = async (req, res) => {
    try {
        const { name, email, password, subdomain } = req.body;
        
        // Hash the password for security
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const query = `INSERT INTO tenants (name, email, password, subdomain) VALUES ($1, $2, $3, $4) RETURNING id, name, subdomain`;
        const result = await pool.query(query, [name, email, hashedPassword, subdomain.toLowerCase()]);
        
        res.status(201).json({ success: true, tenant: result.rows[0] });
    } catch (err) {
        console.error("Registration Error:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};

// --- LOGIN ---
exports.login = async (req, res) => {
    try {
        const { email, password, subdomain } = req.body;

        // Verify user belongs to the specific subdomain entered
        const query = "SELECT * FROM tenants WHERE email = $1 AND subdomain = $2";
        const result = await pool.query(query, [email, subdomain.toLowerCase()]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found in this subdomain" });
        }
        
        const isMatch = await bcrypt.compare(password, result.rows[0].password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

        // Create the token
        const token = jwt.sign(
            { id: result.rows[0].id }, 
            process.env.JWT_SECRET || 'secret', 
            { expiresIn: '1d' }
        );

        res.json({ success: true, token });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// --- GET ME (Fixes Dashboard Header) ---
exports.getMe = async (req, res) => {
    try {
        // req.user.id comes from authMiddleware.js
        const result = await pool.query("SELECT name, subdomain FROM tenants WHERE id = $1", [req.user.id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
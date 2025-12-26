const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- REGISTER TENANT ---
exports.registerTenant = async (req, res) => {
    try {
        // 1. Log the incoming data to debug the "null name" error
        console.log("--- New Registration Attempt ---");
        console.log("Request Body Received:", req.body);

        const { name, email, password, subdomain } = req.body;

        // 2. Validation Check
        if (!name || !email || !password || !subdomain) {
            console.log("❌ Validation Failed: Missing fields");
            return res.status(400).json({
                success: false,
                message: "Missing fields. Please ensure name, email, password, and subdomain are provided."
            });
        }

        // 3. Hash the password for security
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Insert into the Cloud Database
        // Note: We use the variables in order: $1=name, $2=email, $3=password, $4=subdomain
        const query = `
            INSERT INTO tenants (name, email, password, subdomain)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name, email, subdomain, created_at
        `;
        const values = [name, email, hashedPassword, subdomain];

        const result = await pool.query(query, values);

        console.log("✅ Tenant Registered Successfully:", result.rows[0].subdomain);

        res.status(201).json({
            success: true,
            message: "Tenant registered successfully!",
            tenant: result.rows[0]
        });

    } catch (err) {
        console.error("❌ Database Error:", err.message);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// --- LOGIN ---
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const query = "SELECT * FROM tenants WHERE email = $1";
        const result = await pool.query(query, [email]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Create JWT Token
        const token = jwt.sign(
            { id: user.id, subdomain: user.subdomain },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            success: true,
            token,
            tenant: {
                id: user.id,
                name: user.name,
                subdomain: user.subdomain
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
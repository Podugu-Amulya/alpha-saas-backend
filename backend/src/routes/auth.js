const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 1. LOGIN ROUTE (Already working)
router.post('/login', async (req, res) => {
  const { subdomain, email, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND subdomain = $2',
      [email, subdomain]
    );
    const user = result.rows[0];

    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id, subdomain: user.subdomain }, process.env.JWT_SECRET);
      res.json({ success: true, token, user: { name: user.name, email: user.email } });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 2. INVITE TEAM MEMBER ROUTE (NEW!)
router.post('/invite', async (req, res) => {
  const { name, email, password, subdomain } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password, subdomain, role) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [name, email, hashedPassword, subdomain, 'member'] // Role is 'member', not 'admin'
    );
    res.json({ success: true, message: 'Team member invited successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'User already exists or error occurred' });
  }
});

// 3. GET PROFILE ROUTE (For the "Hello Amulya" greeting)
router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.sendStatus(403);
    const result = await pool.query('SELECT name, email, subdomain FROM users WHERE id = $1', [decoded.id]);
    res.json({ success: true, user: result.rows[0] });
  });
});

module.exports = router;
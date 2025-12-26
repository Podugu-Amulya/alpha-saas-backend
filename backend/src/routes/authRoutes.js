const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// This defines the /api/auth/register-tenant endpoint
router.post('/register-tenant', authController.registerTenant);
router.post('/login', authController.login);

module.exports = router;
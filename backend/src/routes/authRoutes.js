const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Check that this EXACT line exists
router.post('/register-tenant', authController.registerTenant);

router.post('/login', authController.login);
// Added this for your dashboard to show the tenant name
router.get('/me', require('../middleware/authMiddleware').protect, authController.getMe);

module.exports = router;
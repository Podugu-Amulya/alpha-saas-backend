const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Go up one level

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
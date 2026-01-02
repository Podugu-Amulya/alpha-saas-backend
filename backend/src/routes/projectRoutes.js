const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');

// Fixed: Correctly passing functions to routes
router.post('/', authMiddleware, projectController.createProject);
router.get('/', authMiddleware, projectController.getProjects);

module.exports = router;
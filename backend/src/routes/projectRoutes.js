const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

// If projectController.createProject is missing, the server crashes here
router.post('/', protect, projectController.createProject);
router.get('/', protect, projectController.getProjects);

module.exports = router;
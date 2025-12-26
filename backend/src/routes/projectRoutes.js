const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');

// Setup where to store files temporarily
const upload = multer({ dest: 'uploads/' });

// Create and Get
router.post('/', authMiddleware, projectController.createProject);
router.get('/', authMiddleware, projectController.getProjects);

// Delete
router.delete('/:id', authMiddleware, projectController.deleteProject);

// NEW: Upload File Route
router.post('/:id/upload', authMiddleware, upload.single('file'), projectController.uploadFile);

module.exports = router;
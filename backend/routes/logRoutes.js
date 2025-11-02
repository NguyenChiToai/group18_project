// backend/routes/logRoutes.js
const express = require('express');
const router = express.Router();
const { getAllLogs } = require('../controllers/logController');
const { protect, checkRole } = require('../middleware/authMiddleware');

// API này chỉ dành cho admin
router.get('/', protect, checkRole('admin'), getAllLogs);

module.exports = router;
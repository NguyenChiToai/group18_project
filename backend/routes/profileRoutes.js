// backend/routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware'); // Import "người gác cổng"

// Định nghĩa route cho profile
// Cả hai route GET và PUT đều được bảo vệ bởi middleware 'protect'
router.route('/').get(protect, getUserProfile).put(protect, updateUserProfile);

module.exports = router;
// backend/routes/profileRoutes.js
const express = require('express');
const router = express.Router();

const { 
    getUserProfile, 
    updateUserProfile, 
    uploadAvatar // Sử dụng tên hàm mới
} = require('../controllers/profileController');

const { protect } = require('../middleware/authMiddleware');

// Route để lấy và cập nhật thông tin cơ bản
router.route('/').get(protect, getUserProfile).put(protect, updateUserProfile);

// Route mới để upload avatar
router.put('/avatar', protect, uploadAvatar);

module.exports = router;
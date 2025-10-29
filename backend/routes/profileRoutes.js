// backend/routes/profileRoutes.js

const express = require('express');
const router = express.Router();

// 1. Cập nhật lại danh sách hàm import từ controller
const { 
    getUserProfile, 
    updateUserProfile, 
    updateAvatarFromBase64 // Thêm hàm mới
} = require('../controllers/profileController');

const { protect } = require('../middleware/authMiddleware');

// 2. XÓA BỎ TOÀN BỘ CODE LIÊN QUAN ĐẾN MULTER VÀ CLOUDINARYSTORAGE

// Route để lấy và cập nhật thông tin cơ bản (name, email, password)
router.route('/').get(protect, getUserProfile).put(protect, updateUserProfile);

// 3. THAY THẾ ROUTE UPLOAD CŨ BẰNG ROUTE MỚI
// Route này dùng phương thức PUT để cập nhật URL của avatar
router.put('/avatar', protect, updateAvatarFromBase64);

module.exports = router;
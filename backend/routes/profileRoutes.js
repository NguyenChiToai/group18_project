// backend/routes/profileRoutes.js
const express = require('express');
const router = express.Router();

// --- BƯỚC 1: IMPORT CONTROLLERS ---
// Đảm bảo dòng này import đầy đủ cả 3 hàm
const { 
    getUserProfile, 
    updateUserProfile, 
    uploadAvatar 
} = require('../controllers/profileController');

// --- BƯỚC 2: IMPORT MIDDLEWARES ---
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// =================================================================
// ĐỊNH NGHĨA CÁC ROUTE
// =================================================================

// Route để lấy (GET) và cập nhật (PUT) thông tin cơ bản của profile
// Áp dụng middleware express.json() chỉ cho route PUT này
router.route('/')
    .get(protect, getUserProfile)
    .put(protect, express.json({ limit: '50mb' }), updateUserProfile); // Thêm express.json() vào đây

// Route để upload avatar
// Route này sử dụng middleware của Multer, không dùng express.json()
router.post(
    '/avatar', 
    protect, 
    upload.single('avatar'), 
    uploadAvatar
);

module.exports = router;
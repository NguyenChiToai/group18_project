// backend/routes/profileRoutes.js
const express = require('express');
const router = express.Router();

// Import controllers
const { 
    getUserProfile, 
    updateUserProfile, 
    uploadAvatar 
} = require('../controllers/profileController');

// Import middlewares
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const logActivity = require('../middleware/logActivityMiddleware'); // Đã import

// =================================================================
// ĐỊNH NGHĨA CÁC ROUTE
// =================================================================

// Route để lấy (GET) và cập nhật (PUT) thông tin cơ bản của profile
router.route('/')
    .get(
        protect, 
        getUserProfile
    )
    .put(
        protect, 
        express.json({ limit: '50mb' }), 
        logActivity('PROFILE_UPDATE'), // <-- THÊM VÀO ĐÂY
        updateUserProfile
    );

// Route để upload avatar
// Chúng ta cũng có thể ghi log cho hành động này
router.post(
    '/avatar', 
    protect, 
    upload.single('avatar'), 
    logActivity('AVATAR_UPDATE'), // <-- CÂN NHẮC THÊM VÀO ĐÂY
    uploadAvatar
);

module.exports = router;
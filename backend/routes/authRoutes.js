// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();

// 1. Import đầy đủ các hàm controller
const authController = require('../controllers/authController');

// Route test
router.get('/test', (req, res) => {
    console.log(">>> ĐÃ NHẬN REQUEST TẠI /api/auth/test");
    res.status(200).json({ message: "Server vẫn sống và phản hồi tốt!" });
});

// Các route cơ bản
// Sử dụng authController.signup thay vì signup để tránh lỗi undefined
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// 2. Thêm các route mới cho refresh token và logout
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);

// Các route nâng cao
router.post('/forgot-password', authController.forgotPassword);
// Chú ý: Route reset-password thường là POST hoặc PUT, không phải GET
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;
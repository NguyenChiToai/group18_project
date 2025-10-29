// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getUsers, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { adminProtect } = require('../middleware/adminMiddleware'); // <-- IMPORT DÒNG NÀY

// @route   GET /api/users
// @desc    Lấy tất cả user (Admin)
// Áp dụng cả 2 lớp bảo vệ: Phải đăng nhập VÀ phải là admin
router.route('/').get(protect, adminProtect, getUsers);

// @route   DELETE /api/users/:id
// @desc    Xóa một user (Admin)
router.route('/:id').delete(protect, adminProtect, deleteUser);

module.exports = router;
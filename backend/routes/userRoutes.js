// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();

// 1. Import các hàm controller và middleware cần thiết
const { getUsers, deleteUser } = require('../controllers/userController');
const { protect, checkRole } = require('../middleware/authMiddleware');

// 2. Định nghĩa route cho đường dẫn gốc '/api/users'
// Chỉ có một phương thức GET cho đường dẫn này
router.route('/')
    .get(protect, checkRole('admin'), getUsers);

// 3. Định nghĩa route cho đường dẫn '/api/users/:id'
// Chỉ có một phương thức DELETE cho đường dẫn này
router.route('/:id')
    .delete(protect, checkRole('admin'), deleteUser);

module.exports = router;
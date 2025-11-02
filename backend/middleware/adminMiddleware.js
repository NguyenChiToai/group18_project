// backend/middleware/adminMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const adminProtect = (req, res, next) => {
    // Middleware 'protect' đã chạy trước và gắn user vào req
    if (req.user && req.user.role === 'admin') {
        next(); // Nếu là admin, cho đi tiếp
    } else {
        // Nếu không phải admin, trả về lỗi 403 Forbidden
        res.status(403).json({ message: 'Không có quyền truy cập, yêu cầu quyền admin.' });
    }
};

// Sửa lại để export đúng hàm adminProtect
module.exports = { adminProtect };
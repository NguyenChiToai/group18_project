// backend/middleware/logActivityMiddleware.js
const Log = require('../models/Log');

// Hàm này là một "factory", nó tạo ra middleware với một hành động cụ thể
const logActivity = (action) => {
    return async (req, res, next) => {
        try {
            // Middleware này nên được dùng SAU middleware 'protect'
            if (req.user) {
                await Log.create({
                    user: req.user._id,
                    action: action,
                    ipAddress: req.ip, // Lấy địa chỉ IP của người dùng
                });
            }
        } catch (error) {
            console.error('Lỗi khi ghi log hoạt động:', error);
        }
        next(); // Luôn gọi next() để request được tiếp tục
    };
};

module.exports = logActivity;
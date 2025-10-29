// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            console.log("[MIDDLEWARE] Đang kiểm tra token:", token);

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            console.log("[MIDDLEWARE] Token hợp lệ, payload:", decoded);
            if (decoded.exp) {
                console.log("[MIDDLEWARE] Token sẽ hết hạn vào:", new Date(decoded.exp * 1000).toLocaleString());
            }

            req.user = await User.findById(decoded.user.id).select('-password');
            
            if (!req.user) {
                console.error("[MIDDLEWARE] Token hợp lệ nhưng không tìm thấy user trong DB.");
                return res.status(401).json({ message: 'Người dùng không tồn tại' });
            }
            
            return next();

        } catch (error) {
            console.error("[MIDDLEWARE] Token lỗi hoặc hết hạn:", error.message);
            return res.status(401).json({ message: 'Token không hợp lệ, truy cập bị từ chối' });
        }
    }

    if (!token) {
        console.log("[MIDDLEWARE] Không tìm thấy token trong header.");
        return res.status(401).json({ message: 'Không có token, truy cập bị từ chối' });
    }
};

const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: Bạn không có quyền truy cập tài nguyên này' });
        }
        next();
    };
};

module.exports = { protect, checkRole };
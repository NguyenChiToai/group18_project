// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Tách token ra khỏi header 'Bearer <token>'
            token = req.headers.authorization.split(' ')[1];

            // Thêm log để debug
            console.log("------------------------------------");
            console.log("[MIDDLEWARE] Đang kiểm tra token:", token);

            // Xác thực token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // LOG QUAN TRỌNG: Kiểm tra trường 'exp' (expiration time)
            // Giá trị này là một con số timestamp (số giây tính từ 1/1/1970)
            console.log("[MIDDLEWARE] Token hợp lệ, payload:", decoded);
            if (decoded.exp) {
                // Chuyển timestamp thành ngày giờ dễ đọc
                console.log("[MIDDLEWARE] Token sẽ hết hạn vào:", new Date(decoded.exp * 1000).toLocaleString());
            } else {
                console.log("[MIDDLEWARE] CẢNH BÁO: TOKEN NÀY KHÔNG CÓ THỜI GIAN HẾT HẠN (exp)!");
            }


            // Lấy thông tin user từ DB và gắn vào request
            req.user = await User.findById(decoded.user.id).select('-password');
            
            // Nếu không tìm thấy user (ví dụ user đã bị xóa)
            if (!req.user) {
                console.error("[MIDDLEWARE] Token hợp lệ nhưng không tìm thấy user trong DB.");
                return res.status(401).json({ message: 'Người dùng không tồn tại' });
            }
            
            // Mọi thứ ổn, cho phép đi tiếp
            return next();

        } catch (error) {
            // Nếu jwt.verify báo lỗi (hết hạn, không hợp lệ, ...)
            console.error("[MIDDLEWARE] Token lỗi hoặc hết hạn:", error.message);
            return res.status(401).json({ message: 'Token không hợp lệ, truy cập bị từ chối' });
        }
    }

    // Nếu không có header 'Authorization' hoặc không bắt đầu bằng 'Bearer'
    console.log("[MIDDLEWARE] Không tìm thấy token trong header.");
    return res.status(401).json({ message: 'Không có token, truy cập bị từ chối' });
};

module.exports = { protect };
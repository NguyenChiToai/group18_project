// backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// >>> PHẦN ĐỊNH NGHĨA BỊ THIẾU HOẶC SAI TÊN NẰM Ở ĐÂY <<<
// Đảm bảo bạn có đoạn code khai báo hàm 'protect' này
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Lấy token từ header
            token = req.headers.authorization.split(' ')[1];

            // Xác thực token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Lấy thông tin user từ token và gắn vào request
            // .select('-password') để không lấy trường password
            req.user = await User.findById(decoded.user.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'Người dùng không tồn tại' });
            }

            next(); // Mọi thứ ổn, đi tiếp
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Token không hợp lệ, xác thực thất bại' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Không có token, truy cập bị từ chối' });
    }
};

// >>> PHẦN EXPORT <<<
// Bây giờ hàm 'protect' đã được định nghĩa ở trên, dòng này sẽ chạy đúng
module.exports = { protect };
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware `protect`
 * - Xác thực JWT Access Token từ header 'Authorization'.
 * - Tìm user tương ứng trong DB và gắn vào `req.user`.
 * - Bảo vệ các route yêu cầu người dùng phải đăng nhập.
 */
const protect = async (req, res, next) => {
    let token;

    // --- Bắt đầu khối log ---
    console.log("\n\n=======================================================");
    console.log(`[AUTH PROTECT] - ${new Date().toLocaleTimeString()}`);
    console.log(`>> Request nhận được: ${req.method} ${req.originalUrl}`);

    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            // Tách token từ chuỗi "Bearer <token>"
            token = authHeader.split(' ')[1];
            console.log(`[AUTH PROTECT] >> Đã tìm thấy Bearer Token. Bắt đầu xác thực...`);

            // Giải mã token để lấy payload (chứa user id)
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(`[AUTH PROTECT] >> SUCCESS: Token hợp lệ. Payload:`, decoded);

            // Dùng ID từ token đã giải mã để tìm user trong Database
            // .select('-password') để không lấy trường password về
            req.user = await User.findById(decoded.user.id).select('-password');
            
            if (!req.user) {
                // Trường hợp hiếm: token hợp lệ nhưng user đã bị xóa khỏi DB
                console.error(`[AUTH PROTECT] >> ERROR: Không tìm thấy user với ID: ${decoded.user.id} trong DB.`);
                return res.status(401).json({ message: 'Người dùng thuộc token này không còn tồn tại.' });
            }
            
            // Mọi thứ thành công, cho phép request đi tiếp
            console.log(`[AUTH PROTECT] >> SUCCESS: Đã xác thực user: ${req.user.email}. Request được phép đi tiếp.`);
            console.log("=======================================================\n");
            next();

        } catch (error) {
            // Xử lý các lỗi phổ biến từ jwt.verify()
            console.error(`[AUTH PROTECT] >> ERROR: Token không hợp lệ hoặc đã hết hạn!`);
            console.error(`>> Chi tiết lỗi: ${error.message}`);
            console.log("=======================================================\n");
            return res.status(401).json({ message: `Token không hợp lệ: ${error.message}` });
        }
    } else {
        // Trường hợp không có header 'Authorization' hoặc không đúng định dạng 'Bearer'
        console.error("[AUTH PROTECT] >> ERROR: Không tìm thấy 'Bearer' token trong header Authorization.");
        console.log("=======================================================\n");
        return res.status(401).json({ message: 'Không có token, truy cập bị từ chối' });
    }
};

/**
 * Middleware `checkRole`
 * - Kiểm tra vai trò (role) của user đã được xác thực.
 * - Phải được sử dụng SAU middleware `protect`.
 * - Usage: checkRole('admin'), checkRole('admin', 'moderator')
 */
const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        console.log(`[AUTH CHECK_ROLE] - ${new Date().toLocaleTimeString()}`);

        if (!req.user) {
             console.error("[AUTH CHECK_ROLE] >> ERROR: req.user không tồn tại. Middleware 'protect' có thể đã bị thiếu trước đó.");
             return res.status(500).json({ message: 'Lỗi server: Không thể xác định thông tin người dùng.' });
        }
        
        const userRole = req.user.role;
        console.log(`[AUTH CHECK_ROLE] >> Vai trò của user: '${userRole}'. Các vai trò được phép: [${allowedRoles.join(', ')}]`);

        if (!allowedRoles.includes(userRole)) {
            console.error(`[AUTH CHECK_ROLE] >> FORBIDDEN: User '${req.user.email}' (role: '${userRole}') không có quyền truy cập.`);
            return res.status(403).json({ message: 'Forbidden: Bạn không có quyền thực hiện hành động này.' });
        }

        console.log(`[AUTH CHECK_ROLE] >> SUCCESS: Quyền hợp lệ. Request được phép đi tiếp.`);
        next();
    };
};

module.exports = { protect, checkRole };
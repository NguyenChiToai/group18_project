// backend/middleware/rateLimitMiddleware.js
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 5, // Cho phép tối đa 5 lần thử đăng nhập thất bại từ một IP trong 15 phút
    message: {
        message: 'Quá nhiều lần thử đăng nhập từ IP này, vui lòng thử lại sau 15 phút.',
    },
    standardHeaders: true, // Trả về thông tin rate limit trong header `RateLimit-*`
    legacyHeaders: false, // Tắt header `X-RateLimit-*` cũ
    // skipSuccessfulRequests: true // Chỉ tính các request thất bại (nếu muốn)
});

module.exports = { loginLimiter };
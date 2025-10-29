// backend/models/RefreshToken.js
const mongoose = require('mongoose');

const RefreshTokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Tham chiếu đến User model
        required: true,
    },
    // Thêm trường này để tự động xóa token hết hạn khỏi DB
    expiresAt: {
        type: Date,
        required: true,
    }
});

// Tạo một TTL index để MongoDB tự động dọn dẹp
RefreshTokenSchema.index({ "expiresAt": 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);
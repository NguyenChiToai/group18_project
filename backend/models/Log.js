// backend/models/Log.js
const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    action: {
        type: String,
        required: true,
        // Ví dụ: 'LOGIN_SUCCESS', 'PROFILE_UPDATE_SUCCESS', 'LOGIN_FAIL'
    },
    ipAddress: {
        type: String,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Log', LogSchema);
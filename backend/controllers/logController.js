// backend/controllers/logController.js
const Log = require('../models/Log');

exports.getAllLogs = async (req, res) => {
    try {
        // Lấy log, sắp xếp theo thời gian mới nhất, và populate thông tin user
        const logs = await Log.find({})
            .sort({ timestamp: -1 })
            .populate('user', 'name email'); // Chỉ lấy tên và email của user
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};
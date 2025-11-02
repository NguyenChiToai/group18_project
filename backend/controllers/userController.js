// backend/controllers/userController.js
const User = require('../models/User');
const mongoose = require('mongoose');

// @desc    Lấy tất cả người dùng (Admin)
// @route   GET /api/users
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error('LỖI KHI LẤY DANH SÁCH USER:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// @desc    Xóa một người dùng (Admin)
// @route   DELETE /api/users/:id
const deleteUser = async (req, res) => {
    try {
        const userIdToDelete = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(userIdToDelete)) {
            return res.status(400).json({ message: 'ID người dùng không hợp lệ' });
        }

        if (req.user._id.equals(userIdToDelete)) {
            return res.status(400).json({ message: 'Admin không thể tự xóa chính mình' });
        }

        const user = await User.findByIdAndDelete(userIdToDelete);

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        res.status(200).json({ message: 'Xóa người dùng thành công' });

    } catch (error) {
        console.error('LỖI KHI XÓA USER:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

module.exports = { getUsers, deleteUser };
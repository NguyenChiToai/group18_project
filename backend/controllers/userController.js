// backend/controllers/userController.js

const User = require('../models/User');
const mongoose = require('mongoose'); // Import mongoose để kiểm tra ID

// @desc    Lấy tất cả người dùng
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        // Tìm tất cả user và loại bỏ trường password
        const users = await User.find({}).select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error('LỖI KHI LẤY DANH SÁCH USER:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
};

// @desc    Xóa một người dùng
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const userIdToDelete = req.params.id;

        // 1. KIỂM TRA ID HỢP LỆ
        // Đảm bảo ID gửi lên có đúng định dạng của MongoDB
        if (!mongoose.Types.ObjectId.isValid(userIdToDelete)) {
            return res.status(400).json({ message: 'ID người dùng không hợp lệ' });
        }

        // 2. KIỂM TRA ADMIN TỰ XÓA
        // So sánh ID của admin đang đăng nhập (req.user._id) với ID sắp bị xóa
        if (req.user._id.equals(userIdToDelete)) {
            return res.status(400).json({ message: 'Admin không thể tự xóa chính mình' });
        }

        // 3. TÌM VÀ XÓA USER
        // Dùng findByIdAndDelete() thay vì findById() rồi remove()
        // Đây là cách làm hiệu quả và an toàn hơn
        const user = await User.findByIdAndDelete(userIdToDelete);

        // 4. KIỂM TRA KẾT QUẢ
        // Nếu không tìm thấy user nào có ID đó để xóa
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        // Nếu xóa thành công
        res.status(200).json({ message: 'Xóa người dùng thành công' });

    } catch (error) {
        // Bắt các lỗi không lường trước
        console.error('LỖI KHI XÓA USER:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
};

module.exports = { getUsers, deleteUser };
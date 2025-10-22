// backend/controllers/profileController.js
const User = require('../models/User');

// @desc    Lấy thông tin profile người dùng
// @route   GET /api/profile
const getUserProfile = async (req, res) => {
    // Middleware 'protect' đã tìm và gán user vào req.user
    // Nên chúng ta chỉ cần trả về là xong.
    res.status(200).json(req.user);
};

// @desc    Cập nhật thông tin profile người dùng
// @route   PUT /api/profile
const updateUserProfile = async (req, res) => {
    // Lấy user từ DB để đảm bảo dữ liệu mới nhất
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        // Nếu người dùng gửi lên mật khẩu mới thì cập nhật
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save(); // .save() sẽ tự động hash lại mật khẩu nếu nó thay đổi

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
        });
    } else {
        res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
};

module.exports = { getUserProfile, updateUserProfile };
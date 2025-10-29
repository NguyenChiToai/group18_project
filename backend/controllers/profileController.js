// backend/controllers/profileController.js

const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

// --- HÀM LẤY PROFILE (GIỮ NGUYÊN) ---
const getUserProfile = async (req, res) => {
    res.status(200).json(req.user);
};

// --- HÀM CẬP NHẬT PROFILE (GIỮ NGUYÊN) ---
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            avatar: updatedUser.avatar, // Trả về cả avatar
        });
    } else {
        res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
};

// --- HÀM MỚI: CẬP NHẬT URL AVATAR ---
const updateAvatarFromBase64 = async (req, res) => {
    // 1. Lấy chuỗi Base64 từ body của request
    const { avatar } = req.body;

    if (!avatar) {
        return res.status(400).json({ message: 'Vui lòng cung cấp dữ liệu ảnh Base64' });
    }

    try {
        // 2. Upload chuỗi Base64 lên Cloudinary
        // Cloudinary tự động nhận diện và xử lý chuỗi Base64.
        const uploadResponse = await cloudinary.uploader.upload(avatar, {
            folder: "user_avatars_base64", // Tạo một thư mục mới trên Cloudinary để dễ quản lý
            // Bạn không cần chỉ định public_id, Cloudinary sẽ tự tạo một ID duy nhất
        });

        // 3. Tìm user và cập nhật lại trường avatar
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        user.avatar = uploadResponse.secure_url; // Lấy URL an toàn từ kết quả upload
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Cập nhật ảnh đại diện thành công',
            avatarUrl: user.avatar,
        });

    } catch (error) {
        console.error('Lỗi khi upload Base64 avatar:', error);
        res.status(500).json({ success: false, message: 'Lỗi server khi xử lý ảnh' });
    }
};

// 3. Đảm bảo bạn đã export tất cả các hàm cần thiết
module.exports = {
    getUserProfile,
    updateUserProfile,// Export hàm mới
    updateAvatarFromBase64,
};
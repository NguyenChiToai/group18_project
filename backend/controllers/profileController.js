// backend/controllers/profileController.js
const User = require('../models/User');
const cloudinary = require('../config/cloudinary'); // <-- Import từ file config

// --- HÀM LẤY PROFILE (GIỮ NGUYÊN) ---
const getUserProfile = async (req, res) => {
    // Middleware 'protect' đã lấy user và bỏ password, nên chỉ cần trả về
    res.status(200).json(req.user);
};

// --- HÀM CẬP NHẬT PROFILE (GIỮ NGUYÊN) ---
const updateUserProfile = async (req, res) => {
    // ... code của bạn đã tốt, giữ nguyên ...
};


// --- HÀM UPLOAD AVATAR (TỐI ƯU) ---
const uploadAvatar = async (req, res) => {
    const { avatar: base64Image } = req.body; // Lấy chuỗi base64 từ body

    if (!base64Image) {
        return res.status(400).json({ message: 'Vui lòng cung cấp dữ liệu ảnh' });
    }

    try {
        // 1. Upload ảnh lên Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(base64Image, {
            folder: "group18_avatars", // Đặt tên thư mục trên Cloudinary
            resource_type: "image", // Chỉ định đây là file ảnh
        });

        // 2. Tìm và cập nhật user trong DB
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
        user.avatar = uploadResponse.secure_url;
        await user.save({ validateBeforeSave: false }); // Bỏ qua validation vì chỉ cập nhật avatar

        // 3. Trả về thông tin user ĐẦY ĐỦ để frontend cập nhật lại toàn bộ
        res.status(200).json({
            success: true,
            message: 'Cập nhật ảnh đại diện thành công',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
            },
        });

    } catch (error) {
        console.error('Lỗi khi upload avatar:', error);
        res.status(500).json({ success: false, message: 'Lỗi server khi xử lý ảnh' });
    }
};

// --- EXPORTS ---
module.exports = {
    getUserProfile,
    updateUserProfile,
    uploadAvatar, // Đổi tên hàm cho rõ ràng hơn
};
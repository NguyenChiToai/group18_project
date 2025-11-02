// backend/controllers/profileController.js
const User = require('../models/User');
const cloudinary = require('cloudinary').v2; // <-- Import trực tiếp hoặc từ file config

// Cấu hình Cloudinary (nếu chưa có file config riêng)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


// --- HÀM LẤY PROFILE ---
const getUserProfile = async (req, res) => {
    res.status(200).json(req.user);
};

// --- HÀM CẬP NHẬT PROFILE ---
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.name = req.body.name || user.name;
        if (req.body.password) {
            user.password = req.body.password;
        }
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            avatar: updatedUser.avatar,
        });
    } else {
        res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
};


// --- HÀM UPLOAD AVATAR DÙNG MULTER (PHIÊN BẢN ĐÚNG) ---
const uploadAvatar = async (req, res) => {
    console.log("\n--- [CONTROLLER uploadAvatar] Đã được gọi ---");
    // Dữ liệu file mà Multer xử lý sẽ nằm trong `req.file`
    console.log(">> Dữ liệu từ Multer (req.file):", req.file); 

    // 1. Kiểm tra xem `req.file` có tồn tại không
    if (!req.file) {
        console.error("❌ LỖI: req.file là undefined. Multer đã không xử lý được file.");
        return res.status(400).json({ message: 'Vui lòng cung cấp file ảnh.' });
    }

    try {
        console.log(">> Bắt đầu upload buffer của file lên Cloudinary...");
        
        // 2. Upload buffer của file (req.file.buffer) lên Cloudinary
        const uploadResponse = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "group18_avatars" },
                (error, result) => {
                    if (error) {
                        // Nếu có lỗi từ Cloudinary, reject Promise
                        return reject(error);
                    }
                    // Nếu thành công, resolve Promise với kết quả
                    resolve(result);
                }
            );
            // Gửi buffer vào stream để bắt đầu upload
            uploadStream.end(req.file.buffer);
        });
        
        console.log("✅ SUCCESS: Upload lên Cloudinary thành công. URL:", uploadResponse.secure_url);

        // 3. Cập nhật user trong DB với URL ảnh mới
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { avatar: uploadResponse.secure_url },
            { new: true } // 'new: true' để trả về document đã được cập nhật
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        console.log(`✅ SUCCESS: Cập nhật avatar cho user '${user.email}' thành công.`);
        
        // 4. Trả về thông tin user đã được cập nhật cho frontend
        res.status(200).json({
            message: 'Cập nhật ảnh đại diện thành công',
            user: user,
        });

    } catch (error) {
        console.error('❌ LỖI TRONG QUÁ TRÌNH UPLOAD LÊN CLOUDINARY:', error);
        res.status(500).json({ message: 'Lỗi server khi xử lý ảnh' });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    uploadAvatar,
};
// backend/controllers/authController.js

const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// --- HÀM 1: SIGNUP ---
const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }
        user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ message: 'Đăng ký thành công!' });
    } catch (error) {
        console.error('[SIGNUP] Lỗi:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// --- HÀM 2: LOGIN ---
const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(`[AUTH] Yêu cầu đăng nhập cho email: ${email}`);

    try {
        const user = await User.findOne({ email: email }).select('+password');
        if (!user) {
            console.log(`[AUTH] Lỗi: Không tìm thấy người dùng với email ${email}`);
            return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log(`[AUTH] Lỗi: Sai mật khẩu cho email ${email}`);
            return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        // --- TẠO TOKEN ---
        const accessTokenExpiresIn = '5m'; // Set thời gian hết hạn là 5 GIÂY để test
        console.log(`[AUTH] Đang tạo Access Token với thời gian hết hạn: ${accessTokenExpiresIn}`);

        const accessToken = jwt.sign(
            { user: { id: user.id, role: user.role } },
            process.env.JWT_SECRET,
            { expiresIn: accessTokenExpiresIn }
        );

        const refreshToken = jwt.sign(
            { user: { id: user.id } },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        // Xóa refresh token cũ (nếu có) và tạo cái mới để đảm bảo mỗi user chỉ có 1 refresh token
        await RefreshToken.findOneAndDelete({ user: user._id });
        const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await RefreshToken.create({
            token: refreshToken,
            user: user._id,
            expiresAt: sevenDaysFromNow,
        });

        console.log(`[AUTH] Đăng nhập thành công cho user: ${user.name}`);
        res.json({
            accessToken,
            refreshToken,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });

    } catch (error) {
        console.error('[AUTH] Lỗi nghiêm trọng trong quá trình đăng nhập:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// --- HÀM 3: REFRESH TOKEN ---
const refreshToken = async (req, res) => {
    const { token: requestToken } = req.body;
    if (!requestToken) {
        return res.status(401).json({ message: 'Không có refresh token' });
    }

    try {
        const refreshTokenDoc = await RefreshToken.findOne({ token: requestToken });
        if (!refreshTokenDoc) {
            return res.status(403).json({ message: 'Refresh token không hợp lệ hoặc đã bị thu hồi' });
        }

        jwt.verify(requestToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Refresh token không hợp lệ' });
            }

            const accessToken = jwt.sign(
                { user: { id: decoded.user.id } },
                process.env.JWT_SECRET,
                { expiresIn: '5s' } // Cấp lại token mới cũng với thời hạn 5 giây
            );

            res.json({ accessToken });
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// --- HÀM 4: LOGOUT ---
const logout = async (req, res) => {
    const { token } = req.body;
    try {
        await RefreshToken.findOneAndDelete({ token: token });
        res.status(200).json({ message: 'Đăng xuất thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// --- HÀM 5: FORGOT PASSWORD ---
// (Bạn có thể thêm code cho hàm này sau)
const forgotPassword = async (req, res) => {
    res.status(501).json({ message: "Chức năng chưa được cài đặt" });
};

// --- HÀM 6: RESET PASSWORD ---
// (Bạn có thể thêm code cho hàm này sau)
const resetPassword = async (req, res) => {
    res.status(501).json({ message: "Chức năng chưa được cài đặt" });
};


// ====================================================================
// === PHẦN SỬA LỖI QUAN TRỌNG NHẤT ===
// ====================================================================
// Export tất cả các hàm để file route có thể sử dụng
module.exports = {
    signup,
    login,
    refreshToken,
    logout,
    forgotPassword,
    resetPassword
};
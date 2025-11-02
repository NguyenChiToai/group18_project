// backend/controllers/authController.js

const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // <-- Thư viện cần thiết cho reset password
const sendEmail = require('../utils/sendEmail'); // <-- File tiện ích gửi email

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
    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        const accessToken = jwt.sign(
            { user: { id: user.id, role: user.role } },
            process.env.JWT_SECRET,
            { expiresIn: '15m' } // Đổi lại thời gian hợp lý hơn
        );

        const refreshToken = jwt.sign(
            { user: { id: user.id } },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        await RefreshToken.findOneAndDelete({ user: user._id });
        const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await RefreshToken.create({
            token: refreshToken,
            user: user._id,
            expiresAt: sevenDaysFromNow,
        });

        res.json({
            accessToken,
            refreshToken,
            user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }
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
        jwt.verify(requestToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Refresh token không hợp lệ' });
            }
            
            const user = await User.findById(decoded.user.id);
            if (!user) {
                return res.status(404).json({ message: 'Người dùng không tồn tại' });
            }

            const accessToken = jwt.sign(
                { user: { id: user.id, role: user.role } },
                process.env.JWT_SECRET,
                { expiresIn: '15m' }
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

// ====================================================================
// === PHẦN HOÀN THIỆN CHO HOẠT ĐỘNG 4 ===
// ====================================================================

// --- HÀM 5: FORGOT PASSWORD ---
const forgotPassword = async (req, res) => {
    let user;
    try {
        user = await User.findOne({ email: req.body.email });
        if (!user) {
            // Chú ý: Không nên báo "không tìm thấy user" để tránh lộ thông tin
            // Thay vào đó, vẫn trả về thông báo thành công chung chung.
            return res.status(200).json({ success: true, message: 'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được một link đặt lại mật khẩu.' });
        }

        // Lấy reset token từ method đã tạo trong Model
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        // Tạo URL reset (trỏ về trang frontend)
        // Khi deploy, bạn cần đổi 'localhost:3000' thành domain frontend của bạn
        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

        const message = `
            <h1>Yêu cầu đặt lại mật khẩu</h1>
            <p>Xin chào ${user.name},</p>
            <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng click vào link dưới đây để tiếp tục:</p>
            <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Đặt lại mật khẩu</a>
            <p>Link này sẽ hết hạn sau 10 phút. Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
        `;

        await sendEmail({
            email: user.email,
            subject: 'Yêu cầu đặt lại mật khẩu - Group18 Project',
            html: message,
        });

        res.status(200).json({ success: true, message: 'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được một link đặt lại mật khẩu.' });
    } catch (error) {
        console.error('[FORGOT PASSWORD] Lỗi:', error);
        // Đảm bảo token được dọn dẹp nếu có lỗi xảy ra
        if (user) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
        }
        res.status(500).json({ message: 'Lỗi khi gửi email, vui lòng thử lại.' });
    }
};

// --- HÀM 6: RESET PASSWORD ---
const resetPassword = async (req, res) => {
    try {
        // Băm lại token từ URL để so sánh với token trong DB
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }, // Token phải chưa hết hạn
        });

        if (!user) {
            return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.' });
        }

        // Đặt mật khẩu mới (middleware pre-save sẽ tự động hash)
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ success: true, message: 'Đặt lại mật khẩu thành công!' });
    } catch (error) {
        console.error('[RESET PASSWORD] Lỗi:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// ====================================================================
// === EXPORT TẤT CẢ CÁC HÀM ===
// ====================================================================
module.exports = {
    signup,
    login,
    refreshToken,
    logout,
    forgotPassword,
    resetPassword
};
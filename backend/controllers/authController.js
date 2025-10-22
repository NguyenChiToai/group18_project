const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
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
        console.error("!!! LỖI KHI ĐĂNG KÝ:", error);

        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.login = async (req, res) => {
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

        const payload = { user: { id: user.id, role: user.role } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error("!!! LỖI KHI ĐĂNG NHẬP:", error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.logout = (req, res) => {
    res.status(200).json({ message: "Đăng xuất thành công" });
};
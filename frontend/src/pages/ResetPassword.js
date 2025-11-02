// frontend/src/pages/ResetPassword.js

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/api'; // Đảm bảo bạn đã export hàm này
import './ResetPassword.css'; // File CSS để trang trông đẹp hơn

const ResetPassword = () => {
    // State để lưu mật khẩu người dùng nhập
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // State để hiển thị thông báo cho người dùng (thành công hoặc thất bại)
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Hook 'useParams' để lấy tham số :token từ URL
    const { token } = useParams();

    // Hook 'useNavigate' để điều hướng người dùng sau khi thành công
    const navigate = useNavigate();

    // Hàm xử lý khi người dùng nhấn nút submit form
    const handleSubmit = async (e) => {
        e.preventDefault(); // Ngăn trang reload lại

        // Xóa các thông báo cũ
        setMessage('');
        setError('');

        // Kiểm tra xem 2 mật khẩu có khớp không
        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp!');
            return;
        }

        // Kiểm tra độ dài mật khẩu (tùy chọn)
        if (password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }

        try {
            // Gọi API để reset mật khẩu
            const { data } = await resetPassword(token, password);
            setMessage(data.message || 'Mật khẩu đã được đặt lại thành công!');
            
            // Đợi 3 giây rồi tự động chuyển người dùng về trang đăng nhập
            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (err) {
            // Nếu có lỗi từ server, hiển thị nó ra
            setError(err.response?.data?.message || 'Token không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.');
        }
    };

    return (
        <div className="reset-password-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Đặt lại mật khẩu mới</h2>
                <p>Vui lòng nhập mật khẩu mới cho tài khoản của bạn.</p>
                
                <div className="form-group">
                    <label htmlFor="password">Mật khẩu mới</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Nhập mật khẩu mới"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Nhập lại mật khẩu mới"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary">Xác nhận</button>

                {/* Hiển thị thông báo */}
                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default ResetPassword;
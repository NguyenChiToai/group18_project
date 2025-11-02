// frontend/src/pages/ForgotPassword.js

import React, { useState } from 'react';
import { forgotPassword } from '../services/api'; // Đảm bảo bạn đã export hàm này
import './ForgotPassword.css'; // File CSS để trang trông đẹp hơn
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    // State để lưu email người dùng nhập
    const [email, setEmail] = useState('');

    // State để hiển thị thông báo
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Hàm xử lý khi người dùng nhấn nút submit form
    const handleSubmit = async (e) => {
        e.preventDefault(); // Ngăn trang reload
        setIsLoading(true);
        setMessage('');
        setError('');

        try {
            // Gọi API để yêu cầu gửi email reset
            const { data } = await forgotPassword(email);
            setMessage(data.message || 'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được một link đặt lại mật khẩu.');
        } catch (err) {
            // Hiển thị thông báo lỗi chung để bảo mật, tránh việc kẻ xấu dò email
            setError('Yêu cầu thất bại. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Quên mật khẩu?</h2>
                <p>Đừng lo lắng! Hãy nhập email của bạn và chúng tôi sẽ gửi cho bạn một link để đặt lại mật khẩu.</p>
                
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Nhập địa chỉ email của bạn"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? 'Đang gửi...' : 'Gửi link đặt lại'}
                </button>

                {/* Hiển thị thông báo */}
                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}

                <div className="form-footer">
                    <Link to="/login">Quay lại trang Đăng nhập</Link>
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;
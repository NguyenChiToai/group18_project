// src/pages/Login.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api'; // Đảm bảo đường dẫn đúng
import './AuthForm.css'; // Sử dụng lại cùng file CSS

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await loginUser(formData);
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/profile'); // Chuyển đến trang profile sau khi đăng nhập
        } catch (error) {
            setMessage(error.response?.data?.message || 'Đã có lỗi xảy ra.');
        }
    };

    return (
        <div className="auth-container">
            <h2 className="auth-title">Đăng Nhập</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-input"
                        placeholder="vidu@email.com"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mật khẩu</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="form-input"
                        placeholder="Nhập mật khẩu của bạn"
                        onChange={handleChange}
                        required
                    />
                </div>
                {message && <p className="auth-message error">{message}</p>}
                <button type="submit" className="btn">Đăng Nhập</button>
            </form>
            <p className="auth-switch">
                Chưa có tài khoản? <Link to="/signup">Tạo tài khoản mới</Link>
            </p>
        </div>
    );
};

export default Login;
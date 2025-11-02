// src/pages/Signup.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signupUser } from '../services/api'; // Đảm bảo đường dẫn đúng
import './AuthForm.css'; // Import file CSS chung

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await signupUser(formData);
            setMessage(data.message || 'Đăng ký thành công! Đang chuyển hướng...');
            setIsError(false);
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Đã có lỗi xảy ra.');
            setIsError(true);
        }
    };

    return (
        <div className="auth-container">
            <h2 className="auth-title">Tạo tài khoản</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Tên của bạn</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-input"
                        placeholder="Ví dụ: Nguyễn Văn A"
                        onChange={handleChange}
                        required
                    />
                </div>
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
                        placeholder="Ít nhất 6 ký tự"
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn">Đăng Ký</button>
            </form>
            {message && (
                <p className={`auth-message ${isError ? 'error' : 'success'}`}>
                    {message}
                </p>
            )}
            <p className="auth-switch">
                Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
            </p>
        </div>
    );
};

export default Signup;
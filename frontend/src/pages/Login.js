// src/pages/Login.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api'; // Đảm bảo đường dẫn đúng

// --- BƯỚC 1: IMPORT CÁC HOOK VÀ ACTION TỪ REDUX ---
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/slices/authSlice';

// --- BƯỚC 2: SỬ DỤNG LẠI CSS CŨ ---
import './AuthForm.css'; 

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // --- BƯỚC 3: KHỞI TẠO HOOK `useDispatch` ---
    const dispatch = useDispatch();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Xóa thông báo lỗi cũ
        try {
            const { data } = await loginUser(formData);

            // --- BƯỚC 4: CẬP NHẬT LOGIC XỬ LÝ SAU KHI LOGIN THÀNH CÔNG ---

            // 1. Vẫn lưu vào localStorage để duy trì đăng nhập khi người dùng F5
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('user', JSON.stringify(data.user));

            // 2. "Gửi" (dispatch) hành động `loginSuccess` đến Redux store.
            //    Payload của action này chính là dữ liệu cần lưu vào state.
            dispatch(loginSuccess({ 
                user: data.user, 
                accessToken: data.accessToken 
            }));

            // 3. Điều hướng người dùng đến trang profile
            navigate('/profile'); 
            
        } catch (error) {
            setMessage(error.response?.data?.message || 'Email hoặc mật khẩu không chính xác.');
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2 className="auth-title">Đăng Nhập</h2>
                
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
                    <div className="form-label-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <Link to="/forgot-password" className="forgot-password-link">Quên mật khẩu?</Link>
                    </div>
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
                
                <button type="submit" className="btn btn-primary">Đăng Nhập</button>
                
                <p className="auth-switch">
                    Chưa có tài khoản? <Link to="/signup">Tạo tài khoản mới</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
// src/pages/Home.js

import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // File CSS riêng cho trang chủ

const Home = () => {
    return (
        <div className="home-container">
            <h1 className="home-title">Chào mừng đến với Group18 Project</h1>
            <p className="home-subtitle">
                Một ứng dụng web hoàn chỉnh với hệ thống quản lý người dùng mạnh mẽ và bảo mật.
            </p>
            <div className="home-cta">
                <Link to="/signup" className="btn btn-primary">Bắt đầu ngay</Link>
                <Link to="/login" className="btn btn-secondary">Tôi đã có tài khoản</Link>
            </div>
        </div>
    );
};

export default Home;
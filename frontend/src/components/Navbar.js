// src/components/Navbar.js

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; 
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
        window.location.reload();
    };

    return (
        <header className="navbar">
            <div className="navbar-container">
                <NavLink to="/" className="nav-logo">
                    Group18 Project
                </NavLink>
                <nav className="nav-links">
                    <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
                        Trang Chủ
                    </NavLink>
                    
                    {user ? (
                        <>
                            {user.role === 'admin' && (
                                <NavLink to="/admin" className={({ isActive }) => (isActive ? 'active' : '')}>
                                    Admin Dashboard
                                </NavLink>
                            )}

                            {/* --- PHẦN SỬA ĐỔI --- */}

                            {/* Link Profile giờ chỉ là icon hoặc text ngắn */}
                            <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
                                Cá nhân
                            </NavLink>

                            {/* Nhóm Lời chào và Nút Đăng xuất vào một div */}
                            <div className="user-actions">
                                <span className="welcome-text">Chào, {user.name}</span>
                                <button onClick={handleLogout} className="nav-button logout">
                                    Đăng xuất
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>
                                Đăng Nhập
                            </NavLink>
                            <NavLink to="/signup" className={({ isActive }) => (isActive ? 'active' : '')}>
                                Đăng Ký
                            </NavLink>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
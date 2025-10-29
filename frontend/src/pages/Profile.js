// src/pages/Profile.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserProfile, logoutUser } from '../services/api';
import './Profile.css'; // Import file CSS mới

const Profile = () => {
    const [user, setUser] = useState({ name: '', email: '', avatar: '' });
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    
    // State cho việc upload avatar
    const [selectedFile, setSelectedFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await getUserProfile();
                setUser(data);
                setFormData({ name: data.name, email: data.email, password: '' });
                setAvatarPreview(data.avatar || 'https://via.placeholder.com/150'); // Avatar mặc định
            } catch (error) {
                // Xử lý khi token hết hạn hoặc lỗi
                handleLogout();
            }
        };

        if (!localStorage.getItem('accessToken')) {
            navigate('/login');
        } else {
            fetchProfile();
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            // Tạo preview cho ảnh được chọn
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    
    // Hàm này sẽ được kích hoạt khi nhấn nút "Đổi Avatar" ẩn
    const handleAvatarUpload = async () => {
        if (!selectedFile) return;
        // Logic gọi API upload avatar sẽ được thêm ở Hoạt động 3
        // Ví dụ: const apiFormData = new FormData();
        // apiFormData.append('avatar', selectedFile);
        // await uploadAvatar(apiFormData);
        
        // Giả lập thành công
        setMessage('Cập nhật ảnh đại diện thành công');
        setIsError(false);
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const dataToUpdate = {
                name: formData.name,
                email: formData.email,
            };
            if (formData.password) {
                dataToUpdate.password = formData.password;
            }
            await updateUserProfile(dataToUpdate);
            setMessage('Cập nhật thông tin thành công!');
            setIsError(false);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Có lỗi xảy ra!');
            setIsError(true);
        }
    };

    const handleLogout = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            if (refreshToken) await logoutUser(refreshToken);
        } catch (error) {
            console.error("Lỗi khi logout trên server:", error);
        }
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="profile-page-container">
            <div className="profile-card">
                <h2 className="profile-title">Trang thông tin cá nhân</h2>

                <div className="avatar-section">
                    <img src={avatarPreview} alt="Avatar" className="profile-avatar" />
                    {/* Input file ẩn đi, được kích hoạt bằng label */}
                    <input 
                        type="file" 
                        id="avatar-upload" 
                        style={{ display: 'none' }} 
                        onChange={handleFileChange} 
                        accept="image/*"
                    />
                    <label htmlFor="avatar-upload" className="btn-avatar-change">
                        Đổi Avatar
                    </label>
                    {/* Nút này có thể dùng để submit ảnh lên server */}
                    {selectedFile && <button onClick={handleAvatarUpload} className="btn-avatar-submit">Lưu thay đổi</button>}
                </div>

                <form className="profile-form" onSubmit={handleUpdateProfile}>
                    <div className="form-group">
                        <label htmlFor="name">Tên</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="form-input"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-input"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu mới</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-input"
                            placeholder="Bỏ trống nếu không muốn đổi"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">Cập nhật thông tin</button>
                    
                    {message && (
                        <p className={`profile-message ${isError ? 'error' : 'success'}`}>
                            {message}
                        </p>
                    )}
                </form>
                
                <button onClick={handleLogout} className="btn btn-logout">Đăng xuất</button>
            </div>
        </div>
    );
};

export default Profile;
// frontend/src/pages/Profile.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserProfile, uploadAvatar, logoutUser } from '../services/api'; 
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    
    const [avatarPreview, setAvatarPreview] = useState('https://i.pravatar.cc/150');
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await getUserProfile();
                setFormData({ name: data.name, email: data.email, password: '' });
                if (data.avatar) {
                    setAvatarPreview(data.avatar);
                }
            } catch (error) {
                console.error("Lỗi khi lấy profile:", error);
                localStorage.clear();
                navigate('/login');
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);
        try {
            const updateData = { ...formData };
            if (!updateData.password) {
                delete updateData.password;
            }
            const { data } = await updateUserProfile(updateData);
            setMessage('Cập nhật thông tin thành công!');
            
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const updatedUser = { ...storedUser, name: data.name, email: data.email };
            localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (error) {
            setMessage(error.response?.data?.message || 'Có lỗi xảy ra!');
            setIsError(true);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log("[DEBUG] File đã được chọn:", file); // Log file được chọn
            setSelectedFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleAvatarUpload = async () => {
        if (!selectedFile) {
            setMessage('Vui lòng chọn một ảnh trước.');
            setIsError(true);
            return;
        }

        // --- BƯỚC DEBUG QUAN TRỌNG NHẤT ---
        console.log("[DEBUG] Chuẩn bị upload. File đang được giữ trong state là:", selectedFile);
        
        const dataForm = new FormData();
        dataForm.append('avatar', selectedFile);

        // In ra nội dung của FormData để xác nhận
        for (let [key, value] of dataForm.entries()) {
            console.log(`[DEBUG] FormData entry: ${key}:`, value);
        }
        // ------------------------------------

        try {
            setMessage('Đang tải ảnh lên...');
            setIsError(false);
            console.log("[DEBUG] Bắt đầu gọi API uploadAvatar...");
            const { data } = await uploadAvatar(dataForm);
            
            console.log("[DEBUG] Upload thành công! Response từ server:", data);
            setMessage(data.message);
            setAvatarPreview(data.user.avatar);
            localStorage.setItem('user', JSON.stringify(data.user));
            setSelectedFile(null); // Reset lại sau khi upload thành công
        } catch (error) {
            console.error("[DEBUG] !!! LỖI KHI UPLOAD:", error);
            console.error("[DEBUG] Chi tiết lỗi từ Axios:", error.response); // In ra toàn bộ response lỗi
            setMessage(error.response?.data?.message || 'Upload thất bại!');
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
                    <input 
                        type="file" 
                        id="avatar-upload" 
                        style={{ display: 'none' }} 
                        onChange={handleFileChange} 
                        accept="image/*"
                    />
                    <label htmlFor="avatar-upload" className="btn-avatar-change">
                        Chọn ảnh...
                    </label>
                    {selectedFile && (
                        <button 
                            onClick={handleAvatarUpload}
                            className="btn-avatar-submit"
                            type="button"
                        >
                            Lưu thay đổi Avatar
                        </button>
                    )}
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
                            readOnly 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu mới</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-input"
                            placeholder="Bỏ trống nếu không đổi"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Cập nhật thông tin</button>
                </form>
                
                {message && (
                    <p className={`profile-message ${isError ? 'error' : 'success'}`}>
                        {message}
                    </p>
                )}

                <button 
                    onClick={handleLogout} 
                    className="btn btn-logout"
                    type="button"
                >
                    Đăng xuất
                </button>
            </div>
        </div>
    );
};

export default Profile;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signupUser } from '../services/api'; // Đảm bảo đường dẫn này đúng

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // Hàm cập nhật state khi người dùng nhập liệu
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Hàm xử lý khi form được submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Xóa thông báo cũ trước khi gửi request mới

        try {
            const response = await signupUser(formData);
            setMessage(response.data.message); // Hiển thị thông báo thành công từ API

            // Chuyển hướng đến trang đăng nhập sau 2 giây
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            // Xử lý lỗi một cách an toàn
            if (error.response) {
                // Lỗi đến từ server (ví dụ: email đã tồn tại)
                setMessage(error.response.data.message || 'Đã có lỗi từ server.');
            } else if (error.request) {
                // Lỗi không kết nối được tới server
                setMessage('Không thể kết nối đến server. Vui lòng kiểm tra lại backend!');
            } else {
                // Lỗi không xác định khác
                setMessage('Đã có lỗi xảy ra trong quá trình đăng ký.');
            }
            console.error("Lỗi khi đăng ký:", error); // Log lỗi ra console để debug
        }
    };

    return (
        <div>
            <h2>Đăng Ký Tài Khoản</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Tên:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nhập tên của bạn"
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Nhập email"
                        required
                    />
                </div>
                <div>
                    <label>Mật khẩu:</label>
                    <input
                        type="password"
                        name="password"
value={formData.password}
                        onChange={handleChange}
                        placeholder="Nhập mật khẩu"
                        required
                    />
                </div>
                <button type="submit">Đăng ký</button>
            </form>
            {/* Hiển thị thông báo */}
            {message && (
                <p style={{ color: message.includes('thành công') ? 'green' : 'red' }}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default Signup;
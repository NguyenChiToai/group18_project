import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api'; // Đảm bảo đường dẫn này đúng

const Login = () => {
    const [formData, setFormData] = useState({
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
        setMessage(''); // Xóa thông báo cũ

        try {
            const response = await loginUser(formData);

            // Lưu token vào Local Storage
            localStorage.setItem('token', response.data.token);

            setMessage('Đăng nhập thành công! Đang chuyển hướng...');

            // Chuyển hướng ngay lập tức đến trang profile
            navigate('/profile');

        } catch (error) {
            // Xử lý lỗi một cách an toàn
            if (error.response) {
                // Lỗi đến từ server (ví dụ: sai email/mật khẩu)
                setMessage(error.response.data.message || 'Đã có lỗi từ server.');
            } else if (error.request) {
                // Lỗi không kết nối được tới server
                setMessage('Không thể kết nối đến server. Vui lòng kiểm tra lại backend!');
            } else {
                // Lỗi không xác định khác
                setMessage('Đã có lỗi xảy ra trong quá trình đăng nhập.');
            }
            console.error("Lỗi khi đăng nhập:", error); // Log lỗi ra console để debug
        }
    };

    return (
        <div>
            <h2>Đăng Nhập</h2>
            <form onSubmit={handleSubmit}>
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
                <button type="submit">Đăng nhập</button>
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

export default Login;
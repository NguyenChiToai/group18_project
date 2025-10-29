// frontend/src/pages/AdminPage.js
import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../services/api'; // 1. Import hàm API
import './AdminPage.css'; // Import file CSS để làm đẹp

const AdminPage = () => {
    // 2. Tạo state để lưu danh sách người dùng
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // 3. Dùng useEffect để gọi API một lần khi component được render
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await getAllUsers();
                setUsers(data); // Lưu dữ liệu vào state
            } catch (err) {
                setError('Không thể tải danh sách người dùng. Bạn có phải là Admin?');
                console.error(err);
            } finally {
                setLoading(false); // Dù thành công hay thất bại cũng dừng loading
            }
        };

        fetchUsers();
    }, []); // Mảng rỗng [] đảm bảo useEffect chỉ chạy 1 lần

    // 4. Render giao diện dựa trên state
    if (loading) {
        return <div>Đang tải danh sách người dùng...</div>;
    }

    if (error) {
        return <div>Lỗi: {error}</div>;
    }

    return (
        <div className="admin-container">
            <h2>Admin Dashboard</h2>
            <p>Đây là trang chỉ dành cho Admin.</p>
            <h3>Danh sách người dùng:</h3>
            <table className="users-table">
                <thead>
                    <tr>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>Vai trò</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPage;
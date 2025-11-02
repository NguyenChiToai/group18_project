// frontend/src/pages/AdminPage.js

import React, { useState, useEffect } from 'react';
// 1. Import thêm hàm getAllLogs từ service API
import { getAllUsers, getAllLogs } from '../services/api'; 
import './AdminPage.css'; // Import file CSS để làm đẹp

const AdminPage = () => {
    // 2. Tạo state để lưu danh sách người dùng và logs
    const [users, setUsers] = useState([]);
    const [logs, setLogs] = useState([]); // <-- State mới cho logs
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // 3. Dùng useEffect để gọi API một lần khi component được render
    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                // Sử dụng Promise.all để gọi cả hai API cùng lúc, tăng hiệu suất
                const [usersResponse, logsResponse] = await Promise.all([
                    getAllUsers(),
                    getAllLogs()
                ]);
                
                setUsers(usersResponse.data); // Lưu dữ liệu users vào state
                setLogs(logsResponse.data);   // Lưu dữ liệu logs vào state

            } catch (err) {
                setError('Không thể tải dữ liệu. Bạn có phải là Admin không?');
                console.error("Lỗi khi tải dữ liệu admin:", err);
            } finally {
                setLoading(false); // Dù thành công hay thất bại cũng dừng loading
            }
        };

        fetchAdminData();
    }, []); // Mảng rỗng [] đảm bảo useEffect chỉ chạy 1 lần

    // 4. Render giao diện dựa trên state
    if (loading) {
        return <div className="loading-message">Đang tải dữ liệu Admin...</div>;
    }

    if (error) {
        return <div className="error-message">Lỗi: {error}</div>;
    }

    return (
        <div className="admin-container">
            <h1>Admin Dashboard</h1>
            <p>Trang quản lý dành cho Quản trị viên.</p>

            {/* --- PHẦN DANH SÁCH NGƯỜI DÙNG (Giữ nguyên) --- */}
            <div className="admin-section">
                <h2>Danh sách người dùng</h2>
                <div className="table-container">
                    <table className="admin-table">
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
                                    <td>
                                        <span className={`role-badge role-${user.role}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- PHẦN MỚI: NHẬT KÝ HOẠT ĐỘNG --- */}
            <div className="admin-section">
                <h2>Nhật ký hoạt động</h2>
                <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Thời gian</th>
                                <th>Người dùng</th>
                                <th>Hành động</th>
                                <th>Địa chỉ IP</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log._id}>
                                    <td>{new Date(log.timestamp).toLocaleString('vi-VN')}</td>
                                    <td>
                                        {log.user ? `${log.user.name} (${log.user.email})` : 'Không xác định'}
                                    </td>
                                    <td>{log.action}</td>
                                    <td>{log.ipAddress}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* 📸 **Thịnh chụp ảnh màn hình trang này lại nhé!** 
                Bức ảnh cần thấy rõ cả hai bảng "Danh sách người dùng" và "Nhật ký hoạt động".
            */}
        </div>
    );
};

export default AdminPage;
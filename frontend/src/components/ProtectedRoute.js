// src/components/ProtectedRoute.js

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, roles }) => {
    const location = useLocation(); // Lưu lại vị trí trang mà người dùng đang muốn vào

    // Lấy thông tin người dùng từ Local Storage
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    // --- LOGIC KIỂM TRA ---

    // 1. Kiểm tra xem người dùng đã đăng nhập chưa.
    // Nếu 'user' không tồn tại, tức là chưa đăng nhập.
    if (!user) {
        // Chuyển hướng người dùng về trang đăng nhập.
        // `state={{ from: location }}` để sau khi đăng nhập thành công, ta có thể quay lại trang họ muốn vào.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. Nếu route này có yêu cầu về vai trò (prop 'roles' được truyền vào)
    // thì kiểm tra xem vai trò của người dùng có nằm trong danh sách được phép không.
    if (roles && !roles.includes(user.role)) {
        // Nếu không có quyền, chuyển hướng về trang chủ.
        // Bạn cũng có thể tạo một trang "403 - Cấm truy cập" và chuyển hướng về đó.
        return <Navigate to="/" replace />;
    }

    // 3. Nếu vượt qua cả 2 lần kiểm tra, cho phép hiển thị nội dung của trang đó.
    // 'children' ở đây chính là component trang (ví dụ: <Profile /> hoặc <AdminPage />)
    return children;
};

export default ProtectedRoute;
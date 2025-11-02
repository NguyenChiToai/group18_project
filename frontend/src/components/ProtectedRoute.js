// src/components/ProtectedRoute.js

import React from 'react';
// === BƯỚC 1: IMPORT HOOK 'useSelector' TỪ 'react-redux' ===
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, roles }) => {
    const location = useLocation();

    // === BƯỚC 2: THAY THẾ LOGIC ĐỌC TỪ LOCALSTORAGE BẰNG useSelector ===
    // Hook 'useSelector' cho phép component "đăng ký" để lấy một phần của Redux state.
    // Khi state.auth thay đổi, component này sẽ tự động re-render.
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    // --- LOGIC KIỂM TRA MỚI ---

    // 1. Kiểm tra xem người dùng đã đăng nhập chưa, DỰA VÀO REDUX STATE.
    // 'isAuthenticated' là một boolean, code sẽ sạch hơn.
    if (!isAuthenticated) {
        // Chuyển hướng người dùng về trang đăng nhập.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. Nếu route yêu cầu vai trò, kiểm tra vai trò của user từ REDUX STATE.
    // 'user' bây giờ là một object lấy trực tiếp từ store.
    if (roles && !roles.includes(user.role)) {
        // Không có quyền, chuyển hướng về trang chủ.
        return <Navigate to="/" replace />;
    }

    // 3. Nếu mọi thứ ổn, cho phép hiển thị nội dung.
    return children;
};

export default ProtectedRoute;
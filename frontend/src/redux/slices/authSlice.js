// frontend/src/redux/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Lấy thông tin user từ localStorage để duy trì trạng thái đăng nhập khi F5
const user = JSON.parse(localStorage.getItem('user'));
const accessToken = localStorage.getItem('accessToken');

const initialState = {
    user: user ? user : null,
    accessToken: accessToken ? accessToken : null,
    isAuthenticated: user ? true : false,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    // "Reducers" là các hàm để cập nhật state
    reducers: {
        // Hành động khi đăng nhập thành công
        loginSuccess: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
        },
        // Hành động khi đăng xuất
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.accessToken = null;
        },
    },
});

// Export các actions để sử dụng trong các component
export const { loginSuccess, logout } = authSlice.actions;

// Export reducer để thêm vào store
export default authSlice.reducer;
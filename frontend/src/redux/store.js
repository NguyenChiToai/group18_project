// frontend/src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; // Import reducer từ slice

export const store = configureStore({
    reducer: {
        auth: authReducer, // Đăng ký auth slice với store
    },
});
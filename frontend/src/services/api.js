// frontend/src/services/api.js
import axios from 'axios';

const API = axios.create({ baseURL: 'http://10.10.10.237:5000/api' });

/**
 * AXIOS INTERCEPTORS
 * Đoạn code này đảm bảo mọi request đều được xác thực và có thể tự làm mới token.
 */

// Interceptor 1: Tự động đính kèm Access Token vào header của MỌI request gửi đi.
API.interceptors.request.use((req) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    req.headers.Authorization = `Bearer ${accessToken}`;
  }
  return req;
});

// Interceptor 2: Xử lý khi nhận về lỗi 401 (token hết hạn).
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            localStorage.clear();
            window.location.href = '/login';
            return Promise.reject(error);
        }
        
        const { data } = await API.post('/auth/refresh', { token: refreshToken });
        
        localStorage.setItem('accessToken', data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        
        return API(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// --- DANH SÁCH CÁC HÀM GỌI API ---

// 1. AUTHENTICATION
export const signupUser = (formData) => API.post('/auth/signup', formData);
export const loginUser = (formData) => API.post('/auth/login', formData);
export const logoutUser = (refreshToken) => API.post('/auth/logout', { token: refreshToken });

// 2. USER PROFILE
export const getUserProfile = () => API.get('/profile');
export const updateUserProfile = (userData) => API.put('/profile', userData);
// Hàm upload avatar gửi đi dưới dạng multipart/form-data. Interceptor sẽ tự gắn token.
export const uploadAvatar = (formData) => {
    return API.post('/profile/avatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

// 3. PASSWORD RESET
export const forgotPassword = (email) => API.post('/auth/forgot-password', { email });
export const resetPassword = (token, password) => API.post(`/auth/reset-password/${token}`, { password });

// 4. ADMIN
export const getAllUsers = () => API.get('/users');
export const deleteUserById = (userId) => API.delete(`/users/${userId}`);
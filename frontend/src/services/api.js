// frontend/src/services/api.js
import axios from 'axios';

// Giữ nguyên địa chỉ IP của bạn nếu cần test trên điện thoại,
// hoặc đổi về 'http://localhost:5000/api' khi phát triển trên máy tính.
const API = axios.create({ baseURL: 'http://192.168.110.200:5000/api' });

/**
 * AXIOS INTERCEPTORS
 * Đoạn code "phép thuật" này sẽ tự động đính kèm token vào mọi request
 * và tự động làm mới token khi nó hết hạn.
 */

// 1. Interceptor cho REQUEST (Gửi đi)
API.interceptors.request.use((req) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    req.headers.Authorization = `Bearer ${accessToken}`;
  }
  return req;
});

// 2. Interceptor cho RESPONSE (Nhận về)
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Nếu lỗi là 401 (Unauthorized) và request này chưa được thử lại
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
            return Promise.reject(error);
        }
        
        const { data } = await API.post('/auth/refresh', { token: refreshToken });
        
        localStorage.setItem('accessToken', data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        
        return API(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);


// =================================================================
// --- DANH SÁCH TẤT CẢ CÁC HÀM GỌI API CỦA ỨNG DỤNG ---
// =================================================================

/**
 * --- 1. AUTHENTICATION APIs ---
 */
export const signupUser = (formData) => API.post('/auth/signup', formData);
export const loginUser = (formData) => API.post('/auth/login', formData);
export const logoutUser = (refreshToken) => API.post('/auth/logout', { token: refreshToken });

/**
 * --- 2. USER PROFILE APIs ---
 */
export const getUserProfile = () => API.get('/profile');
export const updateUserProfile = (userData) => API.put('/profile', userData);
export const uploadAvatar = (formData) => API.post('/users/upload-avatar', formData, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

/**
 * --- 3. PASSWORD RESET APIs ---
 */
export const forgotPassword = (email) => API.post('/auth/forgot-password', { email });
export const resetPassword = (token, password) => API.post(`/auth/reset-password/${token}`, { password });

/**
* --- 4. ADMIN APIs ---
 */
export const getAllUsers = () => API.get('/users');
export const deleteUserById = (userId) => API.delete(`/users/${userId}`);

// Bạn có thể thêm các hàm API khác vào đây khi cần
// Ví dụ:
// export const promoteUserToAdmin = (userId) => API.put(`/users/${userId}/promote`);
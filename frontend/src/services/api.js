// src/services/api.js

import axios from 'axios';

// 1. Tạo một instance của axios với cấu hình cơ bản
const API = axios.create({
  baseURL: 'http://172.16.12.209:5000/api', // Đảm bảo URL này trỏ đến backend của Toại
});

// 2. Dòng quan trọng nhất: Export default cái instance này ra để sửa lỗi
export default API;

// 3. Viết và export các hàm gọi API cụ thể (sử dụng instance API ở trên)
export const signupUser = (formData) => API.post('/auth/signup', formData);

export const loginUser = (formData) => API.post('/auth/login', formData);
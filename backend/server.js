// backend/server.js

// DÒNG NÀY PHẢI NẰM Ở TRÊN CÙNG
require('dotenv').config(); 

// 1. Import các thư viện cần thiết
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// 2. Import routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');

// 3. Khởi tạo ứng dụng Express
const app = express();

// 4. Kết nối Database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB database connected successfully!');
  } catch (error)
  {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};
connectDB();

// 5. CẤU HÌNH MIDDLEWARE TOÀN CỤC (GLOBAL MIDDLEWARES)
// *** ĐÂY LÀ PHẦN QUAN TRỌNG NHẤT CẦN SỬA ***
// Các middleware này phải được định nghĩa TRƯỚC khi định nghĩa các routes.
// Chúng sẽ được áp dụng cho MỌI request đi vào server.

app.use(cors()); // Cho phép cross-origin requests

// Middleware để Express có thể đọc và xử lý body của request dạng JSON.
// Bắt buộc phải có cho các API như login, signup...
app.use(express.json({ limit: '50mb' }));

// Middleware để Express có thể xử lý dữ liệu từ form HTML truyền thống.
app.use(express.urlencoded({ limit: '50mb', extended: true }));


// `multer` khi được gọi trong `profileRoutes` sẽ tự biết cách xử lý
// request `multipart/form-data` và sẽ không bị xung đột với `express.json()`.
// Đây là luồng hoạt động chuẩn của Express.

// 6. ĐỊNH NGHĨA CÁC ROUTES
// Tất cả các routes được định nghĩa SAU khi đã có các middleware cần thiết.
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes); // Route chứa upload file cũng đặt ở đây

// Route cơ bản để kiểm tra server
app.get('/', (req, res) => {
  res.send('API server for Group 18 is running!');
});

// 7. Khởi chạy Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
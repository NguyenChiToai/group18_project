// backend/server.js

// DÒNG NÀY PHẢI NẰM Ở TRÊN CÙNG
require('dotenv').config(); 

// 1. Import các thư viện
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// 2. Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');

// 3. Khởi tạo ứng dụng Express
const app = express();

// 4. Kết nối Database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB database connected successfully!');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};
connectDB();

// 5. Cấu hình các Middleware toàn cục (phải nằm trước routes)
app.use(cors()); // Cho phép cross-origin requests
app.use(express.json()); // Cho phép server đọc body dạng JSON
app.use(express.urlencoded({ extended: true })); // Cho phép server đọc body từ form

// 6. Định nghĩa các Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);

// Route cơ bản để kiểm tra server có chạy không
app.get('/', (req, res) => {
  res.send('API server for Group 18 is running!');
});

// 7. Khởi chạy Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
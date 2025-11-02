// backend/server.js

// DÒNG NÀY PHẢI LUÔN NẰM Ở TRÊN CÙNG ĐỂ NẠP BIẾN MÔI TRƯỜNG
require('dotenv').config(); 

// 1. IMPORT CÁC THƯ VIỆN CẦN THIẾT
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// 2. IMPORT CÁC FILE ROUTE
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const logRoutes = require('./routes/logRoutes'); // <-- DÒNG MỚI 1: Import logRoutes

// 3. KHỞI TẠO ỨNG DỤNG EXPRESS
const app = express();

// 4. KẾT NỐI ĐẾN MONGODB ATLAS
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB database connected successfully!');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    // Thoát khỏi tiến trình với mã lỗi 1 nếu không kết nối được DB
    process.exit(1); 
  }
};
connectDB();

// 5. CẤU HÌNH CÁC MIDDLEWARE TOÀN CỤC
// =================================================================

// 5.1. Cấu hình CORS nâng cao và linh hoạt
const allowedOrigins = [
    'http://localhost:3000',      // <<-- BẮT BUỘC PHẢI CÓ DÒNG NÀY CHO THỊNH
    'http://10.10.10.237:3000'    // <<-- Giữ lại dòng này để bạn (Toại) có thể test
];

app.use(cors({
  origin: function (origin, callback) {
    // Log này sẽ giúp bạn debug xem origin của request là gì
    console.log(`[CORS] Request đến từ Origin: ${origin}`);

    // Cho phép các request không có origin (như từ Postman/Thunder Client)
    // Hoặc các request có origin nằm trong danh sách allowedOrigins
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Nếu không, từ chối
      console.error(`[CORS] >> TỪ CHỐI: Origin '${origin}' không được phép.`);
      callback(new Error('Chính sách CORS không cho phép truy cập từ nguồn gốc này.'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// 5.2. Middleware để đọc JSON và URL-encoded bodies từ request
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


// 6. ĐỊNH NGHĨA CÁC ROUTE API CHÍNH
// =================================================================
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/logs', logRoutes); // <-- DÒNG MỚI 2: Sử dụng logRoutes

// Route mặc định để kiểm tra server có đang hoạt động không
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API server for Group 18 is running!' });
});

// 7. KHỞI CHẠY SERVER
// =================================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
});
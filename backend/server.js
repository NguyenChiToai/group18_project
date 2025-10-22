// Import các thư viện cần thiết
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // Kích hoạt dotenv để đọc file .env ở trên cùng

// Import routes
// userRoutes có thể dùng cho các chức năng quản lý người dùng của Admin sau này
const userRoutes = require('./routes/userRoutes'); 
// Thêm authRoutes cho chức năng Đăng ký, Đăng nhập
const authRoutes = require('./routes/authRoutes');

const app = express();

// --- MIDDLEWARE ---
app.use(cors()); // Cho phép cross-origin requests
app.use(express.json()); // Cho phép server nhận và xử lý dữ liệu JSON

// --- KẾT NỐI DATABASE (Sử dụng Async/Await để code sạch hơn) ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB database connected successfully!');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    // Thoát khỏi ứng dụng nếu không thể kết nối tới DB
    process.exit(1); 
  }
};
connectDB();
// ----------------------------------------------------------------

// --- ROUTES ---
// Sử dụng authRoutes cho các endpoint liên quan đến xác thực
// Ví dụ: /api/auth/signup, /api/auth/login
app.use('/api/auth', authRoutes);

// Giữ lại userRoutes của bạn, có thể dùng cho các chức năng của admin sau này
// Ví dụ: /api/users/ (lấy tất cả user), /api/users/:id (xóa user)
app.use('/api/users', userRoutes);

app.use('/api/auth', require('./routes/authRoutes'));

app.use('/api/profile', require('./routes/profileRoutes'));

// Route cơ bản để kiểm tra server có hoạt động không
app.get('/', (req, res) => {
  res.send('API server for Group 18 is running!');
});
// ---------------------------------------------------------------

// Lấy PORT từ file .env, nếu không có thì mặc định là 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// backend/server.js

// 1. Import các thư viện cần thiết
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// 2. Cấu hình .env
dotenv.config();

// 3. Khởi tạo express app
const app = express();

// 4. Sử dụng các middleware
app.use(cors());          // Cho phép cross-origin requests
app.use(express.json());  // Parse JSON bodies

// 5. Route kiểm tra đơn giản
app.get('/', (req, res) => {
  res.send('API is running...');
});

// 6. Lấy port từ file .env hoặc dùng port 3000 mặc định
const PORT = process.env.PORT || 3000;

// 7. Khởi động server
app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});
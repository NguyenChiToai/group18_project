// backend/server.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Import mongoose
require('dotenv').config(); // Kích hoạt dotenv để đọc file .env

const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// --- KẾT NỐI DATABASE ---
console.log("Chuỗi kết nối ĐANG ĐƯỢC SỬ DỤNG LÀ:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB database connected successfully!');
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
  });
// -------------------------

app.use('/api/users', userRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
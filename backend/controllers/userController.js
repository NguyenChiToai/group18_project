// backend/controllers/userController.js

const User = require('../models/User'); // Import User model

// Lấy tất cả user từ database
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Tạo một user mới và lưu vào database
const createUser = async (req, res) => {
  const { name, email } = req.body;

  try {
    const newUser = await User.create({
      name,
      email,
    });
    res.status(201).json(newUser);
  } catch (error) {
    // Xử lý lỗi nếu email bị trùng
    if (error.code === 11000) {
        return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getUsers,
  createUser,
};
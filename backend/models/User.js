const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true, // Đảm bảo mỗi email là duy nhất
    },
  },
  {
    timestamps: true, // Tự động tạo 2 trường createdAt và updatedAt
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
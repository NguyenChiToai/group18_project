const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên'],
    },
    email: {
      type: String,
      required: [true, 'Vui lòng nhập email'],
      unique: true, // Đảm bảo mỗi email là duy nhất
      lowercase: true, // Tự động chuyển email về chữ thường
      match: [ // Kiểm tra định dạng email hợp lệ
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Vui lòng nhập một địa chỉ email hợp lệ'
      ]
    },
    password: {
      type: String,
      required: [true, 'Vui lòng nhập mật khẩu'],
      minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
      select: false, // Quan trọng: Không trả về trường password trong các câu truy vấn find()
    },
    role: {
      type: String,
      enum: ['user', 'admin'], // Chỉ cho phép 2 giá trị này
      default: 'user', // Giá trị mặc định khi tạo user mới
    },
    avatar: {
        type: String,
        default: 'https://i.pravatar.cc/150' // Một ảnh đại diện mặc định
    }
  },
  {
    timestamps: true, // Tự động tạo 2 trường createdAt và updatedAt
  }
);

// Middleware: Tự động HASH mật khẩu trước khi lưu vào DB
// Chỉ chạy khi password được tạo mới hoặc bị thay đổi
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  // Hash the password with cost of 10
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance Method: Tạo một phương thức để so sánh mật khẩu người dùng nhập với mật khẩu đã hash trong DB
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
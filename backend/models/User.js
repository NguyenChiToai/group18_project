const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // Dùng để tạo token reset password

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên'],
    },
    email: {
      type: String,
      required: [true, 'Vui lòng nhập email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Vui lòng nhập một địa chỉ email hợp lệ',
      ],
    },
    password: {
      type: String,
      required: [true, 'Vui lòng nhập mật khẩu'],
      minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
      select: false, // Mặc định không trả về trường password khi query
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'moderator'],
      default: 'user',
    },
    avatar: {
      type: String,
      default: 'https://i.pravatar.cc/150', // Một ảnh mặc định
    },
    // Trường dùng cho tính năng quên mật khẩu
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

/**
 * Middleware: Tự động mã hóa mật khẩu trước khi lưu vào DB
 */
userSchema.pre('save', async function (next) {
  // Chỉ chạy nếu trường password bị thay đổi
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Method: So sánh mật khẩu người dùng nhập với mật khẩu đã hash trong DB
 * @param {string} enteredPassword - Mật khẩu người dùng nhập vào form
 * @returns {Promise<boolean>} - True nếu mật khẩu khớp, ngược lại là false
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  // Vì password có select: false, nó sẽ không tồn tại trên `this`
  // nên chúng ta không thể dùng this.password ở đây.
  // Method này cần được gọi trên một document đã có sẵn trường password.
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Method: Tạo và hash token để reset password
 * @returns {string} - Token gốc (chưa hash) để gửi cho người dùng qua email
 */
userSchema.methods.getResetPasswordToken = function () {
  // 1. Tạo một token ngẫu nhiên (dạng chuỗi hex)
  const resetToken = crypto.randomBytes(20).toString('hex');

  // 2. Hash token này bằng thuật toán SHA256 và lưu vào DB
  // Chúng ta lưu phiên bản đã hash để tăng cường bảo mật.
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // 3. Đặt thời gian hết hạn cho token là 10 phút kể từ bây giờ
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  // 4. Trả về token gốc. Token này sẽ được gắn vào URL và gửi cho người dùng.
  // Khi người dùng click link, chúng ta sẽ lấy token từ URL, hash nó lại
  // và so sánh với giá trị đã lưu trong DB.
  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
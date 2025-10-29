const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // THÊM MỚI: Dùng để tạo token

const userSchema = new mongoose.Schema(
  {
    // ... (name, email, password, role, avatar giữ nguyên)
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
        'Vui lòng nhập một địa chỉ email hợp lệ'
      ]
    },
    password: {
      type: String,
      required: [true, 'Vui lòng nhập mật khẩu'],
      minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin','moderator'],
      default: 'user',
    },
    avatar: {
        type: String,
        default: 'https://i.pravatar.cc/150'
    },
    // THÊM MỚI 2 TRƯỜNG DƯỚI ĐÂY
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// ... (Middleware 'pre save' và method 'matchPassword' giữ nguyên)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


// THÊM MỚI: Instance Method để tạo và hash token reset password
userSchema.methods.getResetPasswordToken = function() {
  // 1. Tạo token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // 2. Hash token và gán vào trường resetPasswordToken
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // 3. Đặt thời gian hết hạn (10 phút)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  // 4. Trả về token gốc (chưa hash) để gửi cho người dùng
  return resetToken;
};


const User = mongoose.model('User', userSchema);
module.exports = User;
// backend/controllers/userController.js

// Khởi tạo một mảng tạm để lưu trữ dữ liệu người dùng.
// Sau này, chúng ta sẽ thay thế mảng này bằng MongoDB.
let users = [
  { id: 1, name: 'Nguyễn Chí Toại', email: 'toai.nc@example.com' },
  { id: 2, name: 'Hồng Phước Thịnh', email: 'thinh.hp@example.com' },
];

// @desc    Lấy tất cả người dùng
// @route   GET /api/users
const getUsers = (req, res) => {
  res.status(200).json(users);
};

// @desc    Tạo một người dùng mới
// @route   POST /api/users
const createUser = (req, res) => {
  // Lấy name và email từ body của request
  const { name, email } = req.body;

  // Kiểm tra đơn giản xem có name và email không
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  // Tạo một user mới với id tự tăng
  const newUser = { 
    id: users.length > 0 ? users[users.length - 1].id + 1 : 1, 
    name, 
    email 
  };

  users.push(newUser);
  res.status(201).json(newUser); // Trả về user vừa tạo với status 201 (Created)
};

// Xuất các hàm này ra để file route có thể sử dụng
module.exports = { getUsers, createUser };
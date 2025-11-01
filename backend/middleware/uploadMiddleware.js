// backend/middleware/uploadMiddleware.js
const multer = require('multer');

// Lưu file vào bộ nhớ RAM thay vì lưu ra đĩa
const storage = multer.memoryStorage();

// Lọc chỉ cho phép file ảnh
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận file ảnh!'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });
module.exports = upload;
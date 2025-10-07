// backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
// SỬA LẠI ĐƯỜNG DẪN Ở ĐÂY
const { getUsers, createUser } = require('../controllers/userController');

router.route('/').get(getUsers).post(createUser);

module.exports = router;
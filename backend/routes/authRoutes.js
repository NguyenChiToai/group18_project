// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { loginLimiter } = require('../middleware/rateLimitMiddleware');

// Middleware để parse body JSON
router.use(express.json());

// Auth routes
router.post('/signup', authController.signup);
router.post('/login', loginLimiter, authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refreshToken);

// Forgot Password routes
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;
// routes/user.routes.js

const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const AuthMiddleware = require('../middleware/auth');

// Public routes
router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);

// Protected routes
router.get('/', AuthMiddleware.authenticateToken, UserController.getAllUsers);

module.exports = router;

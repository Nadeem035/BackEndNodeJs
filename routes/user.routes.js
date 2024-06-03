// routes/user.routes.js

const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();


const UserController = require('../controllers/user.controller');
const AuthMiddleware = require('../middleware/auth');


// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory where images will be saved
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append the original extension
    }
});
const upload = multer({ storage });

// Public routes
router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);

// Protected routes
router.get('/', AuthMiddleware.authenticateToken, UserController.getAllUsers);
router.post('/changepassword', AuthMiddleware.authenticateToken, UserController.changePassword);

router.post('/profile', upload.single('profileImage'), UserController.profile);



module.exports = router;

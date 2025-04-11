const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const userAuthController = require('../controllers/UserAuthController');

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profile-pictures/'); // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for image files only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // Limit to 2MB
  }
});

// User registration route with file upload
router.post('/register', upload.single('profile_picture'), userAuthController.registerUser);

// User login route
router.post('/login', userAuthController.loginUser);

// Forgot password route
router.post('/forgot-password', userAuthController.forgotPassword);

// Reset password route
router.post('/reset-password/:token', userAuthController.resetPassword);

// Get all users route
router.get('/users', userAuthController.getAllUsers);

// Get a single user by ID route
router.get('/users/:id', userAuthController.getUserById);

// Update a user by ID route with optional file upload
router.put('/users/:id', upload.single('profile_picture'), userAuthController.updateUser);

// Delete a user by ID route
router.delete('/users/:id', userAuthController.deleteUser);

// Fetch user profile route
router.get('/profile', userAuthController.getUserProfile);

// Update user profile route with optional file upload
router.put('/profile', upload.single('profile_picture'), userAuthController.updateProfile);

module.exports = router;
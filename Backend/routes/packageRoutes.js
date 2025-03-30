const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');
const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`);
    }
  });
  
  // Create the multer upload instance
  const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    },
    limits: {
      fileSize: 5 * 1024 * 1024 // Limit file size to 5MB
    }
  });
  
// Package CRUD routes
router.get('/', packageController.getAllPackages);
router.get('/:id', packageController.getPackageById);
router.post('/', packageController.createPackage);
router.put('/:id', packageController.updatePackage);
router.delete('/:id', packageController.deletePackage);
  // Add image upload route
  router.post('/upload', upload.single('image'), packageController.uploadImage);

// Customization route
router.post('/:id/customize-v2', packageController.customizePackageV2);

module.exports = router;
const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');

// Package CRUD routes
router.get('/', packageController.getAllPackages);
router.get('/:id', packageController.getPackageById);
router.post('/', packageController.createPackage);
router.put('/:id', packageController.updatePackage);
router.delete('/:id', packageController.deletePackage);

// Customization route
router.post('/:id/customize-v2', packageController.customizePackageV2);

module.exports = router;
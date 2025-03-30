const TourPackage = require('../models/TourPackage');
const RecommendationService = require('../services/recommendationService');
const { validatePackageInput } = require('../utils/validation');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = 'uploads/';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`);
  }
});

// Filter only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create the multer upload instance
const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limit file size to 5MB
  }
});

// Handle image upload
exports.uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Create the URL for the uploaded file
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    res.status(200).json({
      message: 'Image uploaded successfully',
      imageUrl
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all packages
exports.getAllPackages = async (req, res) => {
  try {
    const packages = await TourPackage.find();
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single package by ID
exports.getPackageById = async (req, res) => {
  try {
    const package = await TourPackage.findById(req.params.id);
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.status(200).json(package);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new package
exports.createPackage = async (req, res) => {
  try {
    const newPackage = new TourPackage(req.body);
    await newPackage.save();
    res.status(201).json(newPackage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an existing package
exports.updatePackage = async (req, res) => {
  try {
    const updatedPackage = await TourPackage.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    
    if (!updatedPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.status(200).json(updatedPackage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a package
exports.deletePackage = async (req, res) => {
  try {
    const deletedPackage = await TourPackage.findByIdAndDelete(req.params.id);
    if (!deletedPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.status(200).json({ message: 'Package deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controllers/packageController.js
const MLRecommendationService = require('../services/mlRecommendService');

exports.customizePackageV2 = async (req, res) => {
  const { id } = req.params;
  const { 
    age, 
    gender, 
    placeType = [], 
    hobby = [], 
    climate, 
    diseases = [], 
    physicalDisorders = [] 
  } = req.body;

  try {
    // Validate input
    if (!age || isNaN(age)) {
      return res.status(400).json({ message: 'Valid age is required' });
    }

    const selectedPackage = await TourPackage.findById(id);
    if (!selectedPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }

    const userPreferences = {
      age: parseInt(age),
      gender,
      placeType,
      hobby,
      climate,
      diseases,
      physicalDisorders
    };

    // Get ML-powered recommendations
    const mlRecommendations = await MLRecommendationService.getRecommendations(
      userPreferences,
      selectedPackage.places
    );

    // Format response
    const response = {
      package: {
        id: selectedPackage._id,
        name: selectedPackage.name
      },
      userPreferences,
      recommendations: mlRecommendations.map(place => ({
        id: place._id,
        name: place.name,
        mlScore: place.mlScore.toFixed(1),
        whyRecommended: this.getMLRecommendationReason(place, userPreferences),
        images: place.images || [] 
      })),
      algorithm: "machine_learning",
      modelVersion: "1.0"
    };

    res.json(response);
  } catch (error) {
    console.error('ML Recommendation error:', error);
    res.status(500).json({ 
      message: 'Failed to generate recommendations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getMLRecommendationReason = (place, preferences) => {
  const reasons = [];
  
  if (place.mlScore > 80) reasons.push("Highly recommended by our AI model");
  else if (place.mlScore > 60) reasons.push("Strong match according to our algorithm");
  else reasons.push("Moderate match based on your preferences");
  
  if (preferences.placeType?.length && place.placeType) {
    const matches = preferences.placeType.filter(type => 
      place.placeType.includes(type));
    if (matches.length) {
      reasons.push(`Matches your preferred place types: ${matches.join(', ')}`);
    }
  }
  
  return reasons.length > 0 ? reasons.join('. ') : "Recommended based on similar users";
};
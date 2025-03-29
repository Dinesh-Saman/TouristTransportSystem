const mongoose = require('mongoose');

const healthConsiderationSchema = new mongoose.Schema({
  notRecommendedFor: {
    type: [String],
    enum: ['Cough', 'Fever', 'Headache', 'Back Pain', 'Asthma', 'Knee Pain', 'Heart Condition'],
    default: []
  },
  specialFacilities: {
    type: [String],
    enum: ['Wheelchair Access', 'Elevators', 'Rest Areas', 'Medical Support', 'Shuttle Service'],
    default: []
  }
});

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: [String],
  placeType: {
    type: [String],
    enum: ['Beach', 'Mountains', 'Waterfalls', 'Religious', 'Historical', 'Urban', 'Wildlife'],
    required: true
  },
  suitableFor: {
    ageRange: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 100 }
    },
    genderNeutral: { type: Boolean, default: true },
    hobbies: {
      type: [String],
      enum: ['Hiking', 'Surfing', 'Camping', 'Sightseeing', 'Adventure', 'Photography', 'Shopping', 'Relaxation'],
      default: []
    },
    climate: {
      type: [String],
      enum: ['Tropical', 'Temperate', 'Arid', 'Cold'],
      default: ['Temperate']
    },
    healthConsiderations: healthConsiderationSchema
  },
  location: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number]
  }
});

const tourPackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  packageImage: { 
    type: String,
    required: true
  },
  district: { 
    type: String,
    required: true,
    enum: ['Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya', 'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee', 'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla', 'Monaragala', 'Ratnapura', 'Kegalle']
  },
  places: [placeSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add 2dsphere index for geospatial queries
tourPackageSchema.index({ 'places.location': '2dsphere' });

// Update the updatedAt field before saving
tourPackageSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('TourPackage', tourPackageSchema);
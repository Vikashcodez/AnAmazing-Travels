const mongoose = require('mongoose');

// Location Schema
const locationSchema = new mongoose.Schema({
  destinationName: {
    type: String,
    required: [true, 'Destination name is required'],
    trim: true,
    maxLength: [100, 'Destination name cannot exceed 100 characters'],
    minLength: [2, 'Destination name must be at least 2 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxLength: [1000, 'Description cannot exceed 1000 characters'],
    minLength: [10, 'Description must be at least 10 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['south-andaman', 'north-andaman', 'middle-andaman'],
      message: 'Category must be either south-andaman, north-andaman, or middle-andaman'
    }
  },
  thumbnailUrl: {
    type: String,
    required: [true, 'Thumbnail URL is required']
  },
  thumbnailFileName: {
    type: String,
    required: [true, 'Thumbnail file name is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  coordinates: {
    latitude: {
      type: Number,
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90']
    },
    longitude: {
      type: Number,
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180']
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
locationSchema.index({ category: 1 });
locationSchema.index({ createdAt: -1 });
locationSchema.index({ featured: -1, createdAt: -1 });
locationSchema.index({ isActive: 1 });
locationSchema.index({ 'coordinates.latitude': 1, 'coordinates.longitude': 1 });

// Virtual for category display name
locationSchema.virtual('categoryDisplayName').get(function() {
  const categoryMap = {
    'south-andaman': 'South Andaman',
    'north-andaman': 'North Andaman',
    'middle-andaman': 'Middle Andaman'
  };
  return categoryMap[this.category] || this.category;
});

// Virtual for short description
locationSchema.virtual('shortDescription').get(function() {
  return this.description.length > 150 
    ? this.description.substring(0, 150) + '...' 
    : this.description;
});

// Pre-save middleware to update the updatedAt field
locationSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.updatedAt = Date.now();
  }
  next();
});

// Pre-save middleware to generate slug from destination name
locationSchema.pre('save', function(next) {
  if (this.isModified('destinationName')) {
    this.slug = this.destinationName
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .trim();
  }
  next();
});

// Static method to get locations by category
locationSchema.statics.getByCategory = function(category) {
  return this.find({ 
    category: category, 
    isActive: true 
  }).sort({ createdAt: -1 });
};

// Static method to get featured locations
locationSchema.statics.getFeatured = function() {
  return this.find({ 
    featured: true, 
    isActive: true 
  }).sort({ createdAt: -1 });
};

// Static method to get popular locations (by views)
locationSchema.statics.getPopular = function(limit = 10) {
  return this.find({ 
    isActive: true 
  }).sort({ views: -1 }).limit(limit);
};

// Instance method to increment views
locationSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Instance method to toggle featured status
locationSchema.methods.toggleFeatured = function() {
  this.featured = !this.featured;
  return this.save();
};

// Instance method to deactivate location (soft delete)
locationSchema.methods.deactivate = function() {
  this.isActive = false;
  return this.save();
};

// Add slug field
locationSchema.add({
  slug: {
    type: String,
    unique: true,
    sparse: true
  }
});

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
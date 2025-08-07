const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Location = require('../models/Destination');

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/locations');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const fileName = 'location-' + uniqueSuffix + ext;
    cb(null, fileName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 1
  }
});

// Helper function to delete files
const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  }
};

// Validation middleware
const validateLocationData = (req, res, next) => {
  const { destinationName, description, category } = req.body;
  
  if (!destinationName || destinationName.trim().length < 2) {
    return res.status(400).json({ 
      success: false,
      error: 'Validation Error',
      message: 'Destination name is required and must be at least 2 characters' 
    });
  }
  
  if (!description || description.trim().length < 10) {
    return res.status(400).json({ 
      success: false,
      error: 'Validation Error',
      message: 'Description is required and must be at least 10 characters' 
    });
  }
  
  const validCategories = ['south-andaman', 'north-andaman', 'middle-andaman'];
  if (!category || !validCategories.includes(category)) {
    return res.status(400).json({ 
      success: false,
      error: 'Validation Error',
      message: 'Valid category is required (south-andaman, north-andaman, or middle-andaman)' 
    });
  }
  
  next();
};

// @route   POST /api/destinations
// @desc    Create new location
router.post('/', upload.single('thumbnail'), validateLocationData, async (req, res) => {
  try {
    const { destinationName, description, category, tags } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'Validation Error',
        message: 'Thumbnail image is required' 
      });
    }

    // Create location data with all required fields
    const locationData = {
      destinationName: destinationName.trim(),
      description: description.trim(),
      category,
      thumbnailUrl: `/uploads/locations/${req.file.filename}`,
      thumbnailFileName: req.file.filename, // Required field
      thumbnailPath: req.file.path,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    };

    const newLocation = new Location(locationData);
    const savedLocation = await newLocation.save();
    
    res.status(201).json({
      success: true,
      message: 'Location created successfully',
      data: savedLocation
    });
    
  } catch (error) {
    console.error('Error creating location:', error);
    
    // Clean up uploaded file if error occurs
    if (req.file) {
      deleteFile(req.file.path);
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false,
        error: 'Validation failed',
        messages: errors 
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        error: 'Duplicate Error',
        message: 'Location with this name already exists' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Server Error',
      message: 'Failed to create location' 
    });
  }
});

// @route   PUT /api/destinations/:id
// @desc    Update location
router.put('/:id', upload.single('thumbnail'), validateLocationData, async (req, res) => {
  try {
    const existingLocation = await Location.findById(req.params.id);
    if (!existingLocation) {
      if (req.file) deleteFile(req.file.path);
      return res.status(404).json({ 
        success: false,
        error: 'Not Found',
        message: 'Location not found' 
      });
    }

    const { destinationName, description, category, tags } = req.body;
    
    const updateData = {
      destinationName: destinationName.trim(),
      description: description.trim(),
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : existingLocation.tags
    };

    // Handle file upload if new thumbnail provided
    if (req.file) {
      // Delete old thumbnail
      deleteFile(path.join(__dirname, '../../', existingLocation.thumbnailUrl));
      
      // Update with new thumbnail data
      updateData.thumbnailUrl = `/uploads/locations/${req.file.filename}`;
      updateData.thumbnailFileName = req.file.filename;
      updateData.thumbnailPath = req.file.path;
    }

    const updatedLocation = await Location.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');
    
    res.json({
      success: true,
      message: 'Location updated successfully',
      data: updatedLocation
    });
    
  } catch (error) {
    console.error('Error updating location:', error);
    
    if (req.file) deleteFile(req.file.path);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false,
        error: 'Validation failed',
        messages: errors 
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid ID',
        message: 'Invalid location ID format' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Server Error',
      message: 'Failed to update location' 
    });
  }
});

// @route   GET /api/destinations
// @desc    Get all locations (for admin)
router.get('/', async (req, res) => {
  try {
    const locations = await Location.find({})
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      data: locations
    });
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server Error',
      message: 'Failed to fetch locations' 
    });
  }
});

// @route   GET /api/destinations/:id
// @desc    Get single location
router.get('/:id', async (req, res) => {
  try {
    const location = await Location.findById(req.params.id).select('-__v');
    
    if (!location) {
      return res.status(404).json({ 
        success: false,
        error: 'Not Found',
        message: 'Location not found' 
      });
    }
    
    res.json({
      success: true,
      data: location
    });
  } catch (error) {
    console.error('Error fetching location:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid ID',
        message: 'Invalid location ID format' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Server Error',
      message: 'Failed to fetch location' 
    });
  }
});

// @route   DELETE /api/destinations/:id
// @desc    Delete location
router.delete('/:id', async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({ 
        success: false,
        error: 'Not Found',
        message: 'Location not found' 
      });
    }

    // Delete associated thumbnail file
    if (location.thumbnailPath) {
      deleteFile(location.thumbnailPath);
    }
    
    await Location.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Location deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting location:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid ID',
        message: 'Invalid location ID format' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Server Error',
      message: 'Failed to delete location' 
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    let message = 'File upload error';
    if (error.code === 'LIMIT_FILE_SIZE') {
      message = 'File too large. Maximum size is 10MB.';
    } else if (error.code === 'LIMIT_FILE_COUNT') {
      message = 'Too many files. Only one file allowed.';
    }
    
    return res.status(400).json({ 
      success: false,
      error: 'Upload Error',
      message 
    });
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({ 
      success: false,
      error: 'Invalid File',
      message: 'Only image files (JPEG, PNG, GIF, WebP) are allowed!' 
    });
  }
  
  next(error);
});

module.exports = router;
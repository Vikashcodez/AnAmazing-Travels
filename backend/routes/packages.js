const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Package = require('../models/Package');
const fs = require('fs');

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/packages/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// GET all packages
router.get('/', async (req, res) => {
  try {
    const packages = await Package.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: packages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching packages',
      error: error.message
    });
  }
});

// GET single package
router.get('/:id', async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);
    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }
    res.json({
      success: true,
      data: package
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching package',
      error: error.message
    });
  }
});

// POST create new package
router.post('/', upload.single('thumbnail'), async (req, res) => {
  try {
    const {
      packageName,
      shortDescription,
      numberOfDays,
      numberOfNights,
      price,
      detailedDescription
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Thumbnail image is required'
      });
    }

    const newPackage = new Package({
      packageName,
      thumbnail: req.file.path,
      shortDescription,
      numberOfDays: parseInt(numberOfDays),
      numberOfNights: parseInt(numberOfNights),
      price: parseFloat(price),
      detailedDescription
    });

    await newPackage.save();

    res.status(201).json({
      success: true,
      message: 'Package created successfully',
      data: newPackage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating package',
      error: error.message
    });
  }
});

// PUT update package
router.put('/:id', upload.single('thumbnail'), async (req, res) => {
  try {
    const {
      packageName,
      shortDescription,
      numberOfDays,
      numberOfNights,
      price,
      detailedDescription
    } = req.body;

    const updateData = {
      packageName,
      shortDescription,
      numberOfDays: parseInt(numberOfDays),
      numberOfNights: parseInt(numberOfNights),
      price: parseFloat(price),
      detailedDescription
    };

    if (req.file) {
      // Delete old thumbnail if exists
      const existingPackage = await Package.findById(req.params.id);
      if (existingPackage && existingPackage.thumbnail) {
        if (fs.existsSync(existingPackage.thumbnail)) {
          fs.unlinkSync(existingPackage.thumbnail);
        }
      }
      updateData.thumbnail = req.file.path;
    }

    const updatedPackage = await Package.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedPackage) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    res.json({
      success: true,
      message: 'Package updated successfully',
      data: updatedPackage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating package',
      error: error.message
    });
  }
});

// DELETE package (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const deletedPackage = await Package.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!deletedPackage) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    res.json({
      success: true,
      message: 'Package deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting package',
      error: error.message
    });
  }
});

// Hard delete (permanent)
router.delete('/:id/permanent', async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);
    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    // Delete thumbnail file
    if (package.thumbnail && fs.existsSync(package.thumbnail)) {
      fs.unlinkSync(package.thumbnail);
    }

    await Package.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Package permanently deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting package',
      error: error.message
    });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const multer = require('multer');
const Vlog = require('../models/Vlog');

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/vlogs/'); // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// GET all vlogs
router.get('/', async (req, res) => {
  try {
    const vlogs = await Vlog.find().sort({ createdAt: -1 });
    res.json(vlogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single vlog
router.get('/:id', async (req, res) => {
  try {
    const vlog = await Vlog.findById(req.params.id);
    if (!vlog) {
      return res.status(404).json({ message: 'Vlog not found' });
    }
    res.json(vlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new vlog (with file upload)
router.post('/', upload.single('thumbnail'), async (req, res) => {
  try {
    const { title, description, videoUrl, isFeatured } = req.body;
    const thumbnailPath = req.file ? req.file.path : null;

    const newVlog = new Vlog({
      title,
      description,
      videoUrl,
      thumbnail: thumbnailPath,
      isFeatured: isFeatured === 'true',
      details: description // Keeping your existing field if needed
    });

    const savedVlog = await newVlog.save();
    res.status(201).json(savedVlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update vlog (optional - add file upload handling if needed)
router.put('/:id', upload.single('thumbnail'), async (req, res) => {
  try {
    const { title, description, videoUrl, isFeatured } = req.body;
    const updateData = {
      title,
      description,
      videoUrl,
      isFeatured: isFeatured === 'true',
      updatedAt: Date.now(),
      details: description // Keeping your existing field if needed
    };

    if (req.file) {
      updateData.thumbnail = req.file.path;
    }

    const updatedVlog = await Vlog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedVlog) {
      return res.status(404).json({ success: false, message: 'Vlog not found' });
    }

    res.json({ success: true, data: updatedVlog });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE vlog (unchanged)
router.delete('/:id', async (req, res) => {
  try {
    const deletedVlog = await Vlog.findByIdAndDelete(req.params.id);
    
    if (!deletedVlog) {
      return res.status(404).json({ success: false, message: 'Vlog not found' });
    }

    res.json({ success: true, message: 'Vlog deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
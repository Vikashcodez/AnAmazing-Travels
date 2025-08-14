// routes/gallery.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Gallery = require('../models/Gallery');

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = 'uploads/gallery';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images and videos
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// POST - Upload multiple files
router.post('/upload', upload.array('files', 10), async (req, res) => {
  try {
    const { titles } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const titlesArray = Array.isArray(titles) ? titles : [titles];
    
    if (titlesArray.length !== files.length) {
      return res.status(400).json({ message: 'Number of titles must match number of files' });
    }

    const savedItems = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const title = titlesArray[i];

      const galleryItem = new Gallery({
        title: title,
        fileName: file.filename,
        filePath: file.path,
        fileType: file.mimetype.startsWith('image/') ? 'image' : 'video',
        mimeType: file.mimetype,
        fileSize: file.size
      });

      const savedItem = await galleryItem.save();
      savedItems.push(savedItem);
    }

    res.status(201).json({
      message: 'Files uploaded successfully',
      data: savedItems
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading files', error: error.message });
  }
});

// GET - Get all gallery items
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, type } = req.query;
    const query = {};
    
    if (type && (type === 'image' || type === 'video')) {
      query.fileType = type;
    }

    const galleryItems = await Gallery.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Gallery.countDocuments(query);

    res.json({
      data: galleryItems,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total: total
    });

  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ message: 'Error fetching gallery items', error: error.message });
  }
});

// GET - Get single gallery item
router.get('/:id', async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);
    
    if (!galleryItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    res.json(galleryItem);

  } catch (error) {
    console.error('Fetch single error:', error);
    res.status(500).json({ message: 'Error fetching gallery item', error: error.message });
  }
});

// PUT - Update gallery item
router.put('/:id', async (req, res) => {
  try {
    const { title } = req.body;
    
    const updatedItem = await Gallery.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    res.json({
      message: 'Gallery item updated successfully',
      data: updatedItem
    });

  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Error updating gallery item', error: error.message });
  }
});

// DELETE - Delete gallery item
router.delete('/:id', async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);
    
    if (!galleryItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    // Delete file from filesystem
    if (fs.existsSync(galleryItem.filePath)) {
      fs.unlinkSync(galleryItem.filePath);
    }

    await Gallery.findByIdAndDelete(req.params.id);

    res.json({ message: 'Gallery item deleted successfully' });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Error deleting gallery item', error: error.message });
  }
});

// GET - Serve uploaded files
router.get('/file/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '..', uploadsDir, filename);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(path.resolve(filePath));
  } else {
    res.status(404).json({ message: 'File not found' });
  }
});

module.exports = router;
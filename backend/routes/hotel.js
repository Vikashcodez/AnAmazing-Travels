// routes/hotelRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const Hotel = require('../models/Hotel');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Get all hotels
router.get('/', async (req, res) => {
  try {
    const hotels = await Hotel.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: hotels
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching hotels',
      error: error.message
    });
  }
});

// Get single hotel by ID
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel || !hotel.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }
    res.json({
      success: true,
      data: hotel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching hotel',
      error: error.message
    });
  }
});

// Create new hotel with rooms
router.post('/', upload.fields([
  { name: 'hotelImage', maxCount: 1 },
  { name: 'roomImages', maxCount: 50 }
]), async (req, res) => {
  try {
    const {
      hotelName,
      hotelLocation,
      locationLink,
      hotelAddress,
      description,
      rooms
    } = req.body;

    // Get hotel image
    const hotelImage = req.files['hotelImage'] ? req.files['hotelImage'][0].filename : null;
    
    if (!hotelImage) {
      return res.status(400).json({
        success: false,
        message: 'Hotel image is required'
      });
    }

    // Parse rooms data
    let parsedRooms = [];
    if (rooms) {
      parsedRooms = JSON.parse(rooms);
      
      // Map room images
      const roomImages = req.files['roomImages'] || [];
      let imageIndex = 0;
      
      parsedRooms = parsedRooms.map(room => ({
        ...room,
        images: roomImages.slice(imageIndex, imageIndex + 3).map(file => file.filename)
      }));
    }

    const newHotel = new Hotel({
      hotelName,
      hotelLocation,
      locationLink,
      hotelAddress,
      description,
      hotelImage,
      rooms: parsedRooms
    });

    const savedHotel = await newHotel.save();
    res.status(201).json({
      success: true,
      message: 'Hotel created successfully',
      data: savedHotel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating hotel',
      error: error.message
    });
  }
});

// Update hotel
router.put('/:id', upload.fields([
  { name: 'hotelImage', maxCount: 1 },
  { name: 'roomImages', maxCount: 50 }
]), async (req, res) => {
  try {
    const {
      hotelName,
      hotelLocation,
      locationLink,
      hotelAddress,
      description,
      rooms
    } = req.body;

    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    // Update basic hotel info
    hotel.hotelName = hotelName || hotel.hotelName;
    hotel.hotelLocation = hotelLocation || hotel.hotelLocation;
    hotel.locationLink = locationLink || hotel.locationLink;
    hotel.hotelAddress = hotelAddress || hotel.hotelAddress;
    hotel.description = description || hotel.description;

    // Update hotel image if new one provided
    if (req.files['hotelImage']) {
      hotel.hotelImage = req.files['hotelImage'][0].filename;
    }

    // Update rooms if provided
    if (rooms) {
      const parsedRooms = JSON.parse(rooms);
      const roomImages = req.files['roomImages'] || [];
      let imageIndex = 0;
      
      hotel.rooms = parsedRooms.map(room => ({
        ...room,
        images: room.images || roomImages.slice(imageIndex, imageIndex + 3).map(file => file.filename)
      }));
    }

    const updatedHotel = await hotel.save();
    res.json({
      success: true,
      message: 'Hotel updated successfully',
      data: updatedHotel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating hotel',
      error: error.message
    });
  }
});

// Add room to existing hotel
router.post('/:id/rooms', upload.array('roomImages', 10), async (req, res) => {
  try {
    const { roomType, bedType, acType, price } = req.body;
    const images = req.files.map(file => file.filename);

    if (images.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Minimum 3 room images required'
      });
    }

    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    const newRoom = {
      roomType,
      bedType,
      acType,
      price: Number(price),
      images
    };

    hotel.rooms.push(newRoom);
    const updatedHotel = await hotel.save();

    res.json({
      success: true,
      message: 'Room added successfully',
      data: updatedHotel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding room',
      error: error.message
    });
  }
});

// Delete room from hotel
router.delete('/:hotelId/rooms/:roomId', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.hotelId);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    hotel.rooms = hotel.rooms.filter(room => room._id.toString() !== req.params.roomId);
    const updatedHotel = await hotel.save();

    res.json({
      success: true,
      message: 'Room deleted successfully',
      data: updatedHotel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting room',
      error: error.message
    });
  }
});

// Delete hotel (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    hotel.isActive = false;
    await hotel.save();

    res.json({
      success: true,
      message: 'Hotel deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting hotel',
      error: error.message
    });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const Package = require('../models/Package');
const { auth } = require('../middleware/auth');

// Create a new booking
router.post('/', auth, async (req, res) => {
  try {
    console.log('Received booking request:', req.body);
    console.log('User from auth:', req.user);

    const {
      packageId,
      packageName,
      price,
      numberOfDays,
      numberOfNights,
      travelDate,
      userDetails,
      numberOfPeople = 1,
      specialRequests = ''
    } = req.body;

    // Validate required fields
    if (!packageId || !packageName || !price || !numberOfDays || !numberOfNights || !travelDate) {
      console.log('Missing required fields:', { packageId, packageName, price, numberOfDays, numberOfNights, travelDate });
      return res.status(400).json({
        success: false,
        message: 'Missing required booking information'
      });
    }

    // Validate travel date is in the future
    const selectedDate = new Date(travelDate);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (selectedDate < tomorrow) {
      return res.status(400).json({
        success: false,
        message: 'Travel date must be at least 1 day from today'
      });
    }

    // Verify package exists
    console.log('Checking if package exists:', packageId);
    const packageExists = await Package.findById(packageId);
    if (!packageExists) {
      console.log('Package not found:', packageId);
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    // Verify user exists and get updated details
    console.log('Checking if user exists:', req.user.id);
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('User not found:', req.user.id);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('User found:', user);

    // Prepare user details with fallback values
    const finalUserDetails = {
      username: (userDetails?.username && userDetails.username !== 'undefined') ? userDetails.username : 
                (user.username && user.username !== 'undefined') ? user.username : 'Guest User',
      email: (userDetails?.email && userDetails.email !== 'undefined') ? userDetails.email : 
             (user.email && user.email !== 'undefined') ? user.email : 'no-email@example.com',
      phone: (userDetails?.phone && userDetails.phone !== 'undefined') ? userDetails.phone : 
             (user.phone && user.phone !== 'undefined') ? user.phone : 'No phone provided',
      address: (userDetails?.address && userDetails.address !== 'undefined') ? userDetails.address : 
               (user.address && user.address !== 'undefined') ? user.address : 'No address provided'
    };

    console.log('Final user details:', finalUserDetails);

    // Create booking
    const bookingData = {
      userId: req.user.id,
      packageId,
      packageName,
      price: Number(price),
      numberOfDays: Number(numberOfDays),
      numberOfNights: Number(numberOfNights),
      travelDate: selectedDate,
      bookingDate: new Date(),
      paymentStatus: 'pending',
      bookingStatus: 'confirmed',
      userDetails: finalUserDetails,
      numberOfPeople: Number(numberOfPeople),
      specialRequests: specialRequests || '',
      totalAmount: Number(price) * Number(numberOfPeople)
    };

    console.log('Creating booking with data:', bookingData);

    const booking = new Booking(bookingData);
    const savedBooking = await booking.save();

    console.log('Booking saved successfully:', savedBooking._id);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: savedBooking
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    console.error('Error stack:', error.stack);
    
    // More specific error handling
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get all bookings for a user
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const bookings = await Booking.find({ userId: req.user.id })
      .populate('packageId', 'packageName thumbnail')
      .sort({ bookingDate: -1 })
      .skip(skip)
      .limit(limit);

    const totalBookings = await Booking.countDocuments({ userId: req.user.id });

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalBookings / limit),
        totalBookings,
        hasNext: page < Math.ceil(totalBookings / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
});

// Get a specific booking by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user.id
    }).populate('packageId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking details',
      error: error.message
    });
  }
});

// Update booking (for cancellation, etc.)
router.put('/:id', auth, async (req, res) => {
  try {
    const { bookingStatus, specialRequests } = req.body;

    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if booking can be modified
    const travelDate = new Date(booking.travelDate);
    const now = new Date();
    const timeDiff = travelDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff < 1 && bookingStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel booking less than 24 hours before travel date'
      });
    }

    // Update allowed fields
    if (bookingStatus) booking.bookingStatus = bookingStatus;
    if (specialRequests !== undefined) booking.specialRequests = specialRequests;

    const updatedBooking = await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: updatedBooking
    });

  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating booking',
      error: error.message
    });
  }
});

// Admin routes
// Get all bookings (admin only)
router.get('/admin/all', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const paymentStatus = req.query.paymentStatus;

    let query = {};
    if (status) query.bookingStatus = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const bookings = await Booking.find(query)
      .populate('userId', 'username email')
      .populate('packageId', 'packageName thumbnail')
      .sort({ bookingDate: -1 })
      .skip(skip)
      .limit(limit);

    const totalBookings = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalBookings / limit),
        totalBookings,
        hasNext: page < Math.ceil(totalBookings / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
});

// Update payment status (admin only)
router.put('/admin/:id/payment', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    const { paymentStatus } = req.body;

    if (!['pending', 'paid', 'failed', 'refunded'].includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status'
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      data: booking
    });

  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating payment status',
      error: error.message
    });
  }
});

// Add this new route to your booking routes
router.put('/admin/:id/status', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking status'
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { bookingStatus: status },
      { new: true }
    ).populate('userId', 'username email')
     .populate('packageId', 'packageName thumbnail');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking
    });

  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating booking status',
      error: error.message
    });
  }
});


module.exports = router;
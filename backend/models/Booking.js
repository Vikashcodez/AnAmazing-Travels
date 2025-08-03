// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: true
  },
  packageName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  numberOfDays: {
    type: Number,
    required: true
  },
  numberOfNights: {
    type: Number,
    required: true
  },
  travelDate: {
    type: Date,
    required: true
  },
  bookingDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  bookingStatus: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  userDetails: {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    }
  },
  specialRequests: {
    type: String,
    default: ''
  },
  numberOfPeople: {
    type: Number,
    default: 1
  },
  totalAmount: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Virtual for calculating total amount
bookingSchema.virtual('calculatedTotal').get(function() {
  return this.price * this.numberOfPeople;
});

// Pre-save middleware to set total amount
bookingSchema.pre('save', function(next) {
  if (!this.totalAmount) {
    this.totalAmount = this.price * this.numberOfPeople;
  }
  next();
});

// Index for faster queries
bookingSchema.index({ userId: 1, bookingDate: -1 });
bookingSchema.index({ packageId: 1 });
bookingSchema.index({ paymentStatus: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
// models/Hotel.js
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomType: {
    type: String,
    required: true,
    enum: ['deluxe', 'normal']
  },
  bedType: {
    type: String,
    required: true,
    enum: ['single', 'double']
  },
  acType: {
    type: String,
    required: true,
    enum: ['AC', 'Non-AC']
  },
  price: {
    type: Number,
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  availability: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const hotelSchema = new mongoose.Schema({
  hotelName: {
    type: String,
    required: true,
    trim: true
  },
  hotelLocation: {
    type: String,
    required: true,
    trim: true
  },
  locationLink: {
    type: String,
    required: true,
    trim: true
  },
  hotelAddress: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  hotelImage: {
    type: String,
    required: true
  },
  rooms: [roomSchema],
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Hotel', hotelSchema);
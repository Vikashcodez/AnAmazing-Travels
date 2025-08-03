const mongoose = require('mongoose');

const vlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  videoUrl: { type: String, required: true },
  thumbnail: { type: String }, // Will store the file path
  isFeatured: { type: Boolean, default: false },
  details: { type: String }, // Keeping for backward compatibility
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

module.exports = mongoose.model('Vlog', vlogSchema);
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');

require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/packages', require('./routes/packages'));
app.use('/api/vlogs', require('./routes/Vlogs'));
app.use('/api/enquiries', require('./routes/enquiries'));
app.use('/api/bookings', require('./routes/booking'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
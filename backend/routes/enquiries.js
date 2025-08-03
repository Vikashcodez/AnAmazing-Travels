const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');

// Submit new enquiry
router.post('/', async (req, res) => {
  try {
    const enquiry = new Enquiry(req.body);
    await enquiry.save();
    res.status(201).json({ 
      success: true, 
      message: 'Enquiry submitted successfully',
      enquiryId: enquiry._id 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: 'Error submitting enquiry', 
      error: error.message 
    });
  }
});

// Get all enquiries (Admin)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const enquiries = await Enquiry.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Enquiry.countDocuments(query);

    res.json({
      success: true,
      enquiries,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching enquiries', 
      error: error.message 
    });
  }
});

// Update enquiry status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );
    
    if (!enquiry) {
      return res.status(404).json({ 
        success: false, 
        message: 'Enquiry not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Status updated successfully', 
      enquiry 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: 'Error updating status', 
      error: error.message 
    });
  }
});

// Get single enquiry
router.get('/:id', async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ 
        success: false, 
        message: 'Enquiry not found' 
      });
    }
    res.json({ success: true, enquiry });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching enquiry', 
      error: error.message 
    });
  }
});

module.exports = router;
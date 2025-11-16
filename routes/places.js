const express = require('express');
const Place = require('../models/Place');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all places with filtering
router.get('/', async (req, res) => {
  try {
    const { search, state, country, category, budget, page = 1, limit = 10 } = req.query;
    
    let filter = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (state) filter.state = state;
    if (country) filter.country = country;
    if (category) filter.category = category;
    if (budget) filter.budget = budget;

    const places = await Place.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ rating: -1, createdAt: -1 });

    const total = await Place.countDocuments(filter);

    res.json({
      places,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single place
router.get('/:id', async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }
    res.json(place);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create place (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const place = new Place(req.body);
    await place.save();
    res.status(201).json(place);
  } catch (error) {
    res.status(400).json({ message: 'Error creating place', error: error.message });
  }
});

// Get trending places
router.get('/trending/places', async (req, res) => {
  try {
    const places = await Place.find().sort({ rating: -1 }).limit(6);
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



module.exports = router;
const Place = require('../models/Place');

// @desc    Get all places with filtering and pagination
// @route   GET /api/places
// @access  Public
const getPlaces = async (req, res) => {
  try {
    const {
      search,
      state,
      country,
      category,
      budget,
      page = 1,
      limit = 12,
      sort = 'rating'
    } = req.query;

    // Build filter object
    let filter = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (state) filter.state = { $regex: state, $options: 'i' };
    if (country) filter.country = { $regex: country, $options: 'i' };
    if (category) filter.category = category;
    if (budget) filter.budget = budget;

    // Build sort object
    let sortOptions = {};
    switch (sort) {
      case 'name':
        sortOptions.name = 1;
        break;
      case 'rating':
        sortOptions.rating = -1;
        break;
      case 'newest':
        sortOptions.createdAt = -1;
        break;
      default:
        sortOptions.rating = -1;
    }

    // Execute query with pagination
    const places = await Place.find(filter)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count for pagination
    const total = await Place.countDocuments(filter);

    res.json({
      success: true,
      count: places.length,
      total,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      },
      data: places
    });
  } catch (error) {
    console.error('Get places error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching places',
      error: error.message
    });
  }
};

// @desc    Get single place
// @route   GET /api/places/:id
// @access  Public
const getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    
    if (!place) {
      return res.status(404).json({
        success: false,
        message: 'Place not found'
      });
    }

    res.json({
      success: true,
      data: place
    });
  } catch (error) {
    console.error('Get place error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Place not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error fetching place',
      error: error.message
    });
  }
};

// @desc    Create new place
// @route   POST /api/places
// @access  Private
const createPlace = async (req, res) => {
  try {
    const place = await Place.create(req.body);
    
    res.status(201).json({
      success: true,
      data: place
    });
  } catch (error) {
    console.error('Create place error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error creating place',
      error: error.message
    });
  }
};

// @desc    Update place
// @route   PUT /api/places/:id
// @access  Private
const updatePlace = async (req, res) => {
  try {
    const place = await Place.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!place) {
      return res.status(404).json({
        success: false,
        message: 'Place not found'
      });
    }

    res.json({
      success: true,
      data: place
    });
  } catch (error) {
    console.error('Update place error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error updating place',
      error: error.message
    });
  }
};

// @desc    Delete place
// @route   DELETE /api/places/:id
// @access  Private
const deletePlace = async (req, res) => {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);

    if (!place) {
      return res.status(404).json({
        success: false,
        message: 'Place not found'
      });
    }

    res.json({
      success: true,
      message: 'Place deleted successfully'
    });
  } catch (error) {
    console.error('Delete place error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting place',
      error: error.message
    });
  }
};

// @desc    Get trending places
// @route   GET /api/places/trending
// @access  Public
const getTrendingPlaces = async (req, res) => {
  try {
    const places = await Place.find()
      .sort({ rating: -1, createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      count: places.length,
      data: places
    });
  } catch (error) {
    console.error('Get trending places error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching trending places',
      error: error.message
    });
  }
};

// @desc    Get places by category
// @route   GET /api/places/category/:category
// @access  Public
const getPlacesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const places = await Place.find({ category })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ rating: -1 });

    const total = await Place.countDocuments({ category });

    res.json({
      success: true,
      count: places.length,
      total,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      },
      data: places
    });
  } catch (error) {
    console.error('Get places by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching places by category',
      error: error.message
    });
  }
};

module.exports = {
  getPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
  getTrendingPlaces,
  getPlacesByCategory
};
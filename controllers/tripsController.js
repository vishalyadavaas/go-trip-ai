const Trip = require('../models/Trip');
const Place = require('../models/Place');

// @desc    Get user's trips
// @route   GET /api/trips
// @access  Private
const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user.id })
      .populate('placeId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: trips.length,
      data: trips
    });
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching trips',
      error: error.message
    });
  }
};

// @desc    Get single trip
// @route   GET /api/trips/:id
// @access  Private
const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.user.id
    }).populate('placeId');

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    res.json({
      success: true,
      data: trip
    });
  } catch (error) {
    console.error('Get trip error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error fetching trip',
      error: error.message
    });
  }
};

// @desc    Create new trip
// @route   POST /api/trips
// @access  Private
const createTrip = async (req, res) => {
  try {
    const {
      placeId,
      startDate,
      endDate,
      budget,
      preferredTransport,
      checklist = []
    } = req.body;

    // Validation
    if (!placeId || !startDate || !endDate || !budget || !preferredTransport) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if place exists
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({
        success: false,
        message: 'Place not found'
      });
    }

    const trip = await Trip.create({
      userId: req.user.id,
      placeId,
      startDate,
      endDate,
      budget,
      preferredTransport,
      checklist
    });

    await trip.populate('placeId');

    res.status(201).json({
      success: true,
      data: trip
    });
  } catch (error) {
    console.error('Create trip error:', error);
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
      message: 'Server error creating trip',
      error: error.message
    });
  }
};

// @desc    Update trip
// @route   PUT /api/trips/:id
// @access  Private
const updateTrip = async (req, res) => {
  try {
    let trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    trip = await Trip.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('placeId');

    res.json({
      success: true,
      data: trip
    });
  } catch (error) {
    console.error('Update trip error:', error);
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
      message: 'Server error updating trip',
      error: error.message
    });
  }
};

// @desc    Update trip checklist
// @route   PUT /api/trips/:id/checklist
// @access  Private
const updateTripChecklist = async (req, res) => {
  try {
    const { checklist } = req.body;

    const trip = await Trip.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id
      },
      { checklist },
      {
        new: true,
        runValidators: true
      }
    ).populate('placeId');

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    res.json({
      success: true,
      data: trip
    });
  } catch (error) {
    console.error('Update checklist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating checklist',
      error: error.message
    });
  }
};

// @desc    Delete trip
// @route   DELETE /api/trips/:id
// @access  Private
const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    res.json({
      success: true,
      message: 'Trip deleted successfully'
    });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting trip',
      error: error.message
    });
  }
};

// @desc    Get upcoming trips
// @route   GET /api/trips/upcoming
// @access  Private
const getUpcomingTrips = async (req, res) => {
  try {
    const today = new Date();
    
    const trips = await Trip.find({
      userId: req.user.id,
      startDate: { $gte: today }
    })
      .populate('placeId')
      .sort({ startDate: 1 })
      .limit(5);

    res.json({
      success: true,
      count: trips.length,
      data: trips
    });
  } catch (error) {
    console.error('Get upcoming trips error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching upcoming trips',
      error: error.message
    });
  }
};

module.exports = {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  updateTripChecklist,
  deleteTrip,
  getUpcomingTrips
};
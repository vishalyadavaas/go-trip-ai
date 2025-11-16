// backend/controllers/hotel.controller.js
const Hotel = require('../models/hotel.model');

// Get hotels by placeId
const getHotelsByPlace = async (req, res) => {
  try {
    const { placeId } = req.params;
    
    const hotels = await Hotel.find({ placeId })
      .sort({ rating: -1, distanceFromPlace: 1 });
    
    res.json({
      success: true,
      data: hotels,
      count: hotels.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching hotels',
      error: error.message
    });
  }
};

// Create new hotel
const createHotel = async (req, res) => {
  try {
    const hotel = new Hotel(req.body);
    await hotel.save();
    
    res.status(201).json({
      success: true,
      data: hotel
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating hotel',
      error: error.message
    });
  }
};

module.exports = {
  getHotelsByPlace,
  createHotel
};
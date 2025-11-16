// backend/controllers/restaurant.controller.js
const Restaurant = require('../models/restaurant.model');

// Get restaurants by placeId
const getRestaurantsByPlace = async (req, res) => {
  try {
    const { placeId } = req.params;
    
    const restaurants = await Restaurant.find({ placeId })
      .sort({ rating: -1, distanceFromPlace: 1 });
    
    res.json({
      success: true,
      data: restaurants,
      count: restaurants.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching restaurants',
      error: error.message
    });
  }
};

// Create new restaurant
const createRestaurant = async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    
    res.status(201).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating restaurant',
      error: error.message
    });
  }
};

module.exports = {
  getRestaurantsByPlace,
  createRestaurant
};
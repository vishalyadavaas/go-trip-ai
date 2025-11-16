// backend/routes/restaurant.routes.js
const express = require('express');
const router = express.Router();
const { getRestaurantsByPlace, createRestaurant } = require('../controllers/restaurant.controller');

router.get('/place/:placeId', getRestaurantsByPlace);
router.post('/', createRestaurant);

module.exports = router;
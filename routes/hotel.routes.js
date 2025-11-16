// backend/routes/hotel.routes.js
const express = require('express');
const router = express.Router();
const { getHotelsByPlace, createHotel } = require('../controllers/hotel.controller');

router.get('/place/:placeId', getHotelsByPlace);
router.post('/', createHotel);

module.exports = router;
const express = require('express');
const { 
  getFlights, 
  getTrains, 
  getTransportRecommendations 
} = require('../controllers/transportController');

const router = express.Router();

router.get('/flights', getFlights);
router.get('/trains', getTrains);
router.post('/recommendations', getTransportRecommendations);

module.exports = router;
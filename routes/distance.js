const express = require('express');
const { calculateDistance } = require('../controllers/distanceController');

const router = express.Router();

router.get('/calculate', calculateDistance);

module.exports = router;
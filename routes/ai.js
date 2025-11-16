const express = require('express');
const {
  recommendTrip,
  generatePackingList,
  generateSafetyTips
} = require('../controllers/aiController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/recommend-trip',auth, recommendTrip);
router.post('/packing-list',auth, generatePackingList);
router.post('/safety-tips',auth, generateSafetyTips);

module.exports = router;
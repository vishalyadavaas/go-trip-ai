const express = require('express');
const {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  updateTripChecklist,
  deleteTrip,
  getUpcomingTrips
} = require('../controllers/tripsController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getTrips);
router.get('/upcoming', auth, getUpcomingTrips);
router.get('/:id', auth, getTripById);
router.post('/', auth, createTrip);
router.put('/:id', auth, updateTrip);
router.put('/:id/checklist', auth, updateTripChecklist);
router.delete('/:id', auth, deleteTrip);

module.exports = router;
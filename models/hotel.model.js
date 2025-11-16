// backend/models/hotel.model.js
const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  placeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
    required: true
  },
  priceRange: {
    type: String,
    enum: ['cheap', 'medium', 'expensive'],
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  amenities: [{
    type: String
  }],
  bookingLink: {
    type: String,
    required: true
  },
  distanceFromPlace: {
    type: Number, // in kilometers
    required: true
  },
  image: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Hotel', hotelSchema);
const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  coordinates: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  bestSeason: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  tips: [{
    type: String
  }],
  category: {
    type: String,
    enum: ['beach', 'mountain', 'city', 'historical', 'adventure'],
    required: true
  },
  budget: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Place', placeSchema);
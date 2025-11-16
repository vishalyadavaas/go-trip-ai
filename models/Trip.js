const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  placeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  budget: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  preferredTransport: {
    type: String,
    enum: ['flight', 'train', 'bus', 'car'],
    required: true
  },
  checklist: [{
    item: String,
    completed: {
      type: Boolean,
      default: false
    }
  }],
  aiRecommendations: {
    packingList: [String],
    safetyTips: [String],
    itinerary: [String]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Trip', tripSchema);
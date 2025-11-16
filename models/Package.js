import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Package name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [300, 'Short description cannot exceed 300 characters']
  },
  duration: {
    days: {
      type: Number,
      required: [true, 'Duration in days is required'],
      min: [1, 'Duration must be at least 1 day']
    },
    nights: {
      type: Number,
      required: [true, 'Duration in nights is required'],
      min: [0, 'Nights cannot be negative']
    }
  },
  pricing: {
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD'
    },
    discount: {
      percentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      validUntil: Date
    },
    inclusions: [{
      item: String,
      included: {
        type: Boolean,
        default: true
      }
    }]
  },
  destinations: [{
    place: {
      type: mongoose.Schema.ObjectId,
      ref: 'Place',
      required: true
    },
    duration: {
      type: Number, // in hours
      required: true,
      min: 1
    },
    order: {
      type: Number,
      required: true
    },
    description: String
  }],
  accommodations: [{
    hotel: {
      type: mongoose.Schema.ObjectId,
      ref: 'Hotel',
      required: true
    },
    nights: {
      type: Number,
      required: true,
      min: 1
    },
    roomType: String
  }],
  itinerary: [{
    day: {
      type: Number,
      required: true,
      min: 1
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    activities: [String],
    meals: {
      breakfast: { type: Boolean, default: false },
      lunch: { type: Boolean, default: false },
      dinner: { type: Boolean, default: false }
    }
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    caption: String
  }],
  features: [{
    type: String,
    enum: [
      'guided-tours', 'meals-included', 'transportation',
      'hotel-accommodation', 'insurance', 'airport-pickup',
      'flexible-dates', 'group-discount', 'family-friendly'
    ]
  }],
  terms: {
    cancellation: String,
    payment: String,
    visa: String,
    health: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft', 'sold-out'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  bookingCount: {
    type: Number,
    default: 0
  },
  maxTravelers: {
    type: Number,
    default: 20
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'Admin',
    required: true
  }
}, {
  timestamps: true
});

// Indexes
packageSchema.index({ status: 1 });
packageSchema.index({ featured: -1 });
packageSchema.index({ 'pricing.basePrice': 1 });
packageSchema.index({ duration: 1 });

// Virtual for discounted price
packageSchema.virtual('discountedPrice').get(function() {
  if (this.pricing.discount.percentage > 0) {
    return this.pricing.basePrice * (1 - this.pricing.discount.percentage / 100);
  }
  return this.pricing.basePrice;
});

export default mongoose.model('Package', packageSchema);
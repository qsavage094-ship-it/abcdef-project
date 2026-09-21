const mongoose = require('mongoose');
const { cropsCollection } = require('../config/localDb');

const cropSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide the crop name'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please select a crop category'],
      enum: [
        'Grains & Cereals',
        'Vegetables',
        'Fruits',
        'Pulses & Legumes',
        'Spices',
        'Cash Crops'
      ]
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    farmerName: {
      type: String,
      required: true,
      trim: true
    },
    farmerPhone: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      required: [true, 'Please provide the farm location / region'],
      trim: true
    },
    quantity: {
      type: Number,
      required: [true, 'Please specify available quantity'],
      min: [1, 'Quantity must be at least 1']
    },
    unit: {
      type: String,
      enum: ['kg', 'quintal', 'ton', 'crate'],
      default: 'kg'
    },
    pricePerUnit: {
      type: Number,
      required: [true, 'Please specify price per unit'],
      min: [0, 'Price cannot be negative']
    },
    harvestDate: {
      type: Date,
      default: Date.now
    },
    organicStatus: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['Available', 'Reserved', 'Sold Out'],
      default: 'Available'
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80'
    },
    description: {
      type: String,
      required: [true, 'Please provide a description of the crop produce'],
      trim: true
    },
    soilType: {
      type: String,
      default: 'Alluvial Soil'
    }
  },
  {
    timestamps: true
  }
);

cropSchema.index({ name: 'text', location: 'text', description: 'text' });

const MongooseCrop = mongoose.models.Crop || mongoose.model('Crop', cropSchema);

// Universal proxy for Mongoose and localDb
const CropProxy = new Proxy(MongooseCrop, {
  get(target, prop) {
    if (mongoose.connection.readyState === 1 && !global.__useLocalDb) {
      return target[prop];
    }
    if (prop in cropsCollection) {
      return typeof cropsCollection[prop] === 'function'
        ? cropsCollection[prop].bind(cropsCollection)
        : cropsCollection[prop];
    }
    return target[prop];
  }
});

module.exports = CropProxy;

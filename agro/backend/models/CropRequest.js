const mongoose = require('mongoose');
const { cropRequestsCollection } = require('../config/localDb');

const cropRequestSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    buyerName: {
      type: String,
      required: true
    },
    buyerEmail: {
      type: String,
      required: true
    },
    crop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crop',
      required: true
    },
    cropName: {
      type: String,
      required: true
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    requestedQuantity: {
      type: Number,
      required: [true, 'Please specify requested quantity'],
      min: [1, 'Quantity must be at least 1']
    },
    unit: {
      type: String,
      default: 'kg'
    },
    unitPrice: {
      type: Number,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    },
    deliveryAddress: {
      type: String,
      required: [true, 'Please specify delivery address/mandi location'],
      trim: true
    },
    contactPhone: {
      type: String,
      required: [true, 'Please provide contact phone for dispatch coordination'],
      trim: true
    },
    notes: {
      type: String,
      default: '',
      trim: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'In Transit', 'Completed', 'Cancelled'],
      default: 'Pending'
    }
  },
  {
    timestamps: true
  }
);

const MongooseCropRequest =
  mongoose.models.CropRequest || mongoose.model('CropRequest', cropRequestSchema);

// Universal proxy for Mongoose and localDb
const CropRequestProxy = new Proxy(MongooseCropRequest, {
  get(target, prop) {
    if (mongoose.connection.readyState === 1 && !global.__useLocalDb) {
      return target[prop];
    }
    if (prop in cropRequestsCollection) {
      return typeof cropRequestsCollection[prop] === 'function'
        ? cropRequestsCollection[prop].bind(cropRequestsCollection)
        : cropRequestsCollection[prop];
    }
    return target[prop];
  }
});

module.exports = CropRequestProxy;

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { usersCollection } = require('../config/localDb');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6
    },
    phone: {
      type: String,
      required: [true, 'Please provide your phone number'],
      trim: true
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    address: {
      type: String,
      required: [true, 'Please provide your address/location'],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const MongooseUser = mongoose.models.User || mongoose.model('User', userSchema);

// Universal proxy that transparently delegates to Mongoose when connected or local storage when offline
const UserProxy = new Proxy(MongooseUser, {
  get(target, prop) {
    if (mongoose.connection.readyState === 1 && !global.__useLocalDb) {
      return target[prop];
    }
    if (prop in usersCollection) {
      return typeof usersCollection[prop] === 'function'
        ? usersCollection[prop].bind(usersCollection)
        : usersCollection[prop];
    }
    return target[prop];
  }
});

module.exports = UserProxy;

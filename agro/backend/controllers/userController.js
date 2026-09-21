const User = require('../models/User');
const CropRequest = require('../models/CropRequest');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching profile'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        address: updatedUser.address
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating profile'
    });
  }
};

// @desc    Get user activity dashboard statistics
// @route   GET /api/users/stats
// @access  Private
const getUserStats = async (req, res) => {
  try {
    const totalRequests = await CropRequest.countDocuments({ buyer: req.user._id });
    const pendingRequests = await CropRequest.countDocuments({
      buyer: req.user._id,
      status: 'Pending'
    });
    const activeRequests = await CropRequest.countDocuments({
      buyer: req.user._id,
      status: { $in: ['Approved', 'In Transit'] }
    });
    const completedRequests = await CropRequest.countDocuments({
      buyer: req.user._id,
      status: 'Completed'
    });

    res.json({
      success: true,
      data: {
        totalRequests,
        pendingRequests,
        activeRequests,
        completedRequests
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching user stats'
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserStats
};

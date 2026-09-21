const User = require('../models/User');
const Crop = require('../models/Crop');
const CropRequest = require('../models/CropRequest');

// @desc    Get comprehensive admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCrops = await Crop.countDocuments();
    const totalRequests = await CropRequest.countDocuments();
    const completedRequests = await CropRequest.countDocuments({ status: 'Completed' });
    const pendingRequests = await CropRequest.countDocuments({ status: 'Pending' });

    // Calculate total procurement trade value
    const tradeValueResult = await CropRequest.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalValue: { $sum: '$totalPrice' } } }
    ]);
    const totalTradeValue = tradeValueResult.length > 0 ? tradeValueResult[0].totalValue : 0;

    // Recent requests
    const recentRequests = await CropRequest.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('crop', 'name category')
      .populate('buyer', 'name email');

    // Recent crops
    const recentCrops = await Crop.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalCrops,
        totalRequests,
        completedRequests,
        pendingRequests,
        totalTradeValue,
        recentRequests,
        recentCrops
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching admin statistics'
    });
  }
};

// @desc    Get all registered users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching users'
    });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role provided. Role must be user or admin'
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Guard: Prevent admin from demoting themselves
    if (user._id.toString() === req.user._id.toString() && role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'You cannot remove your own admin privileges'
      });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating user role'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own admin account'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'User account removed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting user'
    });
  }
};

// @desc    Get all crop requests across platform
// @route   GET /api/admin/requests
// @access  Private/Admin
const getAllRequests = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { cropName: searchRegex },
        { buyerName: searchRegex },
        { buyerEmail: searchRegex },
        { deliveryAddress: searchRegex }
      ];
    }

    const requests = await CropRequest.find(query)
      .sort({ createdAt: -1 })
      .populate('crop', 'name category pricePerUnit unit')
      .populate('farmer', 'name email phone')
      .populate('buyer', 'name email phone');

    res.json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching all requests'
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllRequests
};

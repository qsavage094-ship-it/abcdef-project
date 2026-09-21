const CropRequest = require('../models/CropRequest');
const Crop = require('../models/Crop');

// @desc    Create a new crop request / procurement order
// @route   POST /api/requests
// @access  Private (User/Buyer)
const createRequest = async (req, res) => {
  try {
    const { cropId, requestedQuantity, deliveryAddress, contactPhone, notes } = req.body;

    if (!cropId || !requestedQuantity || !deliveryAddress || !contactPhone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide cropId, requestedQuantity, deliveryAddress, and contactPhone'
      });
    }

    const crop = await Crop.findById(cropId);
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'The requested crop could not be found'
      });
    }

    if (crop.status === 'Sold Out') {
      return res.status(400).json({
        success: false,
        message: 'This crop listing is currently sold out'
      });
    }

    const quantityNum = Number(requestedQuantity);
    if (quantityNum <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Requested quantity must be greater than 0'
      });
    }

    if (quantityNum > crop.quantity) {
      return res.status(400).json({
        success: false,
        message: `Requested quantity exceeds available stock of ${crop.quantity} ${crop.unit}`
      });
    }

    const totalPrice = quantityNum * crop.pricePerUnit;

    const request = await CropRequest.create({
      buyer: req.user._id,
      buyerName: req.user.name,
      buyerEmail: req.user.email,
      crop: crop._id,
      cropName: crop.name,
      farmer: crop.farmer,
      requestedQuantity: quantityNum,
      unit: crop.unit,
      unitPrice: crop.pricePerUnit,
      totalPrice,
      deliveryAddress,
      contactPhone,
      notes: notes || '',
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      message: 'Crop procurement request submitted successfully',
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating crop request'
    });
  }
};

// @desc    Get logged in user's requests
// @route   GET /api/requests/my
// @access  Private
const getMyRequests = async (req, res) => {
  try {
    const requests = await CropRequest.find({ buyer: req.user._id })
      .sort({ createdAt: -1 })
      .populate('crop', 'name category imageUrl location pricePerUnit unit')
      .populate('farmer', 'name email phone');

    res.json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching your requests'
    });
  }
};

// @desc    Get single request by ID
// @route   GET /api/requests/:id
// @access  Private
const getRequestById = async (req, res) => {
  try {
    const request = await CropRequest.findById(req.params.id)
      .populate('crop')
      .populate('farmer', 'name email phone address')
      .populate('buyer', 'name email phone address');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Verify user is buyer, farmer, or admin
    if (
      req.user.role !== 'admin' &&
      request.buyer._id.toString() !== req.user._id.toString() &&
      request.farmer._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this request'
      });
    }

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching request details'
    });
  }
};

// @desc    Cancel a request (Buyer only if pending/approved)
// @route   PUT /api/requests/:id/cancel
// @access  Private
const cancelMyRequest = async (req, res) => {
  try {
    const request = await CropRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    if (request.buyer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this request'
      });
    }

    if (request.status === 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed delivery request'
      });
    }

    if (request.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Request is already cancelled'
      });
    }

    request.status = 'Cancelled';
    await request.save();

    res.json({
      success: true,
      message: 'Request has been cancelled successfully',
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error cancelling request'
    });
  }
};

// @desc    Update request status (Admin or Farmer)
// @route   PUT /api/requests/:id/status
// @access  Private (Admin or Farmer)
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Approved', 'In Transit', 'Completed', 'Cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid options are: ${validStatuses.join(', ')}`
      });
    }

    const request = await CropRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    if (
      req.user.role !== 'admin' &&
      request.farmer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to change status for this request'
      });
    }

    request.status = status;
    await request.save();

    res.json({
      success: true,
      message: `Request status updated to ${status}`,
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating request status'
    });
  }
};

module.exports = {
  createRequest,
  getMyRequests,
  getRequestById,
  cancelMyRequest,
  updateRequestStatus
};

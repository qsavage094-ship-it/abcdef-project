const Crop = require('../models/Crop');

// @desc    Get all crops with search, filter, and sorting
// @route   GET /api/crops
// @access  Public
const getCrops = async (req, res) => {
  try {
    const { search, category, status, organic, minPrice, maxPrice, sort } = req.query;

    let query = {};

    // Keyword search across name, location, and description
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { location: searchRegex },
        { description: searchRegex },
        { farmerName: searchRegex }
      ];
    }

    // Filter by Category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by Status (default to showing Available if specified, or all)
    if (status && status !== 'All') {
      query.status = status;
    }

    // Filter by Organic Status
    if (organic !== undefined && organic !== '' && organic !== 'All') {
      query.organicStatus = organic === 'true' || organic === true;
    }

    // Filter by Price range
    if (minPrice || maxPrice) {
      query.pricePerUnit = {};
      if (minPrice) query.pricePerUnit.$gte = Number(minPrice);
      if (maxPrice) query.pricePerUnit.$lte = Number(maxPrice);
    }

    // Sorting options
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'price-low') {
      sortOption = { pricePerUnit: 1 };
    } else if (sort === 'price-high') {
      sortOption = { pricePerUnit: -1 };
    } else if (sort === 'quantity-high') {
      sortOption = { quantity: -1 };
    } else if (sort === 'name-asc') {
      sortOption = { name: 1 };
    }

    const crops = await Crop.find(query).sort(sortOption).populate('farmer', 'name email phone');

    res.json({
      success: true,
      count: crops.length,
      data: crops
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching crops'
    });
  }
};

// @desc    Get featured crops for homepage
// @route   GET /api/crops/featured
// @access  Public
const getFeaturedCrops = async (req, res) => {
  try {
    const crops = await Crop.find({ status: 'Available' })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate('farmer', 'name email phone');

    res.json({
      success: true,
      data: crops
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching featured crops'
    });
  }
};

// @desc    Get single crop by ID
// @route   GET /api/crops/:id
// @access  Public
const getCropById = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id).populate(
      'farmer',
      'name email phone address'
    );

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop produce record not found'
      });
    }

    res.json({
      success: true,
      data: crop
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching crop details'
    });
  }
};

// @desc    Create a new crop listing
// @route   POST /api/crops
// @access  Private (Admin or Authenticated Farmer/User)
const createCrop = async (req, res) => {
  try {
    const {
      name,
      category,
      quantity,
      unit,
      pricePerUnit,
      location,
      harvestDate,
      organicStatus,
      status,
      imageUrl,
      description,
      soilType
    } = req.body;

    if (!name || !category || !quantity || !pricePerUnit || !location || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (name, category, quantity, price, location, description)'
      });
    }

    const crop = await Crop.create({
      name,
      category,
      farmer: req.user._id,
      farmerName: req.user.name,
      farmerPhone: req.user.phone || '',
      quantity: Number(quantity),
      unit: unit || 'kg',
      pricePerUnit: Number(pricePerUnit),
      location,
      harvestDate: harvestDate || new Date(),
      organicStatus: organicStatus === true || organicStatus === 'true',
      status: status || 'Available',
      imageUrl:
        imageUrl ||
        'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
      description,
      soilType: soilType || 'Alluvial Soil'
    });

    res.status(201).json({
      success: true,
      message: 'Crop listing created successfully',
      data: crop
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating crop listing'
    });
  }
};

// @desc    Update crop listing
// @route   PUT /api/crops/:id
// @access  Private (Admin or Crop Owner)
const updateCrop = async (req, res) => {
  try {
    let crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop record not found'
      });
    }

    // Check ownership or admin privilege
    if (
      req.user.role !== 'admin' &&
      crop.farmer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this crop listing'
      });
    }

    crop = await Crop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Crop listing updated successfully',
      data: crop
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating crop record'
    });
  }
};

// @desc    Delete crop listing
// @route   DELETE /api/crops/:id
// @access  Private (Admin or Crop Owner)
const deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop record not found'
      });
    }

    if (
      req.user.role !== 'admin' &&
      crop.farmer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this crop listing'
      });
    }

    await Crop.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Crop listing deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting crop record'
    });
  }
};

module.exports = {
  getCrops,
  getFeaturedCrops,
  getCropById,
  createCrop,
  updateCrop,
  deleteCrop
};

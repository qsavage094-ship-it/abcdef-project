const express = require('express');
const router = express.Router();
const {
  getCrops,
  getFeaturedCrops,
  getCropById,
  createCrop,
  updateCrop,
  deleteCrop
} = require('../controllers/cropController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getCrops);
router.get('/featured', getFeaturedCrops);
router.get('/:id', getCropById);
router.post('/', protect, createCrop);
router.put('/:id', protect, updateCrop);
router.delete('/:id', protect, deleteCrop);

module.exports = router;

const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getProductReviews,
  createProductReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Handlers for /api/products/:productId/reviews
router.route('/')
  .get(getProductReviews)
  .post(protect, createProductReview);

// Handlers for /api/reviews/:id
router.route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router;

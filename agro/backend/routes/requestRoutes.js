const express = require('express');
const router = express.Router();
const {
  createRequest,
  getMyRequests,
  getRequestById,
  cancelMyRequest,
  updateRequestStatus
} = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createRequest);
router.get('/my', protect, getMyRequests);
router.get('/:id', protect, getRequestById);
router.put('/:id/cancel', protect, cancelMyRequest);
router.put('/:id/status', protect, updateRequestStatus);

module.exports = router;

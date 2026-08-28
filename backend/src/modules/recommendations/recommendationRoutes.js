const express = require('express');
const router = express.Router();
const recommendationController = require('./recommendationController');
const { authenticateToken } = require('../../middleware/authMiddleware');

router.post('/crops', authenticateToken, recommendationController.getCropRecommendations);
router.post('/land-allocation', authenticateToken, recommendationController.getLandAllocation);

module.exports = router;

const express = require('express');
const router = express.Router();
const farmerController = require('./farmerController');
const { authenticateToken } = require('../../middleware/authMiddleware');

router.get('/profile', authenticateToken, farmerController.getProfile);
router.put('/profile', authenticateToken, farmerController.updateProfile);

module.exports = router;

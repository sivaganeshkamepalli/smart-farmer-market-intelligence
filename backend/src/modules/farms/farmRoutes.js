const express = require('express');
const router = express.Router();
const farmController = require('./farmController');
const { authenticateToken } = require('../../middleware/authMiddleware');

router.get('/', authenticateToken, farmController.getFarms);
router.post('/', authenticateToken, farmController.createFarm);
router.get('/:id', authenticateToken, farmController.getFarmById);

module.exports = router;

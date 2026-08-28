const express = require('express');
const router = express.Router();
const investmentController = require('./investmentController');

router.post('/calculate', investmentController.calculateInvestment);

module.exports = router;

const express = require('express');
const router = express.Router();
const climateController = require('./climateController');

router.get('/history', climateController.getClimateHistory);
router.get('/forecast', climateController.getClimateForecast);

module.exports = router;

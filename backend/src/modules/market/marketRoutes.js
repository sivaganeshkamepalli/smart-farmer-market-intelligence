const express = require('express');
const router = express.Router();
const marketController = require('./marketController');

router.get('/markets', marketController.getMarkets);
router.get('/prices', marketController.getMarketPrices);
router.get('/demand', marketController.getMarketDemand);
router.get('/supply', marketController.getMarketSupply);

module.exports = router;

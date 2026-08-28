const express = require('express');
const router = express.Router();
const riskController = require('./riskController');

router.post('/analyse', riskController.analyseRisk);

module.exports = router;

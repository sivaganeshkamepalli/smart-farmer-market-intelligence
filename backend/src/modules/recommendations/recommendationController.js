const { generateFarmerRecommendations } = require('../../services/recommendationService');
const { calculateLandAllocation } = require('../../services/landAllocationService');

async function getCropRecommendations(req, res) {
  try {
    const farmerContext = req.body.farmerContext || {};
    const queryEntities = req.body.queryEntities || {};
    const result = await generateFarmerRecommendations(farmerContext, queryEntities);
    return res.json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function getLandAllocation(req, res) {
  try {
    const { totalLand, waterLevel, budget, riskPreference } = req.body;
    const result = calculateLandAllocation(totalLand || 2.0, waterLevel || 'MEDIUM', budget || 100000, riskPreference || 'BALANCED');
    return res.json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  getCropRecommendations,
  getLandAllocation
};

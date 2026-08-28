const { calculateRiskProfile } = require('../../services/riskAnalysisService');

async function analyseRisk(req, res) {
  try {
    const { productId, waterLevel } = req.body;
    if (!productId) return res.status(400).json({ success: false, message: 'Product ID required.' });
    
    const riskData = await calculateRiskProfile(productId, waterLevel || 'MEDIUM');
    return res.json({ success: true, data: riskData });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  analyseRisk
};

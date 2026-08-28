const { calculateCropEconomics } = require('../../services/costProfitService');

async function calculateInvestment(req, res) {
  try {
    const { productId, landAcres } = req.body;
    if (!productId) return res.status(400).json({ success: false, message: 'Product ID required.' });
    
    const econ = await calculateCropEconomics(productId, landAcres || 1.0);
    return res.json({ success: true, data: econ });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  calculateInvestment
};

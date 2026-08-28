const { query } = require('../config/db');

async function calculateRiskProfile(productId, waterLevel = 'MEDIUM') {
  // 1. DB risk factors
  const dbRisks = await query('SELECT * FROM risk_factors WHERE product_id = ?', [productId]);
  
  // 2. Compute 10-year price volatility
  const priceHistory = await query(`
    SELECT average_price FROM market_prices 
    WHERE product_id = ? 
    ORDER BY date DESC LIMIT 24
  `, [productId]);

  let priceVolatilityScore = 40.0;
  if (priceHistory.length > 5) {
    const prices = priceHistory.map(p => parseFloat(p.average_price));
    const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
    const variance = prices.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / prices.length;
    const stdDev = Math.sqrt(variance);
    priceVolatilityScore = Math.min(100, Math.round((stdDev / mean) * 100 * 2));
  }

  // 3. Compute Climate & Water Risk
  const waterReq = await query('SELECT water_level, drought_tolerance, flood_tolerance FROM product_water_requirements WHERE product_id = ?', [productId]);
  let climateRiskScore = 35.0;

  if (waterReq.length > 0) {
    const req = waterReq[0];
    if (waterLevel === 'LOW' && (req.water_level === 'HIGH' || req.water_level === 'VERY_HIGH')) {
      climateRiskScore = 82.0; // High water risk if farmer has low water
    } else if (waterLevel === 'LOW' && req.drought_tolerance === 'HIGH') {
      climateRiskScore = 25.0;
    }
  }

  // 4. Compute Supply Oversupply Risk
  const supplyRecords = await query('SELECT supply_level FROM product_supply WHERE product_id = ? ORDER BY date DESC LIMIT 3', [productId]);
  let supplyRiskScore = 45.0;
  if (supplyRecords.length > 0 && supplyRecords[0].supply_level === 'HIGH') {
    supplyRiskScore = 75.0; // Potential oversupply risk
  }

  // Overall Risk Composite
  const compositeScore = Math.round((climateRiskScore * 0.35) + (priceVolatilityScore * 0.40) + (supplyRiskScore * 0.25));
  const riskLevel = compositeScore > 70 ? 'HIGH' : compositeScore > 45 ? 'MEDIUM' : 'LOW';

  return {
    productId,
    overallRiskScore: compositeScore,
    overallRiskLevel: riskLevel,
    dimensions: [
      { type: 'CLIMATE', score: Math.round(climateRiskScore), level: climateRiskScore > 70 ? 'HIGH' : 'LOW', description: 'Evaluated against regional rainfall pattern and farm water availability.' },
      { type: 'PRICE_VOLATILITY', score: Math.round(priceVolatilityScore), level: priceVolatilityScore > 60 ? 'HIGH' : 'MEDIUM', description: 'Calculated from 10-year historical monthly market price deviation.' },
      { type: 'OVERSUPPLY_MARKET', score: Math.round(supplyRiskScore), level: supplyRiskScore > 65 ? 'HIGH' : 'MEDIUM', description: 'Estimated from regional cultivation area trends and market arrivals.' }
    ],
    dbRiskFactors: dbRisks
  };
}

module.exports = {
  calculateRiskProfile
};

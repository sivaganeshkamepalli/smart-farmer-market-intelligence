/**
 * Dynamic Land Allocation Engine
 * Divides farmer's total land into:
 * 1. LONG_TERM (Tree / Plantation / Fruit crops requiring years to mature)
 * 2. CONSTANT_DEMAND (Staples / Regular crops with consistent market demand)
 * 3. SEASONAL_DEMAND (Short-term high-value seasonal opportunity crops)
 *
 * Ratios are dynamically calculated based on land size, water availability, annual budget,
 * labor availability, and risk preference.
 */
function calculateLandAllocation(totalLandAcres, waterLevel = 'MEDIUM', budget = 100000, riskPreference = 'BALANCED') {
  const acres = parseFloat(totalLandAcres) || 2.0;

  let longTermRatio = 0.20;
  let constantRatio = 0.50;
  let seasonalRatio = 0.30;

  // Adjust by water level
  if (waterLevel === 'LOW' || waterLevel === 'VERY_LOW') {
    longTermRatio += 0.10; // Tree crops like Badam/Guava are drought tolerant once established
    seasonalRatio -= 0.10;
  } else if (waterLevel === 'HIGH' || waterLevel === 'VERY_HIGH') {
    seasonalRatio += 0.10;
    constantRatio -= 0.10;
  }

  // Adjust by risk preference
  if (riskPreference === 'LOW_RISK') {
    constantRatio += 0.15;
    seasonalRatio -= 0.15;
  } else if (riskPreference === 'HIGH_POTENTIAL') {
    seasonalRatio += 0.20;
    constantRatio -= 0.15;
    longTermRatio -= 0.05;
  }

  // Normalize ratios to sum to 1.0
  const totalRatio = longTermRatio + constantRatio + seasonalRatio;
  longTermRatio = parseFloat((longTermRatio / totalRatio).toFixed(2));
  constantRatio = parseFloat((constantRatio / totalRatio).toFixed(2));
  seasonalRatio = parseFloat((1.0 - (longTermRatio + constantRatio)).toFixed(2));

  // Compute exact acres
  const longTermAcres = parseFloat((acres * longTermRatio).toFixed(2));
  const constantAcres = parseFloat((acres * constantRatio).toFixed(2));
  const seasonalAcres = parseFloat((acres - (longTermAcres + constantAcres)).toFixed(2));

  return {
    totalArea: acres,
    areaUnit: 'acres',
    allocation: [
      {
        category: 'LONG_TERM',
        categoryLabel: 'Long-Term Crops (Tree / Estate)',
        percentage: Math.round(longTermRatio * 100),
        acres: longTermAcres,
        description: 'Multi-year tree crops (e.g., Badam, Guava, Pomegranate) providing long-term asset value and delayed high returns.'
      },
      {
        category: 'CONSTANT_DEMAND',
        categoryLabel: 'Constant Demand Crops (Staples / Regular)',
        percentage: Math.round(constantRatio * 100),
        acres: constantAcres,
        description: 'Stable-demand regular crops providing steady cash flow and low market volatility.'
      },
      {
        category: 'SEASONAL_DEMAND',
        categoryLabel: 'Seasonal Opportunity Crops',
        percentage: Math.round(seasonalRatio * 100),
        acres: seasonalAcres,
        description: 'Short-duration seasonal crops timed to capture festival and peak market price windows.'
      }
    ],
    rationale: `Land split calculated dynamically for ${acres} acres with ${waterLevel} water availability and ${riskPreference} risk profile.`
  };
}

module.exports = {
  calculateLandAllocation
};

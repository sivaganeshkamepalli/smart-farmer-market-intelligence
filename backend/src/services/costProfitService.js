const { query } = require('../config/db');

async function calculateCropEconomics(productId, landAcres = 1.0) {
  const acres = parseFloat(landAcres) || 1.0;

  // 1. Fetch Costs
  const costs = await query('SELECT * FROM cultivation_costs WHERE product_id = ?', [productId]);
  let initialCostPerAcre = 22000;
  let monthlyCostPerAcre = 3000;

  for (const c of costs) {
    if (c.period_type === 'INITIAL' || c.cost_type === 'SEED') {
      initialCostPerAcre = parseFloat(c.amount) || initialCostPerAcre;
    } else if (c.period_type === 'MONTHLY' || c.cost_type === 'LABOUR_MAINTENANCE') {
      monthlyCostPerAcre = parseFloat(c.amount) || monthlyCostPerAcre;
    }
  }

  // 2. Fetch Yield
  const yieldRecords = await query('SELECT * FROM yield_data WHERE product_id = ?', [productId]);
  const avgYieldPerAcre = yieldRecords.length > 0 ? parseFloat(yieldRecords[0].yield_average) : 10.0;
  const yieldUnit = yieldRecords.length > 0 ? yieldRecords[0].yield_unit : 'tons';

  // 3. Fetch Recent Prices for Revenue calculation
  const prices = await query(`
    SELECT average_price FROM market_prices 
    WHERE product_id = ? 
    ORDER BY date DESC LIMIT 6
  `, [productId]);

  let avgPricePerQuintal = 3200;
  if (prices.length > 0) {
    const sum = prices.reduce((acc, p) => acc + parseFloat(p.average_price), 0);
    avgPricePerQuintal = sum / prices.length;
  }

  // 1 Ton = 10 Quintals
  const avgPricePerTon = avgPricePerQuintal * 10;
  const expectedTotalYield = avgYieldPerAcre * acres;
  const expectedGrossRevenue = expectedTotalYield * avgPricePerTon;

  const totalInitialInvestment = initialCostPerAcre * acres;
  const totalSeasonalMaintenance = (monthlyCostPerAcre * 4) * acres; // 4-month season
  const totalCost = totalInitialInvestment + totalSeasonalMaintenance;
  const expectedNetProfit = expectedGrossRevenue - totalCost;

  // 4. Fetch multi-year economics if available
  const multiYear = await query(`
    SELECT * FROM long_term_crop_economics 
    WHERE product_id = ? 
    ORDER BY year_number ASC
  `, [productId]);

  const yearWiseCashFlow = multiYear.map(y => ({
    yearNumber: y.year_number,
    investment: parseFloat(y.investment) * acres,
    maintenanceCost: parseFloat(y.maintenance_cost) * acres,
    expectedYield: parseFloat(y.expected_yield) * acres,
    expectedRevenue: parseFloat(y.expected_revenue) * acres,
    expectedProfit: parseFloat(y.expected_profit) * acres
  }));

  return {
    productId,
    landAcres: acres,
    financialSummary: {
      initialInvestment: Math.round(totalInitialInvestment),
      seasonalMaintenanceCost: Math.round(totalSeasonalMaintenance),
      totalCost: Math.round(totalCost),
      expectedYield: parseFloat(expectedTotalYield.toFixed(2)),
      yieldUnit,
      avgPricePerUnit: Math.round(avgPricePerQuintal),
      priceUnit: 'Rs / quintal',
      expectedGrossRevenue: Math.round(expectedGrossRevenue),
      expectedNetProfit: Math.round(expectedNetProfit),
      roiPercentage: totalCost > 0 ? Math.round((expectedNetProfit / totalCost) * 100) : 0
    },
    yearWiseCashFlow
  };
}

module.exports = {
  calculateCropEconomics
};

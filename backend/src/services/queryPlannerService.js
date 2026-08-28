const { query } = require('../config/db');

async function executeQueryPlan(intent, entities) {
  const contextData = {
    farmerContext: null,
    productData: null,
    growthCharacteristics: null,
    waterRequirements: null,
    climateRequirements: null,
    historicalPrices: [],
    demandData: [],
    supplyData: [],
    costData: [],
    longTermEconomics: [],
    riskFactors: [],
    priceChangeFactors: [],
    upcomingEvents: [],
    candidateCrops: []
  };

  // 1. If product specified, fetch full product agronomics
  if (entities.productId) {
    const prods = await query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      JOIN categories c ON p.category_id = c.id 
      WHERE p.id = ?
    `, [entities.productId]);
    
    if (prods.length > 0) {
      contextData.productData = prods[0];
      
      // Growth & Water & Climate
      const growth = await query('SELECT * FROM product_growth_characteristics WHERE product_id = ?', [entities.productId]);
      contextData.growthCharacteristics = growth[0] || null;

      const water = await query('SELECT * FROM product_water_requirements WHERE product_id = ?', [entities.productId]);
      contextData.waterRequirements = water[0] || null;

      const climate = await query('SELECT * FROM product_climate_requirements WHERE product_id = ?', [entities.productId]);
      contextData.climateRequirements = climate[0] || null;

      // Costs
      contextData.costData = await query('SELECT * FROM cultivation_costs WHERE product_id = ?', [entities.productId]);

      // Long term economics if tree crop
      contextData.longTermEconomics = await query('SELECT * FROM long_term_crop_economics WHERE product_id = ? ORDER BY year_number ASC', [entities.productId]);

      // 10-year Monthly Prices
      contextData.historicalPrices = await query(`
        SELECT mp.*, m.name as market_name 
        FROM market_prices mp 
        JOIN markets m ON mp.market_id = m.id 
        WHERE mp.product_id = ? 
        ORDER BY mp.date DESC LIMIT 36
      `, [entities.productId]);

      // Demand & Supply
      contextData.demandData = await query('SELECT * FROM product_demand WHERE product_id = ? ORDER BY date DESC LIMIT 12', [entities.productId]);
      contextData.supplyData = await query('SELECT * FROM product_supply WHERE product_id = ? ORDER BY date DESC LIMIT 12', [entities.productId]);

      // Risks & Factors
      contextData.riskFactors = await query('SELECT * FROM risk_factors WHERE product_id = ?', [entities.productId]);
      contextData.priceChangeFactors = await query('SELECT * FROM price_change_factors WHERE product_id = ? ORDER BY id DESC LIMIT 10', [entities.productId]);
    }
  }

  // 2. If intent is CROP_RECOMMENDATION or SAFER_OPTION, retrieve top candidate crops matching water level
  if (intent === 'CROP_RECOMMENDATION' || intent === 'SAFER_OPTION' || !entities.productId) {
    const targetWater = entities.waterLevel || 'MEDIUM';
    
    contextData.candidateCrops = await query(`
      SELECT p.id, p.name, c.name as category_name, 
             pw.water_level, pw.drought_tolerance, pw.drip_suitability,
             pg.growth_type, pg.first_meaningful_harvest_years, pg.productive_lifespan_years,
             yd.yield_average, yd.yield_unit
      FROM products p
      JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_water_requirements pw ON p.id = pw.product_id
      LEFT JOIN product_growth_characteristics pg ON p.id = pg.product_id
      LEFT JOIN yield_data yd ON p.id = yd.product_id
      WHERE (pw.water_level = ? OR pw.water_level = 'LOW' OR pw.water_level = 'VERY_LOW')
      LIMIT 15
    `, [targetWater]);
  }

  // 3. Fetch Upcoming Seasonal Events
  contextData.upcomingEvents = await query(`
    SELECT e.*, epd.historical_demand_change_percentage, epd.historical_price_change_percentage 
    FROM events e
    LEFT JOIN event_product_demand epd ON e.id = epd.event_id
    ORDER BY e.start_date ASC LIMIT 5
  `);

  return contextData;
}

module.exports = {
  executeQueryPlan
};

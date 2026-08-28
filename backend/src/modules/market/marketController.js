const { query } = require('../../config/db');

async function getMarkets(req, res) {
  try {
    const markets = await query('SELECT * FROM markets ORDER BY name ASC');
    return res.json({ success: true, data: markets });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function getMarketPrices(req, res) {
  try {
    const { productId, marketId, years = 5 } = req.query;
    let sql = `
      SELECT mp.*, p.name as product_name, m.name as market_name 
      FROM market_prices mp
      JOIN products p ON mp.product_id = p.id
      JOIN markets m ON mp.market_id = m.id
      WHERE 1=1
    `;
    const params = [];

    if (productId) {
      sql += ` AND mp.product_id = ?`;
      params.push(productId);
    }
    if (marketId) {
      sql += ` AND mp.market_id = ?`;
      params.push(marketId);
    }

    sql += ` ORDER BY mp.date ASC LIMIT 120`;
    const prices = await query(sql, params);

    return res.json({ success: true, data: prices });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function getMarketDemand(req, res) {
  try {
    const { productId } = req.query;
    let sql = `
      SELECT pd.*, p.name as product_name 
      FROM product_demand pd
      JOIN products p ON pd.product_id = p.id
      WHERE 1=1
    `;
    const params = [];
    if (productId) {
      sql += ` AND pd.product_id = ?`;
      params.push(productId);
    }
    sql += ` ORDER BY pd.date DESC LIMIT 24`;
    const demand = await query(sql, params);
    return res.json({ success: true, data: demand });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function getMarketSupply(req, res) {
  try {
    const { productId } = req.query;
    let sql = `
      SELECT ps.*, p.name as product_name 
      FROM product_supply ps
      JOIN products p ON ps.product_id = p.id
      WHERE 1=1
    `;
    const params = [];
    if (productId) {
      sql += ` AND ps.product_id = ?`;
      params.push(productId);
    }
    sql += ` ORDER BY ps.date DESC LIMIT 24`;
    const supply = await query(sql, params);
    return res.json({ success: true, data: supply });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  getMarkets,
  getMarketPrices,
  getMarketDemand,
  getMarketSupply
};

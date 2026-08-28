const { query } = require('../../config/db');

async function getProducts(req, res) {
  try {
    const { search, category, waterLevel, growthType, page = 1, limit = 24 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    let sql = `
      SELECT p.id, p.name, p.scientific_name, p.description, c.name as category_name, c.code as category_code,
             pw.water_level, pw.drought_tolerance, pw.drip_suitability,
             pg.growth_type, pg.first_harvest_days, pg.productive_lifespan_years,
             yd.yield_average, yd.yield_unit
      FROM products p
      JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_water_requirements pw ON p.id = pw.product_id
      LEFT JOIN product_growth_characteristics pg ON p.id = pg.product_id
      LEFT JOIN yield_data yd ON p.id = yd.product_id
      WHERE 1=1
    `;

    const params = [];

    if (search) {
      sql += ` AND (p.name LIKE ? OR p.scientific_name LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      sql += ` AND (c.code = ? OR c.name = ?)`;
      params.push(category, category);
    }

    if (waterLevel) {
      sql += ` AND pw.water_level = ?`;
      params.push(waterLevel);
    }

    if (growthType) {
      sql += ` AND pg.growth_type = ?`;
      params.push(growthType);
    }

    // Count Total
    const countSql = `SELECT COUNT(DISTINCT p.id) as total FROM (${sql}) as sub`;
    const countResult = await query(countSql, params);
    const total = countResult[0]?.total || 0;

    sql += ` GROUP BY p.id ORDER BY p.id ASC LIMIT ${limitNum} OFFSET ${offset}`;
    const products = await query(sql, params);

    return res.json({
      success: true,
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function getProductById(req, res) {
  try {
    const id = req.params.id;

    const prods = await query(`
      SELECT p.*, c.name as category_name, c.code as category_code 
      FROM products p 
      JOIN categories c ON p.category_id = c.id 
      WHERE p.id = ?
    `, [id]);

    if (prods.length === 0) return res.status(404).json({ success: false, message: 'Product not found.' });
    const product = prods[0];

    product.growth = (await query('SELECT * FROM product_growth_characteristics WHERE product_id = ?', [id]))[0] || null;
    product.water = (await query('SELECT * FROM product_water_requirements WHERE product_id = ?', [id]))[0] || null;
    product.soil = (await query('SELECT * FROM product_soil_requirements WHERE product_id = ?', [id]))[0] || null;
    product.climate = (await query('SELECT * FROM product_climate_requirements WHERE product_id = ?', [id]))[0] || null;
    product.yieldData = await query('SELECT * FROM yield_data WHERE product_id = ?', [id]);
    product.costs = await query('SELECT * FROM cultivation_costs WHERE product_id = ?', [id]);
    product.longTermEconomics = await query('SELECT * FROM long_term_crop_economics WHERE product_id = ? ORDER BY year_number ASC', [id]);
    product.uses = await query('SELECT * FROM product_uses WHERE product_id = ?', [id]);
    product.risks = await query('SELECT * FROM risk_factors WHERE product_id = ?', [id]);
    product.technologies = await query(`
      SELECT ptc.*, ct.name as technology_name, ct.technology_type 
      FROM product_technology_compatibility ptc
      JOIN cultivation_technologies ct ON ptc.technology_id = ct.id
      WHERE ptc.product_id = ?
    `, [id]);
    product.recentPrices = await query(`
      SELECT mp.*, m.name as market_name 
      FROM market_prices mp 
      JOIN markets m ON mp.market_id = m.id 
      WHERE mp.product_id = ? 
      ORDER BY mp.date DESC LIMIT 24
    `, [id]);

    return res.json({ success: true, data: product });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function getCategories(req, res) {
  try {
    const categories = await query('SELECT * FROM categories ORDER BY name ASC');
    return res.json({ success: true, data: categories });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  getProducts,
  getProductById,
  getCategories
};

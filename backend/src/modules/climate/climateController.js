const { query } = require('../../config/db');

async function getClimateHistory(req, res) {
  try {
    const { regionId = 'ALL' } = req.query;
    const records = await query(`
      SELECT * FROM climate_records 
      ORDER BY date DESC LIMIT 24
    `);
    return res.json({ success: true, data: records });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function getClimateForecast(req, res) {
  try {
    const forecasts = await query(`
      SELECT * FROM climate_forecasts 
      ORDER BY forecast_date ASC LIMIT 12
    `);
    return res.json({ success: true, data: forecasts });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  getClimateHistory,
  getClimateForecast
};

const { query } = require('../../config/db');

async function getFarms(req, res) {
  try {
    const userId = req.user.id;
    const farms = await query('SELECT * FROM farms WHERE user_id = ? ORDER BY id DESC', [userId]);

    for (const farm of farms) {
      farm.plots = await query('SELECT * FROM farm_plots WHERE farm_id = ?', [farm.id]);
    }

    return res.json({ success: true, data: farms });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function createFarm(req, res) {
  try {
    const userId = req.user.id;
    const { farmName, totalArea, location, soilType, soilPh, waterAvailability, irrigationType, annualBudget } = req.body;

    const resFarm = await query(`
      INSERT INTO farms (user_id, farm_name, total_area, location, soil_type, soil_ph, water_availability, irrigation_type, annual_budget)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      userId, farmName || 'My Farm', parseFloat(totalArea) || 2.0, location || 'State',
      soilType || 'Red Loamy', parseFloat(soilPh) || 6.8, waterAvailability || 'MEDIUM',
      irrigationType || 'Drip Irrigation', parseFloat(annualBudget) || 100000
    ]);

    const farmId = resFarm.insertId;

    // Create default plot
    await query(`
      INSERT INTO farm_plots (farm_id, plot_name, area, soil_type, soil_ph, water_availability, irrigation_type)
      VALUES (?, 'Main Plot A', ?, ?, ?, ?, ?)
    `, [farmId, parseFloat(totalArea) || 2.0, soilType || 'Red Loamy', parseFloat(soilPh) || 6.8, waterAvailability || 'MEDIUM', irrigationType || 'Drip Irrigation']);

    const newFarm = (await query('SELECT * FROM farms WHERE id = ?', [farmId]))[0];
    newFarm.plots = await query('SELECT * FROM farm_plots WHERE farm_id = ?', [farmId]);

    return res.json({ success: true, message: 'Farm created successfully.', data: newFarm });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function getFarmById(req, res) {
  try {
    const userId = req.user.id;
    const farmId = req.params.id;

    const farms = await query('SELECT * FROM farms WHERE id = ? AND user_id = ?', [farmId, userId]);
    if (farms.length === 0) return res.status(404).json({ success: false, message: 'Farm not found.' });

    const farm = farms[0];
    farm.plots = await query('SELECT * FROM farm_plots WHERE farm_id = ?', [farmId]);

    return res.json({ success: true, data: farm });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  getFarms,
  createFarm,
  getFarmById
};

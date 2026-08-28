const { query } = require('../../config/db');

async function getProfile(req, res) {
  try {
    const userId = req.user.id;
    const profiles = await query('SELECT * FROM farmer_profiles WHERE user_id = ?', [userId]);
    return res.json({ success: true, data: profiles[0] || null });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function updateProfile(req, res) {
  try {
    const userId = req.user.id;
    const { fullName, preferredLanguage, state, district, village } = req.body;

    const existing = await query('SELECT id FROM farmer_profiles WHERE user_id = ?', [userId]);
    if (existing.length === 0) {
      await query(`
        INSERT INTO farmer_profiles (user_id, full_name, preferred_language, state, district, village)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [userId, fullName, preferredLanguage || 'English', state, district, village]);
    } else {
      await query(`
        UPDATE farmer_profiles 
        SET full_name = ?, preferred_language = ?, state = ?, district = ?, village = ?, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `, [fullName, preferredLanguage || 'English', state, district, village, userId]);
    }

    const updated = await query('SELECT * FROM farmer_profiles WHERE user_id = ?', [userId]);
    return res.json({ success: true, message: 'Profile updated successfully.', data: updated[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  getProfile,
  updateProfile
};

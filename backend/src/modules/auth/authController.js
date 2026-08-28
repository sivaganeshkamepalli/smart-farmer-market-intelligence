const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../../config/db');
const { JWT_SECRET } = require('../../middleware/authMiddleware');

// Dynamic OTP store with rate limiting & expiration
// Map key: phone number -> { otpHash, otpPlain, expiresAt, attempts, lastSentAt }
const otpStore = new Map();

async function register(req, res) {
  try {
    const { email, phone, password, fullName, state, district } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ success: false, message: 'Email or Mobile number is required.' });
    }

    const existing = await query('SELECT id FROM users WHERE email = ? OR phone = ?', [email || '', phone || '']);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'An account with this email or mobile number already exists.' });
    }

    const passwordHash = password ? await bcrypt.hash(password, 10) : null;
    const userRes = await query('INSERT INTO users (email, phone, password_hash, role) VALUES (?, ?, ?, ?)', [
      email || null, phone || null, passwordHash, 'FARMER'
    ]);
    const userId = userRes.insertId;

    await query('INSERT INTO farmer_profiles (user_id, full_name, preferred_language, phone, email, state, district) VALUES (?, ?, ?, ?, ?, ?, ?)', [
      userId, fullName || 'Farmer', 'English', phone || '', email || '', state || null, district || null
    ]);

    const token = jwt.sign({ id: userId, email, phone, role: 'FARMER' }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 3600 * 1000 });
    return res.json({ success: true, message: 'Registration successful!', data: { token, user: { id: userId, email, phone, fullName } } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function login(req, res) {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({ success: false, message: 'Email/Phone and password are required.' });
    }

    const users = await query('SELECT * FROM users WHERE email = ? OR phone = ?', [emailOrPhone, emailOrPhone]);
    if (users.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid email/phone or password.' });
    }

    const user = users[0];
    if (!user.password_hash) {
      return res.status(400).json({ success: false, message: 'Account exists without password. Please log in via Mobile OTP.' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ success: false, message: 'Invalid credentials.' });

    // Update last login
    await query('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

    const profiles = await query('SELECT * FROM farmer_profiles WHERE user_id = ?', [user.id]);
    const profile = profiles[0] || {};

    const token = jwt.sign({ id: user.id, email: user.email, phone: user.phone, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 3600 * 1000 });
    return res.json({ success: true, message: 'Login successful!', data: { token, user: { id: user.id, email: user.email, phone: user.phone, fullName: profile.full_name } } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function sendOTP(req, res) {
  try {
    const { phone } = req.body;
    if (!phone || phone.length < 10) {
      return res.status(400).json({ success: false, message: 'Valid 10-digit mobile number required.' });
    }

    // Rate Limiting: 60s cooldown between OTP requests
    const existingOTP = otpStore.get(phone);
    if (existingOTP && Date.now() - existingOTP.lastSentAt < 60 * 1000) {
      const waitSec = Math.ceil((60 * 1000 - (Date.now() - existingOTP.lastSentAt)) / 1000);
      return res.status(429).json({ success: false, message: `Please wait ${waitSec} seconds before requesting a new OTP.` });
    }

    // Generate Dynamic Random 6-digit OTP
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(generatedOTP, 10);

    otpStore.set(phone, {
      otpHash,
      otpPlain: generatedOTP, // Store for development verification log
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minute expiry
      attempts: 0,
      lastSentAt: Date.now()
    });

    console.log(`[DYNAMIC OTP GENERATED] Phone: ${phone} -> OTP: ${generatedOTP} (Valid for 5 mins)`);

    return res.json({
      success: true,
      message: `Dynamic OTP generated and sent to ${phone}. (Dev Verification OTP: ${generatedOTP})`
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function verifyOTP(req, res) {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Phone number and OTP required.' });
    }

    const record = otpStore.get(phone);

    if (!record) {
      return res.status(400).json({ success: false, message: 'No active OTP request found for this number. Please request a new OTP.' });
    }

    // Expiry Check
    if (record.expiresAt < Date.now()) {
      otpStore.delete(phone);
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new OTP.' });
    }

    // Attempts Check
    if (record.attempts >= 3) {
      otpStore.delete(phone);
      return res.status(400).json({ success: false, message: 'Maximum OTP verification attempts exceeded. Please request a new OTP.' });
    }

    // Verify OTP Match against Hash
    const isMatch = await bcrypt.compare(otp, record.otpHash);
    if (!isMatch) {
      record.attempts += 1;
      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${3 - record.attempts} attempt(s) remaining.`
      });
    }

    // OTP verified successfully - clear OTP record
    otpStore.delete(phone);

    // Find or create user
    let users = await query('SELECT * FROM users WHERE phone = ?', [phone]);
    let user;

    if (users.length === 0) {
      const uRes = await query('INSERT INTO users (phone, auth_provider, role) VALUES (?, ?, ?)', [phone, 'MOBILE_OTP', 'FARMER']);
      user = { id: uRes.insertId, phone, role: 'FARMER' };
      await query('INSERT INTO farmer_profiles (user_id, full_name, phone) VALUES (?, ?, ?)', [user.id, `Farmer ${phone.slice(-4)}`, phone]);
    } else {
      user = users[0];
      await query('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);
    }

    const token = jwt.sign({ id: user.id, phone: user.phone, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 3600 * 1000 });
    return res.json({ success: true, message: 'Mobile OTP Login successful!', data: { token, user } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function getCurrentUser(req, res) {
  try {
    const userId = req.user.id;
    const users = await query('SELECT id, email, phone, role, created_at, last_login_at FROM users WHERE id = ?', [userId]);
    if (users.length === 0) return res.status(401).json({ success: false, message: 'User account not found.' });

    const profiles = await query('SELECT * FROM farmer_profiles WHERE user_id = ?', [userId]);
    const farms = await query('SELECT * FROM farms WHERE user_id = ?', [userId]);

    return res.json({
      success: true,
      data: {
        user: users[0],
        profile: profiles[0] || null,
        farms
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function logout(req, res) {
  res.clearCookie('token');
  return res.json({ success: true, message: 'Logged out successfully.' });
}

module.exports = {
  register,
  login,
  sendOTP,
  verifyOTP,
  getCurrentUser,
  logout
};

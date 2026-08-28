const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'smart_farmer_super_secret_jwt_key_2026';

function authenticateToken(req, res, next) {
  // Check HttpOnly Cookie or Bearer Authorization header
  let token = req.cookies?.token;
  
  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in to access this resource.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session. Please log in again.'
    });
  }
}

module.exports = {
  authenticateToken,
  JWT_SECRET
};

const jwt = require('jsonwebtoken'); // Import jsonwebtoken
require('dotenv').config(); // Load environment variables

const jwtSecret = process.env.JWT_SECRET; // Get JWT secret from .env

// Middleware function to authenticate user via JWT
module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token'); // Common practice to send token in 'x-auth-token' header

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, jwtSecret); // Decodes the token using the secret

    // Attach user information from the token payload to the request object
    // This makes user ID and role available in subsequent route handlers
    req.user = decoded.user;
    next(); // Move to the next middleware/route handler
  } catch (err) {
    // Token is not valid
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
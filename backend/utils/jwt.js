const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "8sdf67df78df7dfsd98f7dsa9";

/**
 * Generates a JWT token for a user payload.
 * @param {Object} payload - Payload to sign, typically { id, role }
 * @returns {string} Signed JWT token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
};

/**
 * Verifies the JWT token and returns the decoded payload.
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken,
  JWT_SECRET,
};

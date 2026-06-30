const { verifyToken } = require("../utils/jwt");
const User = require("../models/User");

/**
 * Middleware to authenticate requests using JWT tokens.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for Bearer token in the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ error: "Not authorized, no token provided" });
    }

    // Verify token signature
    const decoded = verifyToken(token);

    // Fetch user details from database (excluding the password)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ error: "Not authorized, user not found" });
    }

    // Attach user payload to request
    req.user = user;
    next();
  } catch (err) {
    console.error("[authMiddleware] Token validation failed:", err);
    return res.status(401).json({ error: "Not authorized, token failed" });
  }
};

/**
 * Middleware to restrict endpoint access to users with the 'admin' role.
 */
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ error: "Access denied: admin access required" });
  }
};

/**
 * Role-specific middlewares
 */
const customerMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "customer") {
    next();
  } else {
    return res.status(403).json({ error: "Access denied: Customer role required" });
  }
};

const storeMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "store") {
    if (!req.user.isApproved) {
      return res.status(403).json({ error: "Access denied: Store owner not approved yet" });
    }
    next();
  } else {
    return res.status(403).json({ error: "Access denied: Store Owner role required" });
  }
};

const deliveryMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "delivery") {
    next();
  } else {
    return res.status(403).json({ error: "Access denied: Delivery Partner role required" });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ error: "Access denied: Admin role required" });
  }
};

module.exports = {
  protect,
  admin,
  customerMiddleware,
  storeMiddleware,
  deliveryMiddleware,
  adminMiddleware,
};

const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

// Custom authorization guard for admin or approved store owners
const adminOrStore = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || (req.user.role === "store" && req.user.isApproved))) {
    next();
  } else {
    return res.status(403).json({ error: "Access denied: admin or approved store owner role required" });
  }
};

// Authentication protected order endpoints
router.use(protect);

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.patch("/:id/status", adminOrStore, updateOrderStatus);

module.exports = router;


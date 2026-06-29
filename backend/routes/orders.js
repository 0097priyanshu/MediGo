const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

// Authentication protected order endpoints
router.use(protect);

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.patch("/:id/status", updateOrderStatus);

module.exports = router;

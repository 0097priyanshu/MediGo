const express = require("express");
const router = express.Router();
const { getDeliveryOrders, claimOrder, updateDeliveryStatus } = require("../controllers/deliveryController");
const { protect, deliveryMiddleware } = require("../middleware/authMiddleware");

// Route protection: requires login AND delivery partner role
router.get("/orders", protect, deliveryMiddleware, getDeliveryOrders);
router.post("/orders/:id/claim", protect, deliveryMiddleware, claimOrder);
router.patch("/orders/:id/status", protect, deliveryMiddleware, updateDeliveryStatus);

module.exports = router;

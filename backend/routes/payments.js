const express = require("express");
const router = express.Router();
const { createOrder, verifyPayment } = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

// Authentication protected payment routes
router.use(protect);

router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);

module.exports = router;
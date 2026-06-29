const { createOrderService, verifyPaymentService, getOrderService } = require("../services/paymentService");

/**
 * Handle creation of a new payment order.
 */
const createOrder = async (req, res, next) => {
  try {
    const { amount, currency } = req.body;
    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const orderData = await createOrderService(amount, currency);
    return res.status(200).json(orderData);
  } catch (err) {
    next(err);
  }
};

/**
 * Handle verification of the Razorpay signature to authorize the order.
 */
const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    const result = await verifyPaymentService(orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * Get the status of an order including simulated delivery details.
 */
const getOrderStatus = async (req, res, next) => {
  try {
    const id = req.params.id;
    const record = getOrderService(id);

    if (!record) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json(record);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getOrderStatus,
};

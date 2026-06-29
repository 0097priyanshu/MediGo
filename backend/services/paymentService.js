const crypto = require("crypto");

// In-memory store for orders
const orders = new Map();

/**
 * Simulates delivery tracking updates for mock orders.
 * @param {string} localId - The local order ID.
 */
function startDeliverySimulation(localId) {
  const route = [
    { lat: 12.9716, lng: 77.5946 },
    { lat: 12.9726, lng: 77.5956 },
    { lat: 12.9736, lng: 77.5966 },
  ];

  let idx = 0;

  const iv = setInterval(() => {
    const r = orders.get(localId);
    if (!r) return clearInterval(iv);

    r.delivery = route[Math.min(idx, route.length - 1)];
    if (idx === 0) r.status = "out_for_delivery";

    if (idx >= route.length) {
      r.status = "delivered";
      clearInterval(iv);
    }

    idx++;
  }, 10000);
}

/**
 * Creates a new order (integrates with Razorpay if keys are present, otherwise uses a demo mode fallback).
 * @param {number|string} amount - The transaction amount.
 * @param {string} [currency="INR"] - The currency of the transaction.
 */
const createOrderService = async (amount, currency = "INR") => {
  const numericAmount = Math.max(1, Number(amount) || 0);
  const localId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  const keyId =
    process.env.RZP_KEY_ID ||
    process.env.RAZORPAY_KEY_ID ||
    process.env.RAZORPAY_key_id ||
    process.env.RAZORPAY_KEYID ||
    process.env.RAZORPAY_ID ||
    process.env.RAZORPAY_KEY;

  const keySecret =
    process.env.RZP_KEY_SECRET ||
    process.env.RAZORPAY_KEY_SECRET ||
    process.env.RAZORPAY_live_key_secret ||
    process.env.RAZORPAY_key_secret ||
    process.env.RAZORPAY_SECRET;

  console.log("[payments] Razorpay keyId present:", !!keyId, "keySecret present:", !!keySecret);

  if (keyId && keySecret) {
    const Razorpay = require("razorpay");
    const rzp = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const rzpOrder = await rzp.orders.create({
      amount: numericAmount, // amount in the smallest currency unit (e.g. paise)
      currency,
      receipt: localId,
    });

    const record = {
      id: localId,
      amount: numericAmount,
      currency,
      status: "created",
      rzpOrderId: rzpOrder.id,
      delivery: null,
    };

    orders.set(localId, record);

    return {
      orderId: localId,
      rzpOrder,
      keyId,
    };
  }

  // Fallback demo mode order representation
  const fakeOrder = {
    id: localId,
    amount: numericAmount,
    currency,
  };

  const fakeRecord = {
    id: localId,
    amount: numericAmount,
    currency,
    status: "created",
    rzpOrderId: null,
    delivery: null,
  };

  orders.set(localId, fakeRecord);

  return {
    orderId: localId,
    rzpOrder: fakeOrder,
    keyId: null,
  };
};

/**
 * Validates the signature of a transaction and sets status to paid.
 * @param {string} orderId - The local order ID.
 * @param {string} razorpayOrderId - The Razorpay order ID.
 * @param {string} razorpayPaymentId - The Razorpay payment ID.
 * @param {string} razorpaySignature - The signature to be validated.
 */
const verifyPaymentService = async (orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
  const keySecret =
    process.env.RZP_KEY_SECRET ||
    process.env.RAZORPAY_KEY_SECRET ||
    process.env.RAZORPAY_live_key_secret ||
    process.env.RAZORPAY_key_secret ||
    process.env.RAZORPAY_SECRET;

  if (!orderId) {
    throw new Error("Order ID is required");
  }

  const record = orders.get(orderId);
  if (!record) {
    throw new Error("Order not found");
  }

  if (keySecret && razorpayOrderId && razorpayPaymentId && razorpaySignature) {
    const expected = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (expected !== razorpaySignature) {
      throw new Error("Invalid signature");
    }
  }

  record.status = "paid";
  orders.set(orderId, record);

  // Start simulated delivery updates
  startDeliverySimulation(orderId);

  return { ok: true, orderId };
};

/**
 * Gets details of a stored order.
 * @param {string} orderId - The order ID.
 */
const getOrderService = (orderId) => {
  const record = orders.get(orderId);
  return record || null;
};

module.exports = {
  createOrderService,
  verifyPaymentService,
  getOrderService,
};

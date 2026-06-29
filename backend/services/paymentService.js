const crypto = require("crypto");
const Order = require("../models/Order");

// In-memory store for legacy simulated orders
const orders = new Map();

/**
 * Simulates route tracking coordinates updates in memory for mock orders.
 */
function startDeliverySimulation(localId) {
  const route = [
    { lat: 12.9716, lng: 77.5946 },
    { lat: 12.9726, lng: 77.5956 },
    { lat: 12.9736, lng: 77.5966 },
  ];

  let idx = 0;

  const iv = setInterval(async () => {
    const r = orders.get(localId);
    if (!r) return clearInterval(iv);

    r.delivery = route[Math.min(idx, route.length - 1)];
    if (idx === 0) r.status = "out_for_delivery";

    if (idx >= route.length) {
      r.status = "delivered";
      clearInterval(iv);

      // Auto-update MongoDB orderStatus to Delivered if it matches ObjectId format
      if (localId.match(/^[0-9a-fA-F]{24}$/)) {
        try {
          const dbOrder = await Order.findById(localId);
          if (dbOrder) {
            dbOrder.orderStatus = "Delivered";
            await dbOrder.save();
            console.log(`[payments] Auto-marked MongoDB Order ${localId} as Delivered`);
          }
        } catch (err) {
          console.error("[payments] Error updating auto-delivery status:", err);
        }
      }
    }

    idx++;
  }, 10000);
}

/**
 * Creates a new Razorpay order.
 * @param {string} [orderId] - Optional Mongoose Order ID.
 * @param {number|string} [amount] - Fallback transaction amount.
 * @param {string} [currency="INR"] - The currency code.
 */
const createOrderService = async (orderId, amount, currency = "INR") => {
  let finalAmount = Number(amount) || 0;
  let receiptId = orderId ? orderId.toString() : `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  // If a Mongoose order is specified, load its actual amount
  if (orderId) {
    const dbOrder = await Order.findById(orderId);
    if (!dbOrder) {
      throw new Error(`Order not found with ID: ${orderId}`);
    }
    // Mongoose stores amount in Rupees, Razorpay expects paise (amount * 100)
    finalAmount = dbOrder.totalAmount * 100;
  }

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
      amount: Math.round(finalAmount),
      currency,
      receipt: receiptId,
    });

    const record = {
      id: receiptId,
      amount: finalAmount,
      currency,
      status: "created",
      rzpOrderId: rzpOrder.id,
      delivery: null,
    };
    orders.set(receiptId, record);

    return {
      orderId: receiptId,
      rzpOrder,
      keyId,
    };
  }

  // Fallback mock order representation
  const fakeOrder = {
    id: receiptId,
    amount: finalAmount,
    currency,
  };

  const fakeRecord = {
    id: receiptId,
    amount: finalAmount,
    currency,
    status: "created",
    rzpOrderId: null,
    delivery: null,
  };
  orders.set(receiptId, fakeRecord);

  return {
    orderId: receiptId,
    rzpOrder: fakeOrder,
    keyId: null,
  };
};

/**
 * Validates the signature of a transaction and marks payment status to paid.
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

  // 1. Verify cryptographic signature if Razorpay keys are configured
  if (keySecret && razorpayOrderId && razorpayPaymentId && razorpaySignature) {
    const expected = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (expected !== razorpaySignature) {
      if (orderId.match(/^[0-9a-fA-F]{24}$/)) {
        await Order.findByIdAndUpdate(orderId, { paymentStatus: "failed" });
      }
      throw new Error("Signature verification failed: payment invalid");
    }
  }

  // 2. Update Mongoose Order status to paid and Confirmed
  if (orderId.match(/^[0-9a-fA-F]{24}$/)) {
    const dbOrder = await Order.findById(orderId);
    if (dbOrder) {
      dbOrder.paymentStatus = "paid";
      dbOrder.orderStatus = "Confirmed";
      await dbOrder.save();
      console.log(`[payments] Verified and updated paymentStatus to paid for order ${orderId}`);
    }
  }

  // 3. Update legacy in-memory tracking status
  const record = orders.get(orderId);
  if (record) {
    record.status = "paid";
    orders.set(orderId, record);
  }

  // Start simulated delivery updates
  startDeliverySimulation(orderId);

  return { ok: true, orderId };
};

/**
 * Get details of stored legacy simulated order.
 */
const getOrderService = (orderId) => {
  return orders.get(orderId) || null;
};

module.exports = {
  createOrderService,
  verifyPaymentService,
  getOrderService,
};

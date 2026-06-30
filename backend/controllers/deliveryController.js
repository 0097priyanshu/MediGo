const Order = require("../models/Order");

/**
 * Returns delivery tasks split by state (Active, History, Unassigned).
 * GET /api/delivery/orders
 */
const getDeliveryOrders = async (req, res, next) => {
  try {
    const partnerId = req.user._id;

    // Active deliveries currently assigned to this partner
    const activeDeliveries = await Order.find({
      deliveryPartnerId: partnerId,
      orderStatus: { $in: ["Assigned", "Picked Up", "Out For Delivery", "OutForDelivery"] },
    }).populate("userId", "name email");

    // Historical completed deliveries
    const historyDeliveries = await Order.find({
      deliveryPartnerId: partnerId,
      orderStatus: "Delivered",
    }).populate("userId", "name email");

    // Unassigned orders that need delivery partners
    const unassignedDeliveries = await Order.find({
      deliveryPartnerId: { $exists: false },
      orderStatus: { $in: ["Placed", "Confirmed", "Packed"] },
    }).populate("userId", "name email");

    return res.status(200).json({
      active: activeDeliveries,
      history: historyDeliveries,
      unassigned: unassignedDeliveries,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Allows a delivery partner to claim an unassigned order.
 * POST /api/delivery/orders/:id/claim
 */
const claimOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.deliveryPartnerId) {
      return res.status(400).json({ error: "Order already assigned to a delivery partner" });
    }

    order.deliveryPartnerId = req.user._id;
    order.orderStatus = "Assigned";
    await order.save();

    return res.status(200).json({ message: "Order claimed successfully", order });
  } catch (err) {
    next(err);
  }
};

/**
 * Updates the delivery status of an order assigned to the partner.
 * PATCH /api/delivery/orders/:id/status
 */
const updateDeliveryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Assigned", "Picked Up", "Out For Delivery", "OutForDelivery", "Delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value provided" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Verify that the partner matches the assignee of the order
    if (!order.deliveryPartnerId || order.deliveryPartnerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Access denied: you are not assigned to this order" });
    }

    order.orderStatus = status;
    await order.save();

    return res.status(200).json({ message: "Order status updated successfully", order });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDeliveryOrders,
  claimOrder,
  updateDeliveryStatus,
};

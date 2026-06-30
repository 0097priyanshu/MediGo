const Order = require("../models/Order");
const Medicine = require("../models/Medicine");

/**
 * Create a new order.
 * POST /api/orders
 */
const createOrder = async (req, res, next) => {
  try {
    const { items, deliveryAddress } = req.body;
    const userId = req.user._id;

    // 1. Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Order items are required and must be a non-empty array" });
    }

    if (!deliveryAddress) {
      return res.status(400).json({ error: "Delivery address is required" });
    }

    let calculatedTotal = 0;
    const validatedItems = [];

    // 2. Validate stock levels & get prices
    for (const item of items) {
      const { medicineId, quantity } = item;

      if (!medicineId || !quantity || quantity <= 0) {
        return res.status(400).json({ error: "Each item must have a valid medicineId and quantity > 0" });
      }

      const medicine = await Medicine.findById(medicineId);
      if (!medicine) {
        return res.status(404).json({ error: `Medicine not found with ID ${medicineId}` });
      }

      if (medicine.stock < quantity) {
        return res.status(400).json({ error: `Insufficient stock for medicine: ${medicine.name} (Available: ${medicine.stock})` });
      }

      // Decrement stock levels
      medicine.stock -= quantity;
      await medicine.save();

      calculatedTotal += medicine.price * quantity;
      validatedItems.push({
        medicineId,
        quantity,
        price: medicine.price,
      });
    }

    // 3. Create the order record
    const order = await Order.create({
      userId,
      items: validatedItems,
      totalAmount: calculatedTotal,
      deliveryAddress,
      paymentStatus: "pending",
      orderStatus: "Placed",
    });

    return res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get orders (Admins see all, users only see their own).
 * GET /api/orders
 */
const getOrders = async (req, res, next) => {
  try {
    const filter = {};

    // Filter logic based on user role
    if (req.user.role === "store" && req.user.isApproved) {
      // Find all medicines that belong to this store's pharmacy
      const storeMeds = await Medicine.find({ pharmacyId: req.user.pharmacyId });
      const storeMedIds = storeMeds.map(m => m._id);
      
      // Filter orders containing these medicines
      filter["items.medicineId"] = { $in: storeMedIds };
    } else if (req.user.role !== "admin") {
      // Standard customers only view their own orders
      filter.userId = req.user._id;
    }

    const orders = await Order.find(filter)
      .populate("userId", "name email role")
      .populate("items.medicineId", "name category price imageUrl pharmacyId")
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

/**
 * Get details for a single order by ID.
 * GET /api/orders/:id
 */
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "name email role")
      .populate("items.medicineId", "name category price imageUrl pharmacyId");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Authorization check: must be owner, admin, or the store owner linked to one of the medicines
    let isStoreOwner = false;
    if (req.user.role === "store" && req.user.isApproved) {
      isStoreOwner = order.items.some(item => 
        item.medicineId && item.medicineId.pharmacyId && 
        item.medicineId.pharmacyId.toString() === req.user.pharmacyId.toString()
      );
    }

    if (req.user.role !== "admin" && !isStoreOwner && order.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Access denied: you do not have permission to view this order" });
    }

    return res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

/**
 * Update the status of an existing order.
 * PATCH /api/orders/:id/status
 */
const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    const validStatuses = [
      "Placed",
      "Confirmed",
      "Packed",
      "Assigned",
      "Picked Up",
      "Out For Delivery",
      "OutForDelivery",
      "Delivered"
    ];

    if (!orderStatus || !validStatuses.includes(orderStatus)) {
      return res.status(400).json({ error: `Invalid order status. Must be one of: ${validStatuses.join(", ")}` });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Authorization check: must be admin or store owner linked to this order
    let isStoreOwner = false;
    if (req.user.role === "store" && req.user.isApproved) {
      // Find all medicines in this store's pharmacy
      const storeMeds = await Medicine.find({ pharmacyId: req.user.pharmacyId });
      const storeMedIds = storeMeds.map(m => m._id.toString());
      
      isStoreOwner = order.items.some(item => 
        storeMedIds.includes(item.medicineId.toString())
      );
    }

    if (req.user.role !== "admin" && !isStoreOwner) {
      return res.status(403).json({ error: "Access denied: you do not have permission to update this order" });
    }

    order.orderStatus = orderStatus;

    // Simulate auto-paying if order moves to Confirmed (standard demo helper)
    if (orderStatus === "Confirmed") {
      order.paymentStatus = "paid";
    }

    const updatedOrder = await order.save();

    return res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
};

const mongoose = require("mongoose");
const { Schema } = mongoose;

// Order item schema definition
const orderItemSchema = new Schema({
  medicineId: { type: Schema.Types.ObjectId, ref: "Medicine", required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
});

// Order schema definition
const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: { type: [orderItemSchema], required: true },
  totalAmount: { type: Number, required: true, min: 0 },
  paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  orderStatus: {
    type: String,
    enum: ["Placed", "Confirmed", "Packed", "OutForDelivery", "Delivered"],
    default: "Placed",
  },
  deliveryAddress: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Avoid model overwrite errors during hot-reload
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

module.exports = Order;

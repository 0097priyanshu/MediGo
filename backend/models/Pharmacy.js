const mongoose = require("mongoose");
const { Schema } = mongoose;

// Pharmacy schema definition
const pharmacySchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  rating: { type: Number, default: 0 },
  isOpen: { type: Boolean, default: true },
});

// Avoid model overwrite errors during hot-reload
const Pharmacy = mongoose.models.Pharmacy || mongoose.model("Pharmacy", pharmacySchema);

module.exports = Pharmacy;

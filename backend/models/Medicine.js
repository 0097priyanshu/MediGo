const mongoose = require("mongoose");
const { Schema } = mongoose;

// Medicine schema definition
const medicineSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  imageUrl: { type: String },
  pharmacyId: { type: Schema.Types.ObjectId, ref: "Pharmacy", required: true },
});

// Avoid model overwrite errors during hot-reload
const Medicine = mongoose.models.Medicine || mongoose.model("Medicine", medicineSchema);

module.exports = Medicine;

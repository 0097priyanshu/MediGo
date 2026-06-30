const express = require("express");
const router = express.Router();
const {
  getPharmacies,
  getPharmacyById,
  createPharmacy,
  updatePharmacy,
  deletePharmacy,
  getNearbyPharmacies,
  getPharmacyMedicines,
} = require("../controllers/pharmacyController");

// Nearby search & custom discovery operations on Pharmacies
router.get("/nearby", getNearbyPharmacies);
router.get("/:id/medicines", getPharmacyMedicines);

// CRUD operations on Pharmacies
router.get("/", getPharmacies);
router.get("/:id", getPharmacyById);
router.post("/", createPharmacy);
router.put("/:id", updatePharmacy);
router.delete("/:id", deletePharmacy);

module.exports = router;

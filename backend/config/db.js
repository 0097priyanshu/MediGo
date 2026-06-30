const mongoose = require("mongoose");
const Pharmacy = require("../models/Pharmacy");
const Medicine = require("../models/Medicine");

/**
 * Seed database with instant commerce shops and medicines.
 */
const seedDatabase = async () => {
  try {
    const pharmacyCount = await Pharmacy.countDocuments();
    if (pharmacyCount > 0) {
      return; // Already populated
    }

    console.log("Seeding default pharmacies and medicines for Blinkit/Flipkart Minutes instant commerce simulation...");

    const pharmacies = [
      {
        name: "Blinkit Express Meds",
        address: "Sector 62, Noida, UP - 201301",
        phone: "+91 9876543210",
        rating: 4.8,
        isOpen: true,
        latitude: 28.6290,
        longitude: 77.3700,
      },
      {
        name: "Flipkart Minutes Pharmacy",
        address: "Connaught Place, New Delhi - 110001",
        phone: "+91 8765432109",
        rating: 4.9,
        isOpen: true,
        latitude: 28.6250,
        longitude: 77.3750,
      },
      {
        name: "Apollo 10-Minute Pharma",
        address: "Indiranagar, Bangalore, Karnataka - 560038",
        phone: "+91 7654321098",
        rating: 4.7,
        isOpen: true,
        latitude: 28.6310,
        longitude: 77.3770,
      },
      {
        name: "InstaMed 9-Min Delivery",
        address: "Andheri West, Mumbai, MH - 400053",
        phone: "+91 6543210987",
        rating: 4.6,
        isOpen: true,
        latitude: 28.6220,
        longitude: 77.3710,
      }
    ];

    const createdPharmacies = await Pharmacy.create(pharmacies);

    const baseMedicines = [
      {
        name: "Paracetamol 650mg",
        description: "Relieves fever, mild to moderate aches and bodily pains.",
        category: "Cough & Fever",
        price: 35.00,
        stock: 120,
        imageUrl: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&auto=format&fit=crop",
      },
      {
        name: "Cough Syrup (Honitus)",
        description: "Herbal cough remedy for instant sore throat and dry cough relief.",
        category: "Cough & Fever",
        price: 85.00,
        stock: 75,
        imageUrl: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=300&auto=format&fit=crop",
      },
      {
        name: "Aspirin 500mg",
        description: "Fast-acting analgesic for head cold, headaches, and inflammation.",
        category: "Cough & Fever",
        price: 45.00,
        stock: 90,
        imageUrl: "https://images.unsplash.com/photo-1607619056574-7b8d304f2c38?w=300&auto=format&fit=crop",
      },
      {
        name: "Volini Pain Spray",
        description: "Instant relief spray for muscle spasm, joint back pain, and sprains.",
        category: "Pain Relief",
        price: 130.00,
        stock: 50,
        imageUrl: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=300&auto=format&fit=crop",
      },
      {
        name: "Moov Pain Cream",
        description: "Fortified ointment for backache, neck fatigue, and muscle stiffness.",
        category: "Pain Relief",
        price: 95.00,
        stock: 60,
        imageUrl: "https://images.unsplash.com/photo-1616679911721-ebd6e4149668?w=300&auto=format&fit=crop",
      },
      {
        name: "Vitamin C Chewables (Limcee)",
        description: "Immune support, skin rejuvenation, and overall health defense.",
        category: "Wellness & Vitamins",
        price: 40.00,
        stock: 250,
        imageUrl: "https://images.unsplash.com/photo-1616679911721-ebd6e4149668?w=300&auto=format&fit=crop",
      },
      {
        name: "Zincovit Multi-Vitamins",
        description: "Essential dietary nutrients and minerals capsule pack.",
        category: "Wellness & Vitamins",
        price: 110.00,
        stock: 140,
        imageUrl: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&auto=format&fit=crop",
      },
      {
        name: "Dettol Antiseptic 100ml",
        description: "Liquid solution for cuts, scratches, skin disinfecting, and hygiene.",
        category: "First Aid & Care",
        price: 65.00,
        stock: 110,
        imageUrl: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=300&auto=format&fit=crop",
      },
      {
        name: "Band-Aid Strips (20 Pack)",
        description: "Waterproof minor wound covers with antiseptic healing cushions.",
        category: "First Aid & Care",
        price: 50.00,
        stock: 200,
        imageUrl: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=300&auto=format&fit=crop",
      },
      {
        name: "Eno Fruit Salt (Lemon Sachet)",
        description: "Quick bubbling antacid that relieves acidity and bloat within 6 seconds.",
        category: "Stomach Care",
        price: 9.00,
        stock: 500,
        imageUrl: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=300&auto=format&fit=crop",
      },
      {
        name: "Pudina Hara Liquid Pearls",
        description: "Fast cooling mint oil capsules for gas and indigestion relief.",
        category: "Stomach Care",
        price: 25.00,
        stock: 180,
        imageUrl: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&auto=format&fit=crop",
      }
    ];

    // Seed for each pharmacy
    for (const ph of createdPharmacies) {
      const phMeds = baseMedicines.map((m) => ({
        ...m,
        pharmacyId: ph._id,
      }));
      await Medicine.create(phMeds);
    }

    console.log("Database successfully populated with instant-delivery pharmacies and products.");
  } catch (err) {
    console.error("Database seeding failed:", err);
  }
};

/**
 * Connects to MongoDB database using Mongoose.
 */
const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL ?? "mongodb://localhost:27017/medigo";
    await mongoose.connect(mongoUrl);
    console.log("DB Connected");
    await seedDatabase();
  } catch (err) {
    console.error("Database connection error:", err);
  }
};

module.exports = connectDB;


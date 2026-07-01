const mongoose = require("mongoose");
const Pharmacy = require("../models/Pharmacy");
const Medicine = require("../models/Medicine");

/**
 * Seed database with instant commerce shops and medicines.
 */
const seedDatabase = async () => {
  try {
    console.log("Clearing old pharmacies and medicines for clean re-seeding...");
    await Pharmacy.deleteMany({});
    await Medicine.deleteMany({});

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
        name: "Dolo 650mg Tablet",
        description: "Relieves fever, mild to moderate headaches, and body pain. Contains Paracetamol.",
        category: "Cough & Fever",
        price: 30.00,
        stock: 120,
        imageUrl: "https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/cropped/mu5bahqxfrp28cut6que.jpg",
      },
      {
        name: "Dabur Honitus Cough Syrup",
        description: "Herbal cough remedy for instant sore throat and dry/wet cough relief. Non-drowsy formula.",
        category: "Cough & Fever",
        price: 85.00,
        stock: 75,
        imageUrl: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=300&auto=format&fit=crop",
      },
      {
        name: "Otrivin Nasal Spray",
        description: "Otrivin Oxy Fast Relief Adult Nasal Spray. Clears blocked nose in 25 seconds and lasts up to 6 hours.",
        category: "Cough & Fever",
        price: 110.00,
        stock: 90,
        imageUrl: "https://images.unsplash.com/photo-1602052446002-3c1aa327db04?w=300&auto=format&fit=crop",
      },
      {
        name: "Volini Pain Spray",
        description: "Instant relief spray for muscle spasm, joint back pain, and sprains. Micro-spray technology.",
        category: "Pain Relief",
        price: 140.00,
        stock: 50,
        imageUrl: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=300&auto=format&fit=crop",
      },
      {
        name: "Moov Pain Cream",
        description: "Fortified ointment for backache, neck fatigue, and muscle stiffness. 100% Ayurvedic formula.",
        category: "Pain Relief",
        price: 95.00,
        stock: 60,
        imageUrl: "https://images.unsplash.com/photo-1616679911721-ebd6e4149668?w=300&auto=format&fit=crop",
      },
      {
        name: "Limcee Vitamin C Chewables",
        description: "Orange flavored Vitamin C 500mg chewable tablets for immune support and skin health.",
        category: "Wellness & Vitamins",
        price: 40.00,
        stock: 250,
        imageUrl: "https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/hx2gxivwmeoxxxsc1hix.png",
      },
      {
        name: "Electral ORS Powder",
        description: "WHO formulation oral rehydration salts to restore energy and essential minerals from dehydration.",
        category: "Wellness & Vitamins",
        price: 22.00,
        stock: 140,
        imageUrl: "https://images.unsplash.com/photo-1547489432-cf93fa6c71ee?w=300&auto=format&fit=crop",
      },
      {
        name: "Rejuvenating Multivitamin Syrup",
        description: "High-quality herbal multivitamin syrup to restore energy, build daily strength, and boost vitality.",
        category: "Wellness & Vitamins",
        price: 150.00,
        stock: 60,
        imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=300&auto=format&fit=crop",
      },
      {
        name: "Dettol Antiseptic Liquid",
        description: "Liquid solution for cuts, scratches, skin disinfecting, bath hygiene, and surface disinfection.",
        category: "First Aid & Care",
        price: 65.00,
        stock: 110,
        imageUrl: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300&auto=format&fit=crop",
      },
      {
        name: "Band-Aid Strips (20 Pack)",
        description: "Waterproof minor wound covers with antiseptic healing cushions to prevent dirt and infections.",
        category: "First Aid & Care",
        price: 50.00,
        stock: 200,
        imageUrl: "https://images.unsplash.com/photo-1599839619722-3975141122a5?w=300&auto=format&fit=crop",
      },
      {
        name: "Sterile Cotton Swabs",
        description: "100% pure sterile cotton swabs in a jar for skin dressing, cosmetic application, and wound care.",
        category: "First Aid & Care",
        price: 35.00,
        stock: 100,
        imageUrl: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=300&auto=format&fit=crop",
      },
      {
        name: "Eno Fruit Salt (Lemon Sachet)",
        description: "Quick bubbling antacid that relieves acidity, bloating, and stomach discomfort in 6 seconds.",
        category: "Stomach Care",
        price: 9.00,
        stock: 500,
        imageUrl: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=300&auto=format&fit=crop",
      },
      {
        name: "Dabur Pudina Hara Pearls",
        description: "Fast cooling mint oil capsules for quick gas, bloating, and indigestion relief.",
        category: "Stomach Care",
        price: 25.00,
        stock: 180,
        imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&auto=format&fit=crop",
      },
      {
        name: "Antacid Liquid Gel (Mint)",
        description: "Fast acting antacid liquid gel for soothing heart burn, gas, and severe acidity relief.",
        category: "Stomach Care",
        price: 120.00,
        stock: 80,
        imageUrl: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=300&auto=format&fit=crop",
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

    console.log("Database successfully populated with real brand-name medicines and products.");
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

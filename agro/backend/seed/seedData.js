const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const Crop = require('../models/Crop');
const CropRequest = require('../models/CropRequest');

dotenv.config({ path: __dirname + '/../.env' });

const seedData = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await connectDB();

    console.log('[Seed] Clearing existing records...');
    await User.deleteMany({});
    await Crop.deleteMany({});
    await CropRequest.deleteMany({});

    console.log('[Seed] Seeding Users (1 Admin + 10 Realistic Farmers/Buyers)...');

    // Helper for hashing password during batch creation
    const salt = await bcrypt.genSalt(10);
    const hashedAdminPassword = await bcrypt.hash('admin123', salt);
    const hashedUserPassword = await bcrypt.hash('farmer123', salt);

    const usersData = [
      {
        name: 'AgroConnect Administrator',
        email: 'admin@agroconnect.com',
        password: hashedAdminPassword,
        phone: '+91 98765 00001',
        role: 'admin',
        address: 'National Agriculture Directorate, Krishi Bhavan, New Delhi'
      },
      {
        name: 'Ramesh Patel',
        email: 'ramesh@patelfarms.in',
        password: hashedUserPassword,
        phone: '+91 98251 34821',
        role: 'user',
        address: 'Plot 42, Anand Agricultural Belt, Anand, Gujarat'
      },
      {
        name: 'Gurpreet Singh',
        email: 'gurpreet@punjabagro.com',
        password: hashedUserPassword,
        phone: '+91 98140 82910',
        role: 'user',
        address: 'Kisan Vihar, Ludhiana Rural, Ludhiana, Punjab'
      },
      {
        name: 'Suresh Reddy',
        email: 'suresh@deccanfarms.co',
        password: hashedUserPassword,
        phone: '+91 94401 77321',
        role: 'user',
        address: 'Chilli Yard Road, Guntur Agro Hub, Guntur, Andhra Pradesh'
      },
      {
        name: 'Ananya Sharma',
        email: 'ananya@himalayanorchards.in',
        password: hashedUserPassword,
        phone: '+91 98160 55432',
        role: 'user',
        address: 'Kotgarh Valley Apple Orchards, Shimla, Himachal Pradesh'
      },
      {
        name: 'Rajesh Verma',
        email: 'rajesh@gangaorganic.in',
        password: hashedUserPassword,
        phone: '+91 94502 91823',
        role: 'user',
        address: 'Ganga Basin Organic Cluster, Mirzapur Road, Varanasi, Uttar Pradesh'
      },
      {
        name: 'Balvinder Kaur',
        email: 'balvinder@amritsargrains.com',
        password: hashedUserPassword,
        phone: '+91 98722 41098',
        role: 'user',
        address: 'Majha Agro Estates, GT Road, Amritsar, Punjab'
      },
      {
        name: 'Priya Sundaram',
        email: 'priya@coimbatoreproduce.in',
        password: hashedUserPassword,
        phone: '+91 94432 10987',
        role: 'user',
        address: 'Pollachi Coconut & Spices belt, Coimbatore, Tamil Nadu'
      },
      {
        name: 'Manoj Deshmukh',
        email: 'manoj@nashikvineyards.com',
        password: hashedUserPassword,
        phone: '+91 98220 34156',
        role: 'user',
        address: 'Dindori Valley Grape Farms, Nashik, Maharashtra'
      },
      {
        name: 'Vikram Meena',
        email: 'vikram@rajasthanspices.in',
        password: hashedUserPassword,
        phone: '+91 94141 87654',
        role: 'user',
        address: 'Hadoti Spice Corridor, Kota, Rajasthan'
      },
      {
        name: 'Tanvi Kulkarni',
        email: 'tanvi@greenplateorganics.com',
        password: hashedUserPassword,
        phone: '+91 98230 45678',
        role: 'user',
        address: 'GreenPlate Wholesale Procurement, APMC Yard, Vashi, Navi Mumbai'
      }
    ];

    // Direct insert to retain pre-hashed passwords
    const createdUsers = await User.insertMany(usersData);
    console.log(`[Seed] Created ${createdUsers.length} users.`);

    // Map user reference helpers
    const adminUser = createdUsers[0];
    const farmerRamesh = createdUsers[1];
    const farmerGurpreet = createdUsers[2];
    const farmerSuresh = createdUsers[3];
    const farmerAnanya = createdUsers[4];
    const farmerRajesh = createdUsers[5];
    const farmerBalvinder = createdUsers[6];
    const farmerPriya = createdUsers[7];
    const farmerManoj = createdUsers[8];
    const farmerVikram = createdUsers[9];
    const buyerTanvi = createdUsers[10];

    console.log('[Seed] Seeding 30 Realistic Agricultural Crop Records...');

    const cropsData = [
      // 1-5: Grains & Cereals
      {
        name: 'Traditional Basmati Paddy (Pusa 1121)',
        category: 'Grains & Cereals',
        farmer: farmerGurpreet._id,
        farmerName: farmerGurpreet.name,
        farmerPhone: farmerGurpreet.phone,
        location: 'Ludhiana, Punjab',
        quantity: 250,
        unit: 'quintal',
        pricePerUnit: 3850,
        harvestDate: new Date('2026-08-15'),
        organicStatus: true,
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
        description: 'Premium aged extra-long grain Pusa 1121 Basmati paddy harvested from fertile alluvial soil of Punjab. Sun-dried with moisture levels under 12%.',
        soilType: 'Alluvial Loam'
      },
      {
        name: 'Golden Sharbati Wheat Grains',
        category: 'Grains & Cereals',
        farmer: farmerBalvinder._id,
        farmerName: farmerBalvinder.name,
        farmerPhone: farmerBalvinder.phone,
        location: 'Amritsar, Punjab',
        quantity: 400,
        unit: 'quintal',
        pricePerUnit: 2450,
        harvestDate: new Date('2026-05-10'),
        organicStatus: false,
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
        description: 'Lustrous golden heavy Sharbati wheat grains, high in dietary protein and gluten strength, ideal for commercial flour milling.',
        soilType: 'Deep Black Alluvial'
      },
      {
        name: 'Organic Pearl Millet (Bajra)',
        category: 'Grains & Cereals',
        farmer: farmerVikram._id,
        farmerName: farmerVikram.name,
        farmerPhone: farmerVikram.phone,
        location: 'Kota, Rajasthan',
        quantity: 180,
        unit: 'quintal',
        pricePerUnit: 2100,
        harvestDate: new Date('2026-07-22'),
        organicStatus: true,
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=800&q=80',
        description: 'Drought-tolerant nutrient dense organic Bajra, packed with iron and magnesium, pesticide-free harvest.',
        soilType: 'Sandy Loam'
      },
      {
        name: 'Sweet Yellow Field Corn Maize',
        category: 'Grains & Cereals',
        farmer: farmerRamesh._id,
        farmerName: farmerRamesh.name,
        farmerPhone: farmerRamesh.phone,
        location: 'Anand, Gujarat',
        quantity: 320,
        unit: 'quintal',
        pricePerUnit: 1950,
        harvestDate: new Date('2026-06-18'),
        organicStatus: false,
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
        description: 'Evenly dried hybrid yellow maize kernels, optimal starch content for poultry feed and food processing.',
        soilType: 'Sandy Clay'
      },
      {
        name: 'Sona Masoori Raw Rice',
        category: 'Grains & Cereals',
        farmer: farmerSuresh._id,
        farmerName: farmerSuresh.name,
        farmerPhone: farmerSuresh.phone,
        location: 'Guntur, Andhra Pradesh',
        quantity: 500,
        unit: 'quintal',
        pricePerUnit: 3400,
        harvestDate: new Date('2026-08-01'),
        organicStatus: false,
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=800&q=80',
        description: 'Lightweight aromatic medium-grain rice cultivated in Krishna river delta, zero chemical residues.',
        soilType: 'Delta Alluvium'
      },

      // 6-10: Vegetables
      {
        name: 'Fresh Red Hybrid Tomatoes (Vaishali)',
        category: 'Vegetables',
        farmer: farmerManoj._id,
        farmerName: farmerManoj.name,
        farmerPhone: farmerManoj.phone,
        location: 'Nashik, Maharashtra',
        quantity: 1200,
        unit: 'kg',
        pricePerUnit: 28,
        harvestDate: new Date('2026-09-12'),
        organicStatus: false,
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
        description: 'Firm, juicy, high-lycopene crimson table tomatoes, excellent shelf life for transport to metropolitan wholesale markets.',
        soilType: 'Red Volcanic Loam'
      },
      {
        name: 'Pukhraj Cold-Storage Seed Potatoes',
        category: 'Vegetables',
        farmer: farmerRajesh._id,
        farmerName: farmerRajesh.name,
        farmerPhone: farmerRajesh.phone,
        location: 'Varanasi, Uttar Pradesh',
        quantity: 600,
        unit: 'quintal',
        pricePerUnit: 1450,
        harvestDate: new Date('2026-04-20'),
        organicStatus: false,
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
        description: 'Uniform oval-shaped Pukhraj potatoes with thin golden skin, minimal eye depth, graded A quality.',
        soilType: 'Deep Alluvial Sandy'
      },
      {
        name: 'Nashik Red Onions (Garwa Quality)',
        category: 'Vegetables',
        farmer: farmerManoj._id,
        farmerName: farmerManoj.name,
        farmerPhone: farmerManoj.phone,
        location: 'Nashik, Maharashtra',
        quantity: 350,
        unit: 'quintal',
        pricePerUnit: 2200,
        harvestDate: new Date('2026-07-30'),
        organicStatus: false,
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=80',
        description: 'Globally renowned Nashik pungent dark red bulb onions with tight skin wrappers, stored in ventilated chawls.',
        soilType: 'Black Cotton Loam'
      },
      {
        name: 'Organic Green Bell Peppers (Capsicum)',
        category: 'Vegetables',
        farmer: farmerRamesh._id,
        farmerName: farmerRamesh.name,
        farmerPhone: farmerRamesh.phone,
        location: 'Anand, Gujarat',
        quantity: 800,
        unit: 'kg',
        pricePerUnit: 42,
        harvestDate: new Date('2026-09-14'),
        organicStatus: true,
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80',
        description: 'Greenhouse polyhouse-grown crisp bell peppers with 4-lobed structure, vibrant green shine and zero pesticide spray.',
        soilType: 'Hydroponic & Peat Moss'
      },
      {
        name: 'Himalayan Snow White Cauliflower',
        category: 'Vegetables',
        farmer: farmerAnanya._id,
        farmerName: farmerAnanya.name,
        farmerPhone: farmerAnanya.phone,
        location: 'Shimla, Himachal Pradesh',
        quantity: 450,
        unit: 'crate',
        pricePerUnit: 350,
        harvestDate: new Date('2026-09-10'),
        organicStatus: true,
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=800&q=80',
        description: 'Mountain hill-grown tightly packed white curd cauliflower without discoloration, harvested in early morning frost.',
        soilType: 'Mountain Humus Soil'
      },

      // 11-15: Fruits
      {
        name: 'Royal Delicious Shimla Apples (Grade A)',
        category: 'Fruits',
        farmer: farmerAnanya._id,
        farmerName: farmerAnanya.name,
        farmerPhone: farmerAnanya.phone,
        location: 'Shimla, Himachal Pradesh',
        quantity: 600,
        unit: 'crate',
        pricePerUnit: 1650,
        harvestDate: new Date('2026-08-25'),
        organicStatus: true,
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
        description: 'Handpicked crisp, aromatic deep-red Royal Delicious apples grown at 7,500 ft elevation with chilled winter dormancy.',
        soilType: 'Mountain Loam'
      },
      {
        name: 'GI-Tagged Ratnagiri Alphonso Mangoes',
        category: 'Fruits',
        farmer: farmerManoj._id,
        farmerName: farmerManoj.name,
        farmerPhone: farmerManoj.phone,
        location: 'Nashik, Maharashtra',
        quantity: 300,
        unit: 'crate',
        pricePerUnit: 2200,
        harvestDate: new Date('2026-05-15'),
        organicStatus: true,
        status: 'Reserved',
        imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
        description: 'Authentic saffron-hued Alphonso mangoes, rich fiber-free creamy pulp with captivating aroma.',
        soilType: 'Laterite Soil'
      },
      {
        name: 'Nagpur Mandarin Oranges',
        category: 'Fruits',
        farmer: farmerRajesh._id,
        farmerName: farmerRajesh.name,
        farmerPhone: farmerRajesh.phone,
        location: 'Varanasi, Uttar Pradesh',
        quantity: 1500,
        unit: 'kg',
        pricePerUnit: 55,
        harvestDate: new Date('2026-09-05'),
        organicStatus: false,
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80',
        description: 'Juicy sweet-tart easy-peeling Nagpur oranges with high juice yield, fresh from orchard harvesting.',
        soilType: 'Black Clayey Soil'
      },
      {
        name: 'Export-Grade Thompson Seedless Grapes',
        category: 'Fruits',
        farmer: farmerManoj._id,
        farmerName: farmerManoj.name,
        farmerPhone: farmerManoj.phone,
        location: 'Nashik, Maharashtra',
        quantity: 800,
        unit: 'crate',
        pricePerUnit: 950,
        harvestDate: new Date('2026-03-20'),
        organicStatus: true,
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=800&q=80',
        description: 'Crisp green elongated berries with brix sweetness above 18, compliant with APEDA export standards.',
        soilType: 'Weathered Basalt Soil'
      },
      {
        name: 'Tender Pollachi Fresh Coconuts',
        category: 'Fruits',
        farmer: farmerPriya._id,
        farmerName: farmerPriya.name,
        farmerPhone: farmerPriya.phone,
        location: 'Coimbatore, Tamil Nadu',
        quantity: 2500,
        unit: 'kg',
        pricePerUnit: 35,
        harvestDate: new Date('2026-09-15'),
        organicStatus: true,
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?auto=format&fit=crop&w=800&q=80',
        description: 'Naturally sweet nutrient-rich tender green coconuts containing 450-550ml of clear electrolyte-packed water.',
        soilType: 'Red Loam and Coastal Alluvium'
      },

      // 16-20: Pulses & Legumes
      {
        name: 'Organic Unpolished Arhar/Tur Dal',
        category: 'Pulses & Legumes',
        farmer: farmerSuresh._id,
        farmerName: farmerSuresh.name,
        farmerPhone: farmerSuresh.phone,
        location: 'Guntur, Andhra Pradesh',
        quantity: 120,
        unit: 'quintal',
        pricePerUnit: 9200,
        harvestDate: new Date('2026-07-15'),
        organicStatus: true,
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        description: 'Traditional laser-sorted unpolished pigeon pea split dal, retaining natural aleurone layer and superior aroma upon cooking.',
        soilType: 'Red Sandy Loam'
      },
      {
        name: 'Kabuli Chana (Chickpeas Extra Bold 12mm)',
        category: 'Pulses & Legumes',
        farmer: farmerVikram._id,
        farmerName: farmerVikram.name,
        farmerPhone: farmerVikram.phone,
        location: 'Kota, Rajasthan',
        quantity: 150,
        unit: 'quintal',
        pricePerUnit: 8400,
        harvestDate: new Date('2026-06-01'),
        organicStatus: false,
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80',
        description: 'Export-quality extra-bold 12mm white chickpeas with smooth skin and high water absorption capacity.',
        soilType: 'Clayey Loam'
      },
      {
        name: 'High-Protein Green Moong Beans',
        category: 'Pulses & Legumes',
        farmer: farmerRamesh._id,
        farmerName: farmerRamesh.name,
        farmerPhone: farmerRamesh.phone,
        location: 'Anand, Gujarat',
        quantity: 110,
        unit: 'quintal',
        pricePerUnit: 7800,
        harvestDate: new Date('2026-08-10'),
        organicStatus: true,
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=800&q=80',
        description: 'Small whole bright green gram seeds with over 98% germination rate, great for edible sprouts and dal.',
        soilType: 'Sandy Loam'
      },
      {
        name: 'Organic Black Urad Whole (Guntur)',
        category: 'Pulses & Legumes',
        farmer: farmerSuresh._id,
        farmerName: farmerSuresh.name,
        farmerPhone: farmerSuresh.phone,
        location: 'Guntur, Andhra Pradesh',
        quantity: 90,
        unit: 'quintal',
        pricePerUnit: 8100,
        harvestDate: new Date('2026-07-05'),
        organicStatus: true,
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80',
        description: 'Organically raised deep black matpe beans, vital for South Indian idli-dosa fermentation cultures.',
        soilType: 'Heavy Black Clay'
      },
      {
        name: 'Red Masoor Malka Dal',
        category: 'Pulses & Legumes',
        farmer: farmerRajesh._id,
        farmerName: farmerRajesh.name,
        farmerPhone: farmerRajesh.phone,
        location: 'Varanasi, Uttar Pradesh',
        quantity: 140,
        unit: 'quintal',
        pricePerUnit: 6700,
        harvestDate: new Date('2026-05-25'),
        organicStatus: false,
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=800&q=80',
        description: 'Dehusked orange-red whole lentil seeds, cooks quickly with velvety texture and savory taste.',
        soilType: 'Silty Alluvium'
      },

      // 21-25: Spices
      {
        name: 'Malabar Bold Black Pepper (Tellicherry TGSEB)',
        category: 'Spices',
        farmer: farmerPriya._id,
        farmerName: farmerPriya.name,
        farmerPhone: farmerPriya.phone,
        location: 'Coimbatore, Tamil Nadu',
        quantity: 45,
        unit: 'quintal',
        pricePerUnit: 52000,
        harvestDate: new Date('2026-04-10'),
        organicStatus: true,
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80',
        description: 'Sun-cured heavy-density Tellicherry Garbled Special Extra Bold peppercorns with intense piperine pungency and complex citrus aroma.',
        soilType: 'Humus Rich Forest Soil'
      },
      {
        name: 'Guntur Sannam S4 Dry Red Chillies',
        category: 'Spices',
        farmer: farmerSuresh._id,
        farmerName: farmerSuresh.name,
        farmerPhone: farmerSuresh.phone,
        location: 'Guntur, Andhra Pradesh',
        quantity: 210,
        unit: 'quintal',
        pricePerUnit: 18500,
        harvestDate: new Date('2026-06-20'),
        organicStatus: false,
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80',
        description: 'World-famous Guntur Sannam S4 dried stems-intact chillies, brilliant dark scarlet color and SHU heat rating of 35,000.',
        soilType: 'Black Cotton Clay'
      },
      {
        name: 'Alleppey Finger Turmeric (Curcumin 5.2%)',
        category: 'Spices',
        farmer: farmerPriya._id,
        farmerName: farmerPriya.name,
        farmerPhone: farmerPriya.phone,
        location: 'Coimbatore, Tamil Nadu',
        quantity: 130,
        unit: 'quintal',
        pricePerUnit: 12800,
        harvestDate: new Date('2026-05-18'),
        organicStatus: true,
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
        description: 'Polished hard cured turmeric fingers with verified laboratory curcumin assay of 5.2%, medicinal and culinary grade.',
        soilType: 'Loamy Red Alluvial'
      },
      {
        name: 'Rajasthan Machine-Cleaned Cumin (Jeera)',
        category: 'Spices',
        farmer: farmerVikram._id,
        farmerName: farmerVikram.name,
        farmerPhone: farmerVikram.phone,
        location: 'Kota, Rajasthan',
        quantity: 85,
        unit: 'quintal',
        pricePerUnit: 26500,
        harvestDate: new Date('2026-06-15'),
        organicStatus: true,
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
        description: 'Singapore 99% purity sorted cumin seeds, rich essential oil profile and crisp aromatic fragrance.',
        soilType: 'Sandy Loam'
      },
      {
        name: 'Organic Green Cardamom (8mm Jumbo)',
        category: 'Spices',
        farmer: farmerPriya._id,
        farmerName: farmerPriya.name,
        farmerPhone: farmerPriya.phone,
        location: 'Coimbatore, Tamil Nadu',
        quantity: 35,
        unit: 'quintal',
        pricePerUnit: 145000,
        harvestDate: new Date('2026-08-30'),
        organicStatus: true,
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
        description: 'Flawless emerald green 8mm+ jumbo pods from Western Ghats shade plantations, kiln dried for freshness.',
        soilType: 'Lateritic Forest Loam'
      },

      // 26-30: Cash Crops
      {
        name: 'Long Staple Raw Cotton (Shankar-6)',
        category: 'Cash Crops',
        farmer: farmerRamesh._id,
        farmerName: farmerRamesh.name,
        farmerPhone: farmerRamesh.phone,
        location: 'Anand, Gujarat',
        quantity: 500,
        unit: 'quintal',
        pricePerUnit: 6800,
        harvestDate: new Date('2026-04-12'),
        organicStatus: false,
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?auto=format&fit=crop&w=800&q=80',
        description: 'Pristine white Shankar-6 cotton bolls with 28.5mm fibre staple length and micronaire value 3.8-4.2.',
        soilType: 'Deep Black Cotton Soil'
      },
      {
        name: 'High-Sucrose Fresh Sugarcane (Co 0238)',
        category: 'Cash Crops',
        farmer: farmerRajesh._id,
        farmerName: farmerRajesh.name,
        farmerPhone: farmerRajesh.phone,
        location: 'Varanasi, Uttar Pradesh',
        quantity: 120,
        unit: 'ton',
        pricePerUnit: 3400,
        harvestDate: new Date('2026-09-01'),
        organicStatus: false,
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
        description: 'Thick juicy stalks of Co 0238 early-maturing cane with brix level over 20%, harvested ready for sugar crushing mills.',
        soilType: 'Fertile Alluvium'
      },
      {
        name: 'Natural Raw Golden Jute Fiber (TD-5)',
        category: 'Cash Crops',
        farmer: farmerRajesh._id,
        farmerName: farmerRajesh.name,
        farmerPhone: farmerRajesh.phone,
        location: 'Varanasi, Uttar Pradesh',
        quantity: 160,
        unit: 'quintal',
        pricePerUnit: 4900,
        harvestDate: new Date('2026-08-08'),
        organicStatus: true,
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1528458876861-544fd1761a91?auto=format&fit=crop&w=800&q=80',
        description: 'Water-retted clean golden tossa jute fibers with strong tensile strength, ideal for eco-friendly geo-textiles and sacks.',
        soilType: 'Floodplain Clay Loam'
      },
      {
        name: 'Assam Whole Leaf Orthodox Black Tea',
        category: 'Cash Crops',
        farmer: farmerAnanya._id,
        farmerName: farmerAnanya.name,
        farmerPhone: farmerAnanya.phone,
        location: 'Shimla, Himachal Pradesh',
        quantity: 65,
        unit: 'quintal',
        pricePerUnit: 28000,
        harvestDate: new Date('2026-07-19'),
        organicStatus: true,
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
        description: 'Second-flush golden tipped orthodox tea leaves delivering a brisk malty cup with copper liquor.',
        soilType: 'Acidic Mountain Loam'
      },
      {
        name: 'Arabica Plantation AAA Green Coffee Beans',
        category: 'Cash Crops',
        farmer: farmerPriya._id,
        farmerName: farmerPriya.name,
        farmerPhone: farmerPriya.phone,
        location: 'Coimbatore, Tamil Nadu',
        quantity: 90,
        unit: 'quintal',
        pricePerUnit: 34500,
        harvestDate: new Date('2026-03-10'),
        organicStatus: true,
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80',
        description: 'Wet-processed washed high-altitude Arabica green beans with screen size 19+, fine acidity and notes of wild berries.',
        soilType: 'Laterite High-Humus Loam'
      }
    ];

    const createdCrops = await Crop.insertMany(cropsData);
    console.log(`[Seed] Created ${createdCrops.length} realistic Crop records.`);

    console.log('[Seed] Seeding 15 Realistic Crop Procurement Requests...');

    const requestsData = [
      {
        buyer: buyerTanvi._id,
        buyerName: buyerTanvi.name,
        buyerEmail: buyerTanvi.email,
        crop: createdCrops[0]._id,
        cropName: createdCrops[0].name,
        farmer: createdCrops[0].farmer,
        requestedQuantity: 25,
        unit: 'quintal',
        unitPrice: createdCrops[0].pricePerUnit,
        totalPrice: 25 * createdCrops[0].pricePerUnit,
        deliveryAddress: 'GreenPlate Wholesale Depot, Vashi APMC Terminal, Navi Mumbai',
        contactPhone: '+91 98230 45678',
        notes: 'Requirement for export packing. Moisture certificate needed on delivery.',
        status: 'Approved'
      },
      {
        buyer: buyerTanvi._id,
        buyerName: buyerTanvi.name,
        buyerEmail: buyerTanvi.email,
        crop: createdCrops[5]._id,
        cropName: createdCrops[5].name,
        farmer: createdCrops[5].farmer,
        requestedQuantity: 300,
        unit: 'kg',
        unitPrice: createdCrops[5].pricePerUnit,
        totalPrice: 300 * createdCrops[5].pricePerUnit,
        deliveryAddress: 'GreenPlate Central Kitchen, Pune Agro Park, Pune',
        contactPhone: '+91 98230 45678',
        notes: 'Please ensure refrigerated crate delivery to avoid bruising.',
        status: 'In Transit'
      },
      {
        buyer: buyerTanvi._id,
        buyerName: buyerTanvi.name,
        buyerEmail: buyerTanvi.email,
        crop: createdCrops[10]._id,
        cropName: createdCrops[10].name,
        farmer: createdCrops[10].farmer,
        requestedQuantity: 50,
        unit: 'crate',
        unitPrice: createdCrops[10].pricePerUnit,
        totalPrice: 50 * createdCrops[10].pricePerUnit,
        deliveryAddress: 'GreenPlate Fruit Distribution Center, Bandra Kurla Complex, Mumbai',
        contactPhone: '+91 98230 45678',
        notes: 'Grade A royal delicious apples for organic retail shelves.',
        status: 'Completed'
      },
      {
        buyer: farmerRamesh._id,
        buyerName: farmerRamesh.name,
        buyerEmail: farmerRamesh.email,
        crop: createdCrops[1]._id,
        cropName: createdCrops[1].name,
        farmer: createdCrops[1].farmer,
        requestedQuantity: 40,
        unit: 'quintal',
        unitPrice: createdCrops[1].pricePerUnit,
        totalPrice: 40 * createdCrops[1].pricePerUnit,
        deliveryAddress: 'Patel Agro Processing Plant, Highway 8, Anand, Gujarat',
        contactPhone: '+91 98251 34821',
        notes: 'Procurement for local flour production line.',
        status: 'Pending'
      },
      {
        buyer: farmerSuresh._id,
        buyerName: farmerSuresh.name,
        buyerEmail: farmerSuresh.email,
        crop: createdCrops[2]._id,
        cropName: createdCrops[2].name,
        farmer: createdCrops[2].farmer,
        requestedQuantity: 30,
        unit: 'quintal',
        unitPrice: createdCrops[2].pricePerUnit,
        totalPrice: 30 * createdCrops[2].pricePerUnit,
        deliveryAddress: 'Deccan Organic Cattle Feed Facility, Guntur',
        contactPhone: '+91 94401 77321',
        notes: 'Certified organic batch verification required.',
        status: 'Pending'
      },
      {
        buyer: buyerTanvi._id,
        buyerName: buyerTanvi.name,
        buyerEmail: buyerTanvi.email,
        crop: createdCrops[20]._id,
        cropName: createdCrops[20].name,
        farmer: createdCrops[20].farmer,
        requestedQuantity: 5,
        unit: 'quintal',
        unitPrice: createdCrops[20].pricePerUnit,
        totalPrice: 5 * createdCrops[20].pricePerUnit,
        deliveryAddress: 'GreenPlate Specialty Spice Vault, Navi Mumbai',
        contactPhone: '+91 98230 45678',
        notes: 'Tellicherry black pepper for gourmet spice packaging.',
        status: 'Approved'
      },
      {
        buyer: farmerGurpreet._id,
        buyerName: farmerGurpreet.name,
        buyerEmail: farmerGurpreet.email,
        crop: createdCrops[25]._id,
        cropName: createdCrops[25].name,
        farmer: createdCrops[25].farmer,
        requestedQuantity: 50,
        unit: 'quintal',
        unitPrice: createdCrops[25].pricePerUnit,
        totalPrice: 50 * createdCrops[25].pricePerUnit,
        deliveryAddress: 'Punjab Textile Spinners Hub, Focal Point, Ludhiana',
        contactPhone: '+91 98140 82910',
        notes: 'Baled Shankar-6 cotton for yarn spinning.',
        status: 'In Transit'
      },
      {
        buyer: farmerBalvinder._id,
        buyerName: farmerBalvinder.name,
        buyerEmail: farmerBalvinder.email,
        crop: createdCrops[15]._id,
        cropName: createdCrops[15].name,
        farmer: createdCrops[15].farmer,
        requestedQuantity: 20,
        unit: 'quintal',
        unitPrice: createdCrops[15].pricePerUnit,
        totalPrice: 20 * createdCrops[15].pricePerUnit,
        deliveryAddress: 'Amritsar Wholesale Grain Mandi, Shop 12B, Amritsar',
        contactPhone: '+91 98722 41098',
        notes: 'Unpolished Arhar dal for cooperative retail distribution.',
        status: 'Completed'
      },
      {
        buyer: farmerRajesh._id,
        buyerName: farmerRajesh.name,
        buyerEmail: farmerRajesh.email,
        crop: createdCrops[21]._id,
        cropName: createdCrops[21].name,
        farmer: createdCrops[21].farmer,
        requestedQuantity: 15,
        unit: 'quintal',
        unitPrice: createdCrops[21].pricePerUnit,
        totalPrice: 15 * createdCrops[21].pricePerUnit,
        deliveryAddress: 'Varanasi Masala Mill, Industrial Area, Mirzapur Road',
        contactPhone: '+91 94502 91823',
        notes: 'S4 dried red chillies for hot spice blend.',
        status: 'Pending'
      },
      {
        buyer: farmerAnanya._id,
        buyerName: farmerAnanya.name,
        buyerEmail: farmerAnanya.email,
        crop: createdCrops[8]._id,
        cropName: createdCrops[8].name,
        farmer: createdCrops[8].farmer,
        requestedQuantity: 150,
        unit: 'kg',
        unitPrice: createdCrops[8].pricePerUnit,
        totalPrice: 150 * createdCrops[8].pricePerUnit,
        deliveryAddress: 'Shimla Eco-Resort Kitchen, Mall Road, Shimla',
        contactPhone: '+91 98160 55432',
        notes: 'Fresh greenhouse bell peppers for kitchen supplies.',
        status: 'Approved'
      },
      {
        buyer: buyerTanvi._id,
        buyerName: buyerTanvi.name,
        buyerEmail: buyerTanvi.email,
        crop: createdCrops[22]._id,
        cropName: createdCrops[22].name,
        farmer: createdCrops[22].farmer,
        requestedQuantity: 10,
        unit: 'quintal',
        unitPrice: createdCrops[22].pricePerUnit,
        totalPrice: 10 * createdCrops[22].pricePerUnit,
        deliveryAddress: 'GreenPlate Organics Depot, Sector 19, Vashi',
        contactPhone: '+91 98230 45678',
        notes: 'High curcumin Alleppey turmeric fingers for wellness product line.',
        status: 'In Transit'
      },
      {
        buyer: farmerManoj._id,
        buyerName: farmerManoj.name,
        buyerEmail: farmerManoj.email,
        crop: createdCrops[14]._id,
        cropName: createdCrops[14].name,
        farmer: createdCrops[14].farmer,
        requestedQuantity: 400,
        unit: 'kg',
        unitPrice: createdCrops[14].pricePerUnit,
        totalPrice: 400 * createdCrops[14].pricePerUnit,
        deliveryAddress: 'Nashik Hospitality Suppliers, College Road, Nashik',
        contactPhone: '+91 98220 34156',
        notes: 'Fresh sweet tender coconuts.',
        status: 'Pending'
      },
      {
        buyer: farmerVikram._id,
        buyerName: farmerVikram.name,
        buyerEmail: farmerVikram.email,
        crop: createdCrops[3]._id,
        cropName: createdCrops[3].name,
        farmer: createdCrops[3].farmer,
        requestedQuantity: 50,
        unit: 'quintal',
        unitPrice: createdCrops[3].pricePerUnit,
        totalPrice: 50 * createdCrops[3].pricePerUnit,
        deliveryAddress: 'Kota Cattle Feed Mills, Kota Industrial Area',
        contactPhone: '+91 94141 87654',
        notes: 'Field corn maize order for cattle feed compounding.',
        status: 'Completed'
      },
      {
        buyer: buyerTanvi._id,
        buyerName: buyerTanvi.name,
        buyerEmail: buyerTanvi.email,
        crop: createdCrops[17]._id,
        cropName: createdCrops[17].name,
        farmer: createdCrops[17].farmer,
        requestedQuantity: 15,
        unit: 'quintal',
        unitPrice: createdCrops[17].pricePerUnit,
        totalPrice: 15 * createdCrops[17].pricePerUnit,
        deliveryAddress: 'GreenPlate Packaging Unit, Turbhe MIDC, Navi Mumbai',
        contactPhone: '+91 98230 45678',
        notes: 'Green moong whole for vacuum retail packing.',
        status: 'Approved'
      },
      {
        buyer: farmerPriya._id,
        buyerName: farmerPriya.name,
        buyerEmail: farmerPriya.email,
        crop: createdCrops[29]._id,
        cropName: createdCrops[29].name,
        farmer: createdCrops[29].farmer,
        requestedQuantity: 10,
        unit: 'quintal',
        unitPrice: createdCrops[29].pricePerUnit,
        totalPrice: 10 * createdCrops[29].pricePerUnit,
        deliveryAddress: 'Coimbatore Artisanal Roastery, RS Puram, Coimbatore',
        contactPhone: '+91 94432 10987',
        notes: 'Arabica green beans for specialty batch roasting.',
        status: 'Pending'
      }
    ];

    const createdRequests = await CropRequest.insertMany(requestsData);
    console.log(`[Seed] Created ${createdRequests.length} realistic Crop Procurement Requests.`);

    console.log('\n======================================================');
    console.log(' SEEDING COMPLETED SUCCESSFULLY');
    console.log(' Admin Login: admin@agroconnect.com / admin123');
    console.log(' User Login:  ramesh@patelfarms.in  / farmer123');
    console.log('              tanvi@greenplateorganics.com / farmer123');
    console.log(' Total Users: ' + createdUsers.length);
    console.log(' Total Crops: ' + createdCrops.length);
    console.log(' Total Requests: ' + createdRequests.length);
    console.log('======================================================\n');

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedData();

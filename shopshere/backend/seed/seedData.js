require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { connectDB, disconnectDB } = require('../config/db');

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Review = require('../models/Review');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

// 10 Categories
const categoriesData = [
  {
    name: 'Electronics',
    description: 'Smart devices, gadgets, and consumer electronics',
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Mobile Phones',
    description: 'Latest flagship and budget smartphones',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Laptops',
    description: 'High-performance laptops, ultrabooks, and workstations',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Headphones',
    description: 'Noise-cancelling headphones, earbuds, and audio gear',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Cameras',
    description: 'DSLR, mirrorless cameras, and photography gear',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: "Men's Clothing",
    description: 'Modern men’s fashion, shirts, jackets, and casual wear',
    image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: "Women's Clothing",
    description: 'Trendy women’s apparel, dresses, tops, and outerwear',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Shoes',
    description: 'Athletic running shoes, sneakers, and casual boots',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Home & Kitchen',
    description: 'Kitchen appliances, cookware, and modern home essentials',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Books',
    description: 'Bestselling fiction, non-fiction, and personal development',
    image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&auto=format&fit=crop&q=80'
  }
];

// 1 Admin and 10 Customers
const rawUsersData = [
  {
    name: 'Admin User',
    email: 'admin@shopsphere.com',
    password: 'Admin@123',
    phone: '+1 800 555 0199',
    role: 'ADMIN',
    address: { street: '100 Admin Plaza Suite 500', city: 'Tech Metropolis', state: 'CA', pincode: '94016' }
  },
  {
    name: 'Sophia Williams',
    email: 'sophia.williams@example.com',
    password: 'Password@123',
    phone: '+1 415 555 2671',
    role: 'CUSTOMER',
    address: { street: '42 Pine Crest Way', city: 'San Francisco', state: 'CA', pincode: '94107' }
  },
  {
    name: 'Liam Johnson',
    email: 'liam.johnson@example.com',
    password: 'Password@123',
    phone: '+1 212 555 3892',
    role: 'CUSTOMER',
    address: { street: '158 Elmwood Terrace', city: 'New York', state: 'NY', pincode: '10001' }
  },
  {
    name: 'Emma Brown',
    email: 'emma.brown@example.com',
    password: 'Password@123',
    phone: '+1 312 555 9481',
    role: 'CUSTOMER',
    address: { street: '784 Lake Shore Blvd', city: 'Chicago', state: 'IL', pincode: '60611' }
  },
  {
    name: 'Noah Davis',
    email: 'noah.davis@example.com',
    password: 'Password@123',
    phone: '+1 206 555 6321',
    role: 'CUSTOMER',
    address: { street: '319 Olympic View Rd', city: 'Seattle', state: 'WA', pincode: '98101' }
  },
  {
    name: 'Olivia Martinez',
    email: 'olivia.martinez@example.com',
    password: 'Password@123',
    phone: '+1 305 555 8823',
    role: 'CUSTOMER',
    address: { street: '512 Ocean Breeze Dr', city: 'Miami', state: 'FL', pincode: '33139' }
  },
  {
    name: 'Lucas Garcia',
    email: 'lucas.garcia@example.com',
    password: 'Password@123',
    phone: '+1 512 555 4910',
    role: 'CUSTOMER',
    address: { street: '89 Congress Ave', city: 'Austin', state: 'TX', pincode: '78701' }
  },
  {
    name: 'Ava Robinson',
    email: 'ava.robinson@example.com',
    password: 'Password@123',
    phone: '+1 617 555 7734',
    role: 'CUSTOMER',
    address: { street: '64 Beacon Street Apt 3B', city: 'Boston', state: 'MA', pincode: '02108' }
  },
  {
    name: 'Ethan Miller',
    email: 'ethan.miller@example.com',
    password: 'Password@123',
    phone: '+1 720 555 1290',
    role: 'CUSTOMER',
    address: { street: '210 Aspen Peak Dr', city: 'Denver', state: 'CO', pincode: '80202' }
  },
  {
    name: 'Mia Wilson',
    email: 'mia.wilson@example.com',
    password: 'Password@123',
    phone: '+1 404 555 8312',
    role: 'CUSTOMER',
    address: { street: '93 Peachtree St', city: 'Atlanta', state: 'GA', pincode: '30303' }
  },
  {
    name: 'James Anderson',
    email: 'james.anderson@example.com',
    password: 'Password@123',
    phone: '+1 619 555 0419',
    role: 'CUSTOMER',
    address: { street: '74 Harbor Point Blvd', city: 'San Diego', state: 'CA', pincode: '92101' }
  }
];

// 100 Products (10 per category)
const getProductsData = (catMap) => [
  // 1. Electronics (10 items)
  {
    name: 'Anker 737 Power Bank 24000mAh',
    description: 'Ultra-powerful 140W two-way fast charging portable battery with smart digital display for laptops and phones.',
    price: 149.99,
    discountPrice: 119.99,
    brand: 'Anker',
    category: catMap['Electronics'],
    image: 'https://images.unsplash.com/photo-1609592426860-23a31c5b4970?w=800&auto=format&fit=crop&q=80',
    stock: 25,
    rating: 4.8,
    isFeatured: true
  },
  {
    name: 'Apple Watch Series 9 GPS 45mm',
    description: 'Advanced health metrics with blood oxygen monitoring, always-on Retina display, and S9 SiP dual-core chip.',
    price: 429.00,
    discountPrice: 389.00,
    brand: 'Apple',
    category: catMap['Electronics'],
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
    stock: 18,
    rating: 4.9,
    isFeatured: true
  },
  {
    name: 'Logitech MX Master 3S Wireless Mouse',
    description: 'Quiet clicks 8K DPI track-on-glass sensor with MagSpeed electromagnetic scrolling and ergonomic thumb rest.',
    price: 99.99,
    discountPrice: 89.99,
    brand: 'Logitech',
    category: catMap['Electronics'],
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
    stock: 45,
    rating: 4.8,
    isFeatured: true
  },
  {
    name: 'Samsung 32-Inch Smart Monitor M8',
    description: 'UHD 4K streaming monitor with detachable SlimFit camera, AirPlay integration, and built-in Smart TV apps.',
    price: 699.99,
    discountPrice: 579.99,
    brand: 'Samsung',
    category: catMap['Electronics'],
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
    stock: 6, // Low stock
    rating: 4.5,
    isFeatured: false
  },
  {
    name: 'Belkin BoostCharge Pro 3-in-1 MagSafe Stand',
    description: 'Fast wireless charging station for iPhone 15/14/13, Apple Watch, and AirPods with sleek stainless steel arms.',
    price: 149.95,
    discountPrice: 129.95,
    brand: 'Belkin',
    category: catMap['Electronics'],
    image: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=800&auto=format&fit=crop&q=80',
    stock: 30,
    rating: 4.6,
    isFeatured: false
  },
  {
    name: 'SanDisk Extreme Pro 1TB Portable SSD',
    description: 'Rugged NVMe solid state drive with up to 2000MB/s read/write speeds, IP55 dust and water resistance.',
    price: 159.99,
    discountPrice: 139.99,
    brand: 'SanDisk',
    category: catMap['Electronics'],
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80',
    stock: 4, // Low stock
    rating: 4.7,
    isFeatured: false
  },
  {
    name: 'Google Nest Hub Max Smart Display',
    description: '10-inch HD screen with Nest Cam, stereo speakers, and hands-free Google Assistant for your smart home.',
    price: 229.00,
    discountPrice: 199.00,
    brand: 'Google',
    category: catMap['Electronics'],
    image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&auto=format&fit=crop&q=80',
    stock: 14,
    rating: 4.4,
    isFeatured: false
  },
  {
    name: 'Elgato Stream Deck MK.2',
    description: 'Studio controller with 15 customizable LCD keys for triggering live stream actions, scenes, and workflows.',
    price: 149.99,
    discountPrice: 0,
    brand: 'Elgato',
    category: catMap['Electronics'],
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80',
    stock: 22,
    rating: 4.9,
    isFeatured: false
  },
  {
    name: 'Keychron Q1 Pro Wireless Mechanical Keyboard',
    description: 'Custom QMK/VIA programmable mechanical keyboard with CNC aluminum body and hot-swappable switches.',
    price: 199.00,
    discountPrice: 179.00,
    brand: 'Keychron',
    category: catMap['Electronics'],
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    stock: 16,
    rating: 4.8,
    isFeatured: false
  },
  {
    name: 'Amazon Kindle Paperwhite Signature Edition 32GB',
    description: '6.8-inch glare-free display with auto-adjusting warm front light and wireless charging for book lovers.',
    price: 189.99,
    discountPrice: 159.99,
    brand: 'Amazon',
    category: catMap['Electronics'],
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    stock: 35,
    rating: 4.7,
    isFeatured: false
  },

  // 2. Mobile Phones (10 items)
  {
    name: 'Samsung Galaxy S24 Ultra 512GB',
    description: 'Titanium frame with Galaxy AI, 200MP camera system, built-in S Pen, and Snapdragon 8 Gen 3 processor.',
    price: 1419.99,
    discountPrice: 1299.99,
    brand: 'Samsung',
    category: catMap['Mobile Phones'],
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80',
    stock: 15,
    rating: 4.9,
    isFeatured: true
  },
  {
    name: 'Apple iPhone 15 Pro Max 256GB',
    description: 'Aerospace-grade titanium design with A17 Pro chip, Action button, 5x optical zoom camera, and USB-C.',
    price: 1199.00,
    discountPrice: 1149.00,
    brand: 'Apple',
    category: catMap['Mobile Phones'],
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
    stock: 20,
    rating: 4.9,
    isFeatured: true
  },
  {
    name: 'Google Pixel 8 Pro 128GB',
    description: 'Engineered by Google with Tensor G3 chip, Best Take photography, Super Actua display, and 7 years of OS updates.',
    price: 999.00,
    discountPrice: 799.00,
    brand: 'Google',
    category: catMap['Mobile Phones'],
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
    stock: 22,
    rating: 4.7,
    isFeatured: false
  },
  {
    name: 'OnePlus 12 512GB Emerald Green',
    description: 'Snapdragon 8 Gen 3 with 4th Gen Hasselblad Camera, 100W SuperVOOC charging, and 2K 120Hz ProXDR display.',
    price: 899.99,
    discountPrice: 799.99,
    brand: 'OnePlus',
    category: catMap['Mobile Phones'],
    image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80',
    stock: 19,
    rating: 4.6,
    isFeatured: false
  },
  {
    name: 'Samsung Galaxy A56 5G 128GB',
    description: 'Vibrant 6.6-inch Super AMOLED 120Hz screen with 50MP triple camera setup, IP67 water resistance, and 5000mAh battery.',
    price: 449.99,
    discountPrice: 389.99,
    brand: 'Samsung',
    category: catMap['Mobile Phones'],
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80',
    stock: 5, // Low stock
    rating: 4.5,
    isFeatured: false
  },
  {
    name: 'Motorola Razr+ 2024 Flip 256GB',
    description: 'Iconic foldable phone with expansive 4-inch external display, teardrop zero-gap hinge, and Snapdragon 8s Gen 3.',
    price: 999.99,
    discountPrice: 849.99,
    brand: 'Motorola',
    category: catMap['Mobile Phones'],
    image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&auto=format&fit=crop&q=80',
    stock: 9, // Low stock
    rating: 4.4,
    isFeatured: false
  },
  {
    name: 'Xiaomi 14 Ultra Leica Photography Kit',
    description: 'Quad 50MP optical Leica camera array with 1-inch sensor, stepless variable aperture, and Snapdragon 8 Gen 3.',
    price: 1299.00,
    discountPrice: 1199.00,
    brand: 'Xiaomi',
    category: catMap['Mobile Phones'],
    image: 'https://images.unsplash.com/photo-1533228896884-3b5f79ee13d5?w=800&auto=format&fit=crop&q=80',
    stock: 8, // Low stock
    rating: 4.8,
    isFeatured: false
  },
  {
    name: 'Sony Xperia 1 VI 256GB',
    description: 'Professional creator phone with true optical zoom telephoto lens, OLED 120Hz display, and dedicated shutter button.',
    price: 1399.99,
    discountPrice: 0,
    brand: 'Sony',
    category: catMap['Mobile Phones'],
    image: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=800&auto=format&fit=crop&q=80',
    stock: 11,
    rating: 4.6,
    isFeatured: false
  },
  {
    name: 'Asus ROG Phone 8 Pro 512GB Gaming Phone',
    description: 'Extreme gaming performance with AniMe Vision mini-LED rear display, AirTrigger shoulder buttons, and 165Hz AMOLED.',
    price: 1199.99,
    discountPrice: 1099.99,
    brand: 'Asus',
    category: catMap['Mobile Phones'],
    image: 'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800&auto=format&fit=crop&q=80',
    stock: 13,
    rating: 4.7,
    isFeatured: false
  },
  {
    name: 'Nothing Phone 2a 128GB White',
    description: 'Transparent iconic Glyph interface with Dimensity 7200 Pro processor and clean Nothing OS 2.5 experience.',
    price: 349.00,
    discountPrice: 319.00,
    brand: 'Nothing',
    category: catMap['Mobile Phones'],
    image: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800&auto=format&fit=crop&q=80',
    stock: 35,
    rating: 4.5,
    isFeatured: false
  },

  // 3. Laptops (10 items)
  {
    name: 'Apple MacBook Air 15-inch M3 16GB',
    description: 'Incredibly thin aluminum design with Liquid Retina display, up to 18 hours battery life, and MagSafe charging.',
    price: 1499.00,
    discountPrice: 1349.00,
    brand: 'Apple',
    category: catMap['Laptops'],
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    stock: 24,
    rating: 4.9,
    isFeatured: true
  },
  {
    name: 'Dell XPS 16 9640 OLED Laptop',
    description: 'InfinityEdge 4K OLED touch display powered by Intel Core Ultra 9 processor and NVIDIA GeForce RTX 4070.',
    price: 2499.99,
    discountPrice: 2299.99,
    brand: 'Dell',
    category: catMap['Laptops'],
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80',
    stock: 7, // Low stock
    rating: 4.7,
    isFeatured: true
  },
  {
    name: 'Lenovo ThinkPad X1 Carbon Gen 12',
    description: 'Legendary business ultrabook weighing just 2.4 lbs with carbon fiber lid, ergonomic keyboard, and Intel Evo platform.',
    price: 1899.00,
    discountPrice: 1699.00,
    brand: 'Lenovo',
    category: catMap['Laptops'],
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
    stock: 14,
    rating: 4.8,
    isFeatured: false
  },
  {
    name: 'ASUS ROG Zephyrus G16 Gaming Laptop',
    description: 'Ultra-slim 16-inch gaming powerhouse with 240Hz OLED ROG Nebula display, Intel Core Ultra 9, and RTX 4080.',
    price: 2699.99,
    discountPrice: 2499.99,
    brand: 'ASUS',
    category: catMap['Laptops'],
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80',
    stock: 8, // Low stock
    rating: 4.8,
    isFeatured: false
  },
  {
    name: 'HP Spectre x360 2-in-1 14-inch',
    description: 'Convertible touchscreen laptop with 2.8K OLED display, 9MP webcam, AI noise cancellation, and tilt stylus pen.',
    price: 1549.99,
    discountPrice: 1399.99,
    brand: 'HP',
    category: catMap['Laptops'],
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
    stock: 12,
    rating: 4.6,
    isFeatured: false
  },
  {
    name: 'Apple MacBook Pro 16-inch M3 Max',
    description: 'Extreme workstation performance with 36GB unified memory, Liquid Retina XDR screen, and HDMI / SD card ports.',
    price: 3499.00,
    discountPrice: 3299.00,
    brand: 'Apple',
    category: catMap['Laptops'],
    image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80',
    stock: 6, // Low stock
    rating: 5.0,
    isFeatured: false
  },
  {
    name: 'Microsoft Surface Laptop 6 13.5-inch',
    description: 'Sleek PixelSense touchscreen, whisper-quiet typing, Intel Core Ultra 7 processor, and Omnisonic speakers.',
    price: 1199.99,
    discountPrice: 1049.99,
    brand: 'Microsoft',
    category: catMap['Laptops'],
    image: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=800&auto=format&fit=crop&q=80',
    stock: 19,
    rating: 4.5,
    isFeatured: false
  },
  {
    name: 'Razer Blade 14 Gaming Ultrabook',
    description: 'Compact CNC aluminum chassis with AMD Ryzen 9 8945HS, NVIDIA RTX 4070, and QHD+ 240Hz high-speed display.',
    price: 2399.99,
    discountPrice: 2199.99,
    brand: 'Razer',
    category: catMap['Laptops'],
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80',
    stock: 11,
    rating: 4.7,
    isFeatured: false
  },
  {
    name: 'Acer Swift Go 14 OLED Laptop',
    description: 'Lightweight budget powerhouse featuring 2.8K 90Hz OLED screen, Intel Core Ultra 5, and dual Thunderbolt 4 ports.',
    price: 799.99,
    discountPrice: 699.99,
    brand: 'Acer',
    category: catMap['Laptops'],
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
    stock: 30,
    rating: 4.4,
    isFeatured: false
  },
  {
    name: 'LG Gram 17-inch Ultra-Lightweight Laptop',
    description: 'Massive 17-inch WQXGA anti-glare display inside an astonishingly light 2.98 lb magnesium alloy body with 80Wh battery.',
    price: 1699.99,
    discountPrice: 1499.99,
    brand: 'LG',
    category: catMap['Laptops'],
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop&q=80',
    stock: 15,
    rating: 4.6,
    isFeatured: false
  },

  // 4. Headphones (10 items)
  {
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling',
    description: 'Industry-leading noise cancellation with two processors and 8 microphones for unmatched silence and crystal calls.',
    price: 399.99,
    discountPrice: 329.99,
    brand: 'Sony',
    category: catMap['Headphones'],
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    stock: 35,
    rating: 4.9,
    isFeatured: true
  },
  {
    name: 'Apple AirPods Max Space Gray',
    description: 'High-fidelity audio with computational audio, custom acoustic design, active noise cancellation, and transparency mode.',
    price: 549.00,
    discountPrice: 479.00,
    brand: 'Apple',
    category: catMap['Headphones'],
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
    stock: 18,
    rating: 4.8,
    isFeatured: true
  },
  {
    name: 'Bose QuietComfort Ultra Headphones',
    description: 'World-class active noise cancellation with breakthrough Bose Immersive Audio for lifelike spatial sound experience.',
    price: 429.00,
    discountPrice: 379.00,
    brand: 'Bose',
    category: catMap['Headphones'],
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80',
    stock: 26,
    rating: 4.8,
    isFeatured: false
  },
  {
    name: 'Sennheiser Momentum 4 Wireless Over-Ear',
    description: 'Incredible 60-hour battery life with audiophile-inspired 42mm transducer system and adaptive noise cancellation.',
    price: 379.95,
    discountPrice: 299.95,
    brand: 'Sennheiser',
    category: catMap['Headphones'],
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
    stock: 20,
    rating: 4.7,
    isFeatured: false
  },
  {
    name: 'Sony WF-1000XM5 True Wireless Earbuds',
    description: 'Miniature earbuds featuring high-precision Dynamic Driver X units and multi-point Bluetooth connection.',
    price: 299.99,
    discountPrice: 249.99,
    brand: 'Sony',
    category: catMap['Headphones'],
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    stock: 3, // Low stock
    rating: 4.7,
    isFeatured: false
  },
  {
    name: 'Apple AirPods Pro 2nd Gen with USB-C',
    description: 'Up to 2x more Active Noise Cancellation with Adaptive Audio, Conversation Awareness, and personalized spatial audio.',
    price: 249.00,
    discountPrice: 199.00,
    brand: 'Apple',
    category: catMap['Headphones'],
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80',
    stock: 50,
    rating: 4.9,
    isFeatured: false
  },
  {
    name: 'Bowers & Wilkins Px7 S2e Headphones',
    description: 'Luxurious British sound engineering with custom angled 40mm drive units and 24-bit DSP audio processing.',
    price: 399.00,
    discountPrice: 0,
    brand: 'Bowers & Wilkins',
    category: catMap['Headphones'],
    image: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=800&auto=format&fit=crop&q=80',
    stock: 8, // Low stock
    rating: 4.8,
    isFeatured: false
  },
  {
    name: 'Audio-Technica ATH-M50xBT2 Professional Studio',
    description: 'Legendary M50x studio sound signature with Bluetooth 5.0 wireless convenience and 50 hours battery life.',
    price: 199.00,
    discountPrice: 169.00,
    brand: 'Audio-Technica',
    category: catMap['Headphones'],
    image: 'https://images.unsplash.com/photo-1578319439584-104c94d37305?w=800&auto=format&fit=crop&q=80',
    stock: 28,
    rating: 4.7,
    isFeatured: false
  },
  {
    name: 'Shure AONIC 50 Gen 2 Wireless Studio Headphones',
    description: 'Premium studio-grade listening with customized spatial audio modes and hybrid active noise cancellation technology.',
    price: 349.00,
    discountPrice: 299.00,
    brand: 'Shure',
    category: catMap['Headphones'],
    image: 'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&auto=format&fit=crop&q=80',
    stock: 15,
    rating: 4.6,
    isFeatured: false
  },
  {
    name: 'Marshall Major IV Wireless Bluetooth Headphones',
    description: 'Iconic Marshall rock aesthetic with 80+ solid hours of wireless playtime, quick charging, and multi-directional control knob.',
    price: 149.99,
    discountPrice: 129.99,
    brand: 'Marshall',
    category: catMap['Headphones'],
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80',
    stock: 22,
    rating: 4.5,
    isFeatured: false
  },

  // 5. Cameras (10 items)
  {
    name: 'Canon EOS R50 Mirrorless Camera with 18-45mm Lens',
    description: 'Compact 24.2MP APS-C sensor with Dual Pixel CMOS AF II, 4K 30p uncropped video, and vari-angle touchscreen.',
    price: 799.99,
    discountPrice: 699.99,
    brand: 'Canon',
    category: catMap['Cameras'],
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    stock: 14,
    rating: 4.8,
    isFeatured: true
  },
  {
    name: 'Sony Alpha 7 IV Full-Frame Hybrid Camera',
    description: 'Flagship 33MP Exmor R CMOS sensor with 4K 60p 10-bit recording, Real-time Eye AF, and 5-axis optical stabilization.',
    price: 2498.00,
    discountPrice: 2298.00,
    brand: 'Sony',
    category: catMap['Cameras'],
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80',
    stock: 9, // Low stock
    rating: 4.9,
    isFeatured: true
  },
  {
    name: 'Fujifilm X-T5 Mirrorless Digital Camera Body',
    description: 'Retro dials with cutting-edge 40.2MP X-Trans CMOS 5 HR sensor, 6.2K video recording, and 3-way tilting LCD.',
    price: 1699.95,
    discountPrice: 1599.95,
    brand: 'Fujifilm',
    category: catMap['Cameras'],
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
    stock: 7, // Low stock
    rating: 4.9,
    isFeatured: false
  },
  {
    name: 'Nikon Z8 Mirrorless Full-Frame Camera',
    description: 'Baby Z9 powerhouse with 45.7MP stacked sensor, 8K 60p internal RAW video, and blackout-free Real-Live viewfinder.',
    price: 3696.95,
    discountPrice: 3496.95,
    brand: 'Nikon',
    category: catMap['Cameras'],
    image: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&auto=format&fit=crop&q=80',
    stock: 5, // Low stock
    rating: 5.0,
    isFeatured: false
  },
  {
    name: 'GoPro HERO12 Black Action Camera',
    description: 'Waterproof action camera with HyperSmooth 6.0 video stabilization, HDR 5.3K video, and dual LCD screens.',
    price: 399.99,
    discountPrice: 349.99,
    brand: 'GoPro',
    category: catMap['Cameras'],
    image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80',
    stock: 40,
    rating: 4.6,
    isFeatured: false
  },
  {
    name: 'DJI Osmo Pocket 3 Gimbal Camera',
    description: '1-inch CMOS pocket-sized gimbal camera with rotating 2-inch OLED screen, 4K 120fps, and ActiveTrack 6.0.',
    price: 519.00,
    discountPrice: 489.00,
    brand: 'DJI',
    category: catMap['Cameras'],
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80',
    stock: 18,
    rating: 4.9,
    isFeatured: false
  },
  {
    name: 'Panasonic LUMIX S5 IIX Full-Frame Video Camera',
    description: 'Phase detection autofocus with unlimited 6K recording, ProRes video, live streaming, and active cooling system.',
    price: 2197.99,
    discountPrice: 1997.99,
    brand: 'Panasonic',
    category: catMap['Cameras'],
    image: 'https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=800&auto=format&fit=crop&q=80',
    stock: 10,
    rating: 4.7,
    isFeatured: false
  },
  {
    name: 'Insta360 X4 8K 360 Action Camera',
    description: 'Shoot everything in breathtaking 8K 360 degrees and reframe later with AI invisible selfie stick technology.',
    price: 499.99,
    discountPrice: 449.99,
    brand: 'Insta360',
    category: catMap['Cameras'],
    image: 'https://images.unsplash.com/photo-1520390138845-fd2d229dd553?w=800&auto=format&fit=crop&q=80',
    stock: 25,
    rating: 4.7,
    isFeatured: false
  },
  {
    name: 'Sigma 24-70mm F2.8 DG DN Art Lens for Sony E',
    description: 'Exceptional flagship standard zoom lens with edge-to-edge sharpness, constant f/2.8 aperture, and weather sealing.',
    price: 1099.00,
    discountPrice: 999.00,
    brand: 'Sigma',
    category: catMap['Cameras'],
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800&auto=format&fit=crop&q=80',
    stock: 16,
    rating: 4.9,
    isFeatured: false
  },
  {
    name: 'Fujifilm Instax Mini 12 Instant Camera Lilac',
    description: 'Fun instant film camera with automatic exposure, close-up mode with parallax correction, and selfie mirror.',
    price: 79.95,
    discountPrice: 69.95,
    brand: 'Fujifilm',
    category: catMap['Cameras'],
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
    stock: 60,
    rating: 4.6,
    isFeatured: false
  },

  // 6. Men's Clothing (10 items)
  {
    name: "Levi's 511 Slim Fit Stretch Jeans",
    description: 'Modern slim-cut denim jeans with added stretch for all-day comfort and timeless American style.',
    price: 69.50,
    discountPrice: 49.99,
    brand: "Levi's",
    category: catMap["Men's Clothing"],
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop&q=80',
    stock: 45,
    rating: 4.7,
    isFeatured: true
  },
  {
    name: 'Patagonia Better Sweater Fleece Jacket',
    description: 'Warm, 100% recycled polyester fleece jacket dyed with a low-impact process that reduces water and energy use.',
    price: 159.00,
    discountPrice: 139.00,
    brand: 'Patagonia',
    category: catMap["Men's Clothing"],
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80',
    stock: 28,
    rating: 4.9,
    isFeatured: true
  },
  {
    name: 'Ralph Lauren Classic Fit Oxford Shirt',
    description: 'Iconic woven cotton Oxford button-down shirt featuring the signature embroidered Pony on the left chest.',
    price: 115.00,
    discountPrice: 95.00,
    brand: 'Ralph Lauren',
    category: catMap["Men's Clothing"],
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
    stock: 35,
    rating: 4.8,
    isFeatured: false
  },
  {
    name: 'Nike Sportswear Club Fleece Pullover Hoodie',
    description: 'Brushed-back fleece delivers a soft, warm feel with classic everyday athletic streetwear aesthetic.',
    price: 65.00,
    discountPrice: 52.00,
    brand: 'Nike',
    category: catMap["Men's Clothing"],
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
    stock: 55,
    rating: 4.6,
    isFeatured: false
  },
  {
    name: 'The North Face McMurdo Parka Winter Jacket',
    description: 'Heavyweight waterproof DryVent down winter parka engineered with 600-fill recycled waterfowl down insulation.',
    price: 400.00,
    discountPrice: 349.99,
    brand: 'The North Face',
    category: catMap["Men's Clothing"],
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce667823?w=800&auto=format&fit=crop&q=80',
    stock: 5, // Low stock
    rating: 4.9,
    isFeatured: false
  },
  {
    name: 'Calvin Klein Liquid Touch Polo Shirt',
    description: 'Spun from ultra-fine breathable cotton yarn with silky smooth finish and minimalist contemporary collar.',
    price: 69.50,
    discountPrice: 49.50,
    brand: 'Calvin Klein',
    category: catMap["Men's Clothing"],
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80',
    stock: 32,
    rating: 4.5,
    isFeatured: false
  },
  {
    name: 'Champion Reverse Weave Heavyweight Sweatpants',
    description: 'Durable heavyweight fleece joggers with elastic ribbed cuffs and signature athletic C logo patch.',
    price: 60.00,
    discountPrice: 45.00,
    brand: 'Champion',
    category: catMap["Men's Clothing"],
    image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&auto=format&fit=crop&q=80',
    stock: 40,
    rating: 4.6,
    isFeatured: false
  },
  {
    name: 'Tommy Hilfiger Classic Water Resistant Trench Coat',
    description: 'Sophisticated single-breasted mid-length trench with removable warmer vest and signature flag detailing.',
    price: 199.00,
    discountPrice: 159.00,
    brand: 'Tommy Hilfiger',
    category: catMap["Men's Clothing"],
    image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80',
    stock: 9, // Low stock
    rating: 4.7,
    isFeatured: false
  },
  {
    name: 'Carhartt Relaxed Fit Duck Bib Overalls',
    description: 'Rugged 12-ounce cotton duck canvas with triple-stitched main seams and reinforced knees for tough work.',
    price: 99.99,
    discountPrice: 84.99,
    brand: 'Carhartt',
    category: catMap["Men's Clothing"],
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80',
    stock: 22,
    rating: 4.8,
    isFeatured: false
  },
  {
    name: 'Lululemon ABC Classic-Fit Pant 32L',
    description: 'Utilizing ergonomic ABC technology in Warpstreme fabric for shape retention and 4-way stretch commuter mobility.',
    price: 128.00,
    discountPrice: 0,
    brand: 'Lululemon',
    category: catMap["Men's Clothing"],
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80',
    stock: 26,
    rating: 4.9,
    isFeatured: false
  },

  // 7. Women's Clothing (10 items)
  {
    name: 'Lululemon Align High-Rise Leggings 25"',
    description: 'Weightless buttery-soft Nulu fabric designed for yoga and low-impact movement with sweat-wicking comfort.',
    price: 98.00,
    discountPrice: 88.00,
    brand: 'Lululemon',
    category: catMap["Women's Clothing"],
    image: 'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=800&auto=format&fit=crop&q=80',
    stock: 50,
    rating: 4.9,
    isFeatured: true
  },
  {
    name: 'Zara Oversized Double-Breasted Wool Coat',
    description: 'Chic tailored long coat crafted with wool-blend fabric, notched lapels, and tortoiseshell button accents.',
    price: 179.00,
    discountPrice: 149.00,
    brand: 'Zara',
    category: catMap["Women's Clothing"],
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce667823?w=800&auto=format&fit=crop&q=80',
    stock: 14,
    rating: 4.7,
    isFeatured: true
  },
  {
    name: 'Aritzia The Super Puff Mid Jacket',
    description: 'Engineered to keep you warm down to -30°C with 100% responsibly sourced 700+ fill-power goose down.',
    price: 325.00,
    discountPrice: 285.00,
    brand: 'Aritzia',
    category: catMap["Women's Clothing"],
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
    stock: 8, // Low stock
    rating: 4.9,
    isFeatured: false
  },
  {
    name: "Levi's Wedgie Straight Fit Women's Jeans",
    description: 'Vintage-inspired high rise designed to hug your hips and waist with a classic straight leg silhouette.',
    price: 89.50,
    discountPrice: 69.50,
    brand: "Levi's",
    category: catMap["Women's Clothing"],
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80',
    stock: 38,
    rating: 4.6,
    isFeatured: false
  },
  {
    name: 'Free People Easy Street Chunky Knit Tunic',
    description: 'Cozy oversized rib-knit crewneck sweater with dropped shoulders and exposed seam accents.',
    price: 128.00,
    discountPrice: 99.00,
    brand: 'Free People',
    category: catMap["Women's Clothing"],
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&auto=format&fit=crop&q=80',
    stock: 22,
    rating: 4.5,
    isFeatured: false
  },
  {
    name: 'Reformation Twilight Floral Print Midi Dress',
    description: 'Romantic sustainable georgette midi dress featuring tie straps, sweetheart neckline, and side slit.',
    price: 278.00,
    discountPrice: 248.00,
    brand: 'Reformation',
    category: catMap["Women's Clothing"],
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop&q=80',
    stock: 6, // Low stock
    rating: 4.8,
    isFeatured: false
  },
  {
    name: 'Madewell Denim Transport Oversized Tote',
    description: 'Everyday durable tote bag made of cotton denim canvas with sturdy veg-tanned leather shoulder straps.',
    price: 98.00,
    discountPrice: 78.00,
    brand: 'Madewell',
    category: catMap["Women's Clothing"],
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
    stock: 30,
    rating: 4.7,
    isFeatured: false
  },
  {
    name: 'H&M Linen Blend Relaxed Summer Shirt',
    description: 'Breezy woven linen and cotton blend casual shirt with open resort collar and mother-of-pearl buttons.',
    price: 34.99,
    discountPrice: 24.99,
    brand: 'H&M',
    category: catMap["Women's Clothing"],
    image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&auto=format&fit=crop&q=80',
    stock: 45,
    rating: 4.4,
    isFeatured: false
  },
  {
    name: 'Mango Flowy Suit Blazer Khaki',
    description: 'Tailored feminine blazer with structured shoulder pads, decorative front pockets, and tortoiseshell single button.',
    price: 119.99,
    discountPrice: 89.99,
    brand: 'Mango',
    category: catMap["Women's Clothing"],
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    stock: 19,
    rating: 4.6,
    isFeatured: false
  },
  {
    name: 'Spanx Faux Leather Seamless Leggings',
    description: 'Flattering contoured Power Waistband provides tummy shaping with a sleek high-gloss leather look.',
    price: 98.00,
    discountPrice: 0,
    brand: 'Spanx',
    category: catMap["Women's Clothing"],
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
    stock: 34,
    rating: 4.8,
    isFeatured: false
  },

  // 8. Shoes (10 items)
  {
    name: 'Nike Air Max 270 Black White',
    description: 'Boasting Nike’s biggest heel Air unit for super-soft cushioning that feels as impossible as it looks.',
    price: 160.00,
    discountPrice: 139.99,
    brand: 'Nike',
    category: catMap['Shoes'],
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    stock: 40,
    rating: 4.8,
    isFeatured: true
  },
  {
    name: 'Adidas Ultraboost Light Running Shoes',
    description: 'Experience epic energy with 30% lighter BOOST foam material and Continental rubber grip outsole.',
    price: 190.00,
    discountPrice: 159.00,
    brand: 'Adidas',
    category: catMap['Shoes'],
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80',
    stock: 30,
    rating: 4.9,
    isFeatured: true
  },
  {
    name: 'New Balance 990v6 Made in USA Grey',
    description: 'The pinnacle of craftsmanship blending heritage styling with FuelCell foam midsole cushioning.',
    price: 200.00,
    discountPrice: 185.00,
    brand: 'New Balance',
    category: catMap['Shoes'],
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&auto=format&fit=crop&q=80',
    stock: 15,
    rating: 4.9,
    isFeatured: false
  },
  {
    name: 'Dr. Martens 1460 Smooth Leather 8-Eye Boots',
    description: 'Original iconic work boot crafted with tough smooth leather, grooved sides, yellow welt stitch, and air-cushioned sole.',
    price: 170.00,
    discountPrice: 149.00,
    brand: 'Dr. Martens',
    category: catMap['Shoes'],
    image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80',
    stock: 18,
    rating: 4.7,
    isFeatured: false
  },
  {
    name: 'Converse Chuck Taylor All Star High Top',
    description: 'The unmistakable basketball icon turned global cultural staple with lightweight canvas and diamond tread.',
    price: 65.00,
    discountPrice: 55.00,
    brand: 'Converse',
    category: catMap['Shoes'],
    image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&auto=format&fit=crop&q=80',
    stock: 50,
    rating: 4.6,
    isFeatured: false
  },
  {
    name: 'On Cloud 5 All Black Running Shoes',
    description: 'Zero-Gravity foam and CloudTec outsole deliver soft, cushioned landings with speed-lacing system.',
    price: 140.00,
    discountPrice: 125.00,
    brand: 'On Running',
    category: catMap['Shoes'],
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80',
    stock: 7, // Low stock
    rating: 4.8,
    isFeatured: false
  },
  {
    name: 'Vans Old Skool Classic Skate Shoes',
    description: 'Durable suede and canvas uppers with signature sidestripe and iconic waffle rubber outsoles.',
    price: 70.00,
    discountPrice: 58.00,
    brand: 'Vans',
    category: catMap['Shoes'],
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80',
    stock: 42,
    rating: 4.7,
    isFeatured: false
  },
  {
    name: 'Birkenstock Arizona Birko-Flor Sandals',
    description: 'Classic two-strap slide with anatomically shaped natural cork-latex footbed and soft fleece lining.',
    price: 110.00,
    discountPrice: 95.00,
    brand: 'Birkenstock',
    category: catMap['Shoes'],
    image: 'https://images.unsplash.com/photo-1562183241-b937e95585b6?w=800&auto=format&fit=crop&q=80',
    stock: 25,
    rating: 4.8,
    isFeatured: false
  },
  {
    name: 'Timberland 6-Inch Premium Waterproof Boots',
    description: 'Rugged wheat nubuck leather boots insulated with 400g PrimaLoft and rustproof hardware.',
    price: 198.00,
    discountPrice: 175.00,
    brand: 'Timberland',
    category: catMap['Shoes'],
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80',
    stock: 8, // Low stock
    rating: 4.9,
    isFeatured: false
  },
  {
    name: 'Salomon XT-6 Gore-Tex Trail Sneaker',
    description: 'Technical trail icon equipped with waterproof Gore-Tex membrane, Agile Chassis System, and Quicklace.',
    price: 220.00,
    discountPrice: 199.00,
    brand: 'Salomon',
    category: catMap['Shoes'],
    image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&auto=format&fit=crop&q=80',
    stock: 12,
    rating: 4.8,
    isFeatured: false
  },

  // 9. Home & Kitchen (10 items)
  {
    name: 'Instant Pot Duo 7-in-1 Pressure Cooker 6 Qt',
    description: 'Multi-functional cooker replaces 7 appliances: pressure cooker, slow cooker, rice cooker, steamer, and warmer.',
    price: 99.99,
    discountPrice: 79.99,
    brand: 'Instant Pot',
    category: catMap['Home & Kitchen'],
    image: 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=800&auto=format&fit=crop&q=80',
    stock: 35,
    rating: 4.8,
    isFeatured: true
  },
  {
    name: 'Nespresso Vertuo Pop+ Coffee Machine',
    description: 'Compact single-serve espresso and brewed coffee maker utilizing barcode reading Centrifusion technology.',
    price: 129.00,
    discountPrice: 99.00,
    brand: 'Nespresso',
    category: catMap['Home & Kitchen'],
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80',
    stock: 20,
    rating: 4.7,
    isFeatured: true
  },
  {
    name: 'KitchenAid Artisan Series 5-Quart Stand Mixer',
    description: 'Planetary mixing action with 10 speeds and durable tilt-head metal construction in iconic Empire Red.',
    price: 449.99,
    discountPrice: 379.99,
    brand: 'KitchenAid',
    category: catMap['Home & Kitchen'],
    image: 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=800&auto=format&fit=crop&q=80',
    stock: 11,
    rating: 4.9,
    isFeatured: false
  },
  {
    name: 'Dyson V12 Detect Slim Cordless Vacuum',
    description: 'Laser reveals invisible dust on hard floors, intelligent piezo sensor counts dust particles in real-time.',
    price: 649.99,
    discountPrice: 549.99,
    brand: 'Dyson',
    category: catMap['Home & Kitchen'],
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80',
    stock: 9, // Low stock
    rating: 4.8,
    isFeatured: false
  },
  {
    name: 'Cosori Pro LE 5.0-Quart Air Fryer',
    description: 'Rapid 360 thermo-IQ air circulation with 9 one-touch cooking functions and dishwasher safe non-stick basket.',
    price: 99.99,
    discountPrice: 84.99,
    brand: 'Cosori',
    category: catMap['Home & Kitchen'],
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
    stock: 40,
    rating: 4.7,
    isFeatured: false
  },
  {
    name: 'Le Creuset Enameled Cast Iron Dutch Oven 5.5 Qt',
    description: 'Handcrafted French heirloom cookware providing superior heat distribution and vibrant chip-resistant enamel.',
    price: 420.00,
    discountPrice: 380.00,
    brand: 'Le Creuset',
    category: catMap['Home & Kitchen'],
    image: 'https://images.unsplash.com/photo-1584990347449-389f41b2111d?w=800&auto=format&fit=crop&q=80',
    stock: 6, // Low stock
    rating: 5.0,
    isFeatured: false
  },
  {
    name: 'Vitamix E310 Explorian Blender Professional Grade',
    description: 'Variable speed control and pulse feature with aircraft-grade hardened stainless-steel blades.',
    price: 349.95,
    discountPrice: 299.95,
    brand: 'Vitamix',
    category: catMap['Home & Kitchen'],
    image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&auto=format&fit=crop&q=80',
    stock: 16,
    rating: 4.9,
    isFeatured: false
  },
  {
    name: 'Ninja Foodi Smart XL 6-in-1 Indoor Grill',
    description: 'Cyclonic Grilling Technology sears, sizzles, and air fry crisps with smart thermometer system.',
    price: 259.99,
    discountPrice: 219.99,
    brand: 'Ninja',
    category: catMap['Home & Kitchen'],
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
    stock: 22,
    rating: 4.7,
    isFeatured: false
  },
  {
    name: 'Breville Barista Express Espresso Machine Stainless',
    description: 'Create third-wave specialty espresso at home with integrated conical burr grinder and manual steam wand.',
    price: 699.95,
    discountPrice: 599.95,
    brand: 'Breville',
    category: catMap['Home & Kitchen'],
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    stock: 8, // Low stock
    rating: 4.9,
    isFeatured: false
  },
  {
    name: 'Fellow Stagg EKG Electric Gooseneck Kettle',
    description: 'Precision pour-over kettle with variable temperature control, LCD screen, and 60-minute heat hold.',
    price: 165.00,
    discountPrice: 145.00,
    brand: 'Fellow',
    category: catMap['Home & Kitchen'],
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80',
    stock: 25,
    rating: 4.8,
    isFeatured: false
  },

  // 10. Books (10 items)
  {
    name: 'Atomic Habits by James Clear',
    description: 'An easy and proven way to build good habits and break bad ones with tiny changes that deliver remarkable results.',
    price: 27.00,
    discountPrice: 16.20,
    brand: 'Avery Publishing',
    category: catMap['Books'],
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    stock: 60,
    rating: 4.9,
    isFeatured: true
  },
  {
    name: 'The Psychology of Money by Morgan Housel',
    description: 'Timeless lessons on wealth, greed, and happiness demonstrating how behavioral psychology drives financial success.',
    price: 19.99,
    discountPrice: 14.99,
    brand: 'Harriman House',
    category: catMap['Books'],
    image: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=800&auto=format&fit=crop&q=80',
    stock: 45,
    rating: 4.9,
    isFeatured: true
  },
  {
    name: 'Deep Work by Cal Newport',
    description: 'Rules for focused success in a distracted world, teaching how to cultivate intense concentration for elite results.',
    price: 28.00,
    discountPrice: 19.99,
    brand: 'Grand Central',
    category: catMap['Books'],
    image: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=800&auto=format&fit=crop&q=80',
    stock: 32,
    rating: 4.8,
    isFeatured: false
  },
  {
    name: 'Thinking, Fast and Slow by Daniel Kahneman',
    description: 'Nobel laureate Daniel Kahneman takes us on a groundbreaking tour of the mind and explains the two systems of human thought.',
    price: 22.00,
    discountPrice: 17.50,
    brand: 'Farrar Straus',
    category: catMap['Books'],
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80',
    stock: 25,
    rating: 4.7,
    isFeatured: false
  },
  {
    name: 'Designing Data-Intensive Applications by Martin Kleppmann',
    description: 'The definitive architectural guide to building reliable, scalable, and maintainable modern distributed software systems.',
    price: 49.99,
    discountPrice: 39.99,
    brand: "O'Reilly Media",
    category: catMap['Books'],
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
    stock: 18,
    rating: 5.0,
    isFeatured: false
  },
  {
    name: 'Clean Code by Robert C. Martin',
    description: 'A handbook of agile software craftsmanship presenting principles, patterns, and practices for writing elegant code.',
    price: 45.00,
    discountPrice: 34.99,
    brand: 'Prentice Hall',
    category: catMap['Books'],
    image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&auto=format&fit=crop&q=80',
    stock: 7, // Low stock
    rating: 4.7,
    isFeatured: false
  },
  {
    name: 'The Pragmatic Programmer 20th Anniversary Edition',
    description: 'David Thomas and Andrew Hunt explore modern best practices to keep your coding career adaptable and thriving.',
    price: 49.99,
    discountPrice: 42.00,
    brand: 'Addison-Wesley',
    category: catMap['Books'],
    image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&auto=format&fit=crop&q=80',
    stock: 15,
    rating: 4.9,
    isFeatured: false
  },
  {
    name: 'Sapiens: A Brief History of Humankind by Yuval Noah Harari',
    description: 'From renowned historian Yuval Noah Harari, exploring how Homo sapiens conquered the globe and shaped civilization.',
    price: 24.99,
    discountPrice: 18.99,
    brand: 'Harper',
    category: catMap['Books'],
    image: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=800&auto=format&fit=crop&q=80',
    stock: 40,
    rating: 4.8,
    isFeatured: false
  },
  {
    name: 'Zero to One: Notes on Startups by Peter Thiel',
    description: 'Legendary entrepreneur Peter Thiel reveals how to build businesses that create new things and escape competition.',
    price: 27.00,
    discountPrice: 19.50,
    brand: 'Crown Business',
    category: catMap['Books'],
    image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&auto=format&fit=crop&q=80',
    stock: 28,
    rating: 4.6,
    isFeatured: false
  },
  {
    name: 'Steve Jobs Biography by Walter Isaacson',
    description: 'Based on more than forty interviews with Jobs conducted over two years, an unvarnished view of the visionary creator.',
    price: 35.00,
    discountPrice: 24.99,
    brand: 'Simon & Schuster',
    category: catMap['Books'],
    image: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=800&auto=format&fit=crop&q=80',
    stock: 5, // Low stock
    rating: 4.8,
    isFeatured: false
  }
];

// 50 Reviews comments & ratings templates
const sampleReviewComments = [
  { rating: 5, comment: 'Absolutely outstanding quality! Exceeded all my expectations.' },
  { rating: 5, comment: 'Best purchase I have made this year. High quality and sturdy.' },
  { rating: 4, comment: 'Very good product, works as advertised. Delivered promptly.' },
  { rating: 5, comment: 'Incredible value for money. Highly recommend to friends!' },
  { rating: 4, comment: 'Solid performance and premium build. Very satisfied overall.' },
  { rating: 5, comment: 'Flawless design and fast delivery. Very pleased with Cash on Delivery.' },
  { rating: 4, comment: 'Pretty great quality. A slight learning curve at first but fantastic.' },
  { rating: 5, comment: 'Top-tier product. I use this every single day now.' },
  { rating: 3, comment: 'Decent product for the price. Packaging could be slightly improved.' },
  { rating: 5, comment: 'Five stars across the board! Genuine brand and excellent feel.' }
];

async function seedDatabase() {
  try {
    await connectDB();

    // Clear existing data cleanly (idempotent)
    await Category.deleteMany({});
    await User.deleteMany({});
    await Product.deleteMany({});
    await Review.deleteMany({});
    await Order.deleteMany({});
    await Cart.deleteMany({});

    // 1. Insert Categories
    const createdCategories = await Category.insertMany(categoriesData);
    const catMap = {};
    createdCategories.forEach((cat) => {
      catMap[cat.name] = cat._id;
    });

    // 2. Insert Users (Admin + 10 Customers)
    // Note: User model has pre('save') for bcrypt hashing, but insertMany does not trigger pre('save').
    // We will hash passwords explicitly so all users can log in cleanly.
    const salt = await bcrypt.genSalt(10);
    const hashedUsers = await Promise.all(
      rawUsersData.map(async (u) => ({
        ...u,
        password: await bcrypt.hash(u.password, salt)
      }))
    );
    const createdUsers = await User.insertMany(hashedUsers);
    const adminUser = createdUsers.find((u) => u.role === 'ADMIN');
    const customerUsers = createdUsers.filter((u) => u.role === 'CUSTOMER');

    // 3. Insert 100 Products
    const productsToInsert = getProductsData(catMap);
    const createdProducts = await Product.insertMany(productsToInsert);

    // 4. Insert 50 Reviews
    const reviewsToInsert = [];
    for (let i = 0; i < 50; i++) {
      const user = customerUsers[i % customerUsers.length];
      const product = createdProducts[i % createdProducts.length];
      const template = sampleReviewComments[i % sampleReviewComments.length];

      reviewsToInsert.push({
        user: user._id,
        product: product._id,
        rating: template.rating,
        comment: template.comment,
        createdAt: new Date(Date.now() - (50 - i) * 3600 * 1000 * 12)
      });
    }
    const createdReviews = await Review.insertMany(reviewsToInsert);

    // Update product ratings & review counts based on seeded reviews
    for (const prod of createdProducts) {
      const prodReviews = reviewsToInsert.filter(
        (r) => r.product.toString() === prod._id.toString()
      );
      if (prodReviews.length > 0) {
        const avgRating =
          prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
        await Product.findByIdAndUpdate(prod._id, {
          rating: Number(avgRating.toFixed(1)),
          numReviews: prodReviews.length
        });
      }
    }

    // 5. Insert 20 Sample Orders (All COD)
    const orderStatuses = ['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    const ordersToInsert = [];

    for (let i = 0; i < 20; i++) {
      const customer = customerUsers[i % customerUsers.length];
      const prod1 = createdProducts[(i * 3) % createdProducts.length];
      const prod2 = createdProducts[(i * 3 + 1) % createdProducts.length];

      const price1 = prod1.discountPrice > 0 ? prod1.discountPrice : prod1.price;
      const price2 = prod2.discountPrice > 0 ? prod2.discountPrice : prod2.price;
      const qty1 = (i % 2) + 1;
      const qty2 = (i % 3) + 1;
      const totalAmount = Number((price1 * qty1 + price2 * qty2).toFixed(2));

      // Vary status across the 20 orders
      let status = orderStatuses[i % 4]; // PLACED, CONFIRMED, SHIPPED, DELIVERED
      if (i === 18 || i === 19) status = 'CANCELLED';

      const orderDate = new Date(Date.now() - (20 - i) * 24 * 3600 * 1000);

      ordersToInsert.push({
        user: customer._id,
        products: [
          {
            product: prod1._id,
            name: prod1.name,
            image: prod1.image,
            quantity: qty1,
            price: price1
          },
          {
            product: prod2._id,
            name: prod2.name,
            image: prod2.image,
            quantity: qty2,
            price: price2
          }
        ],
        shippingAddress: {
          name: customer.name,
          phone: customer.phone,
          address: customer.address.street,
          city: customer.address.city,
          state: customer.address.state,
          pincode: customer.address.pincode
        },
        totalAmount,
        paymentMethod: 'COD',
        orderStatus: status,
        createdAt: orderDate
      });
    }

    const createdOrders = await Order.insertMany(ordersToInsert);

    // Exact requested output format from Section 42
    console.log(`Categories: ${createdCategories.length}`);
    console.log(`Users: ${createdUsers.length}`);
    console.log(`Products: ${createdProducts.length}`);
    console.log(`Reviews: ${createdReviews.length}`);
    console.log(`Orders: ${createdOrders.length}`);
    console.log('\nSeed completed successfully.');

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

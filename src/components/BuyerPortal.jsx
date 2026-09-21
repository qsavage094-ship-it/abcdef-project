import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  MessageSquare, 
  ShoppingCart, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  UserCheck,
  TrendingDown,
  TrendingUp,
  Volume2,
  Leaf,
  Star,
  Award
} from 'lucide-react';
import { resolveCropImage } from '../services/cropImageResolver';

const CATEGORIES = [
  { id: 'All', label: 'All Produce', icon: '🌱' },
  { id: 'Grains & Cereals', label: 'Grains & Cereals', icon: '🌾' },
  { id: 'Pulses & Legumes', label: 'Pulses & Legumes', icon: '🫘' },
  { id: 'Spices & Aromatics', label: 'Spices & Aromatics', icon: '🌿' },
  { id: 'Cash Crops', label: 'Cash Crops', icon: '🧵' },
  { id: 'Oilseeds', label: 'Oilseeds', icon: '🌻' },
  { id: 'Plantation', label: 'Plantation', icon: '☕' },
  { id: 'Fruits & Orchards', label: 'Fruits & Orchards', icon: '🍎' },
  { id: 'Vegetables', label: 'Vegetables', icon: '🥦' }
];

const TAMIL_CATEGORIES = {
  'All': 'அனைத்துப் பயிர்கள்',
  'Grains & Cereals': 'தானியங்கள் & அரிசி',
  'Pulses & Legumes': 'பருப்பு வகைகள்',
  'Spices & Aromatics': 'மசாலா பொருட்கள்',
  'Cash Crops': 'பணப்பயிர்கள் (பருத்தி)',
  'Oilseeds': 'எண்ணெய் வித்துக்கள்',
  'Plantation': 'தோட்டப்பயிர்கள் (டீ/காபி)',
  'Fruits & Orchards': 'பழங்கள்',
  'Vegetables': 'காய்கறிகள்'
};

const TAMIL_CROP_NAMES = {
  "Basmati Paddy": "பாசுமதி நெல் (Basmati Paddy)",
  "Basmati Rice": "பாசுமதி அரிசி (Basmati)",
  "Sharbati Wheat": "சர்பதி கோதுமை (Wheat)",
  "Salem Turmeric": "சேலம் மஞ்சள் (Salem Turmeric)",
  "Alleppey Cardamom": "ஆலப்புழா ஏலக்காய் (Cardamom)",
  "Green Cardamom": "பச்சை ஏலக்காய் (Cardamom)",
  "Alphonso Mango": "அல்போன்சா மாம்பழம் (Mango)",
  "Saurashtra Groundnut": "சௌராஷ்டிரா நிலக்கடலை (Groundnut)",
  "Groundnut": "நிலக்கடலை (Groundnut)",
  "Darjeeling Tea": "டார்ஜிலிங் தேயிலை (Tea)",
  "Desi Chickpea": "நாட்டு கொண்டைக்கடலை (Chickpea)",
  "Shankar-6 Cotton": "சங்கர்-6 பருத்தி (Cotton)",
  "Nashik Onion": "நாசிக் வெங்காயம் (Onion)",
  "Onion": "வெங்காயம் (Onion)",
  "Tomato": "நாட்டுத் தக்காளி (Tomato)",
  "Potato": "உருளைக்கிழங்கு (Potato)",
  "Yellow Soybean": "சோயாபீன் (Soybean)",
  "Mustard": "கடுகு (Mustard)",
  "Arabica Coffee": "அரபிகா காபி (Coffee)",
  "Natural Rubber": "இயற்கை ரப்பர் (Rubber)",
  "Shimla Apple": "சிம்லா ஆப்பிள் (Apple)",
  "Robusta Banana": "வாழைப்பழம் (Banana)",
  "Fresh Ginger": "பச்சை இஞ்சி (Ginger)",
  "Malabar Black Pepper": "மலபார் மிளகு (Black Pepper)",
  "Guntur Red Chilli": "குண்டூர் காய்ந்த மிளகாய் (Chilli)",
  "Ooty Garlic": "ஊட்டி பூண்டு (Garlic)",
  "Sugarcane": "கரும்பு (Sugarcane)",
  "Coriander Seeds": "மல்லி விதை (Coriander)",
  "Cumin Seeds": "சீரகம் (Cumin)",
  "Tur Dal": "துவரம் பருப்பு (Toor Dal)",
  "Moong Dal": "பாசிப் பருப்பு (Moong Dal)",
  "Urad Dal": "உளுத்தம் பருப்பு (Urad Dal)"
};

export default function BuyerPortal({
  user,
  crops,
  orders,
  onPlaceOrder,
  onOpenChat,
  onOpenSupplyChain,
  t,
  isGuest = false,
  onRequireAuth,
  currentLang = 'en'
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCropFilter, setSelectedCropFilter] = useState('All');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState('All');
  const [selectedLocationFilter, setSelectedLocationFilter] = useState('All');
  const [maxPriceKgFilter, setMaxPriceKgFilter] = useState(1500); // Expanded up to ₹1,500/kg for spices & tea
  const [organicOnly, setOrganicOnly] = useState(false);
  const [activeTab, setActiveTab] = useState('marketplace'); // 'marketplace' or 'my_orders'

  // Order modal state in kg
  const [selectedCropForOrder, setSelectedCropForOrder] = useState(null);
  const [orderQuantityKg, setOrderQuantityKg] = useState(2500); // 2,500 kg
  const [destinationHub, setDestinationHub] = useState('Vashi APMC, Mumbai');

  // Derive unique crop names dynamically from active crops
  const uniqueCropNames = ['All', ...new Set(crops.map(c => c.cropName))];

  // Helper for localized crop name
  const getCropDisplayName = (name) => {
    if (currentLang === 'ta') {
      return TAMIL_CROP_NAMES[name] || name;
    }
    return name;
  };

  // Helper for localized category name
  const getCategoryDisplayName = (catId, fallbackLabel) => {
    if (currentLang === 'ta') {
      return TAMIL_CATEGORIES[catId] || fallbackLabel;
    }
    return fallbackLabel;
  };

  // Filter crops
  const filteredCrops = crops.filter(crop => {
    const matchesSearch = 
      crop.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (TAMIL_CROP_NAMES[crop.cropName] && TAMIL_CROP_NAMES[crop.cropName].toLowerCase().includes(searchQuery.toLowerCase())) ||
      crop.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || crop.category === selectedCategory;
    const matchesCrop = selectedCropFilter === 'All' || crop.cropName === selectedCropFilter;
    const matchesGrade = selectedGradeFilter === 'All' || crop.grade === selectedGradeFilter;
    const matchesLocation = selectedLocationFilter === 'All' || crop.location === selectedLocationFilter;
    
    const priceKg = crop.expectedPriceKg || (crop.expectedPrice ? crop.expectedPrice / 100 : 0);
    const matchesPrice = priceKg <= maxPriceKgFilter;
    
    const matchesOrganic = !organicOnly || crop.isOrganic === true;

    return matchesSearch && matchesCategory && matchesCrop && matchesGrade && matchesLocation && matchesPrice && matchesOrganic;
  });

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    if (!selectedCropForOrder) return;

    const unitPriceKg = selectedCropForOrder.expectedPriceKg || (selectedCropForOrder.expectedPrice / 100);
    const totalAmount = Math.round(unitPriceKg * Number(orderQuantityKg));
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      cropId: selectedCropForOrder.id,
      cropName: `${selectedCropForOrder.cropName} (${selectedCropForOrder.variety})`,
      quantityKg: Number(orderQuantityKg),
      unitPriceKg: unitPriceKg,
      totalAmount: totalAmount,
      farmerId: selectedCropForOrder.farmerId,
      farmerName: selectedCropForOrder.farmerName,
      buyerId: user?.id || "buyer_1",
      buyerName: user?.name || "FreshAgro Retail Chains",
      buyerContact: user?.email || "procurement@freshagro.in",
      pickupLocation: selectedCropForOrder.location,
      destination: destinationHub,
      orderDate: new Date().toISOString().split('T')[0],
      status: "In Transit",
      isPerishable: selectedCropForOrder.cropName.toLowerCase().includes("tomato") || selectedCropForOrder.cropName.toLowerCase().includes("chilli") || selectedCropForOrder.category === "Fruits & Orchards",
      vehicleAssigned: selectedCropForOrder.category === "Fruits & Orchards" || selectedCropForOrder.cropName.toLowerCase().includes("tomato") ? "Cold-Chain Reefer (4,500 kg)" : "Medium Agri-Carrier (8,000 kg)",
      distanceKm: 165,
      estimatedFreight: 4800,
      eta: "Tomorrow, 11:00 AM",
      trackingMilestone: "Order Accepted & Logistics Scheduled",
      modelName: "LogixRoute-v1.8"
    };

    onPlaceOrder(newOrder);
    setSelectedCropForOrder(null);
    setActiveTab('my_orders');
  };

  // Read crop details aloud using Tara / Vanishree Voice Guide
  const readCropAloud = (crop) => {
    const priceKg = crop.expectedPriceKg || (crop.expectedPrice ? (crop.expectedPrice / 100).toFixed(1) : 25);
    const aiPriceKg = crop.aiPredictedPriceKg || (crop.aiPredictedPrice ? (crop.aiPredictedPrice / 100).toFixed(1) : 25);
    
    let speech = "";
    if (currentLang === 'ta') {
      // Vanishree modern friendly casual Tamil tone
      speech = `வணக்கம்ங்க! நான் உங்கள் வானிஸ்ரீ. இது ${TAMIL_CROP_NAMES[crop.cropName] || crop.cropName} (${crop.variety}), ${crop.location} பண்ணையிலிருந்து வந்திருக்குங்க. தரம் ${crop.grade}, ${crop.isOrganic ? '100% இயற்கை விவசாயம்' : 'நேரடி உழவர் சந்தை பயிர்'}. விவசாயி கேட்குற விலை ஒரு கிலோவுக்கு ₹${priceKg}, AI கணக்கிட்ட நியாயமான விலை ₹${aiPriceKg}. நேரடியா வாங்க உடனே ஆர்டர் போடுங்க!`;
    } else if (currentLang === 'hi' || currentLang === 'hinglish') {
      speech = `${crop.cropName} (${crop.variety}), ${crop.location} की ताज़ा उपज। ग्रेड ${crop.grade}, ${crop.isOrganic ? '100% शुद्ध जैविक' : 'खेत की फसल'}। किसान का भाव ₹${priceKg} प्रति किलो है, और एआई का सही अनुमानित भाव ₹${aiPriceKg} प्रति किलो है।`;
    } else if (currentLang === 'mr') {
      speech = `${crop.cropName} (${crop.variety}), ${crop.location} येथून. प्रत ${crop.grade}, ${crop.isOrganic ? 'सेंद्रिय प्रमाणीकृत' : 'नैसर्गिक पिके'}। शेतकरी दर ₹${priceKg} प्रति किलो, आणि AI रास्त भाव ₹${aiPriceKg} प्रति किलो.`;
    } else if (currentLang === 'te') {
      speech = `${crop.cropName} (${crop.variety}), ${crop.location} నుండి. నాణ్యత ${crop.grade}, ${crop.isOrganic ? 'ఆర్గానిక్ పంట' : 'పొలం పంట'}। రైతు ధర కిలో ₹${priceKg}, AI అంచనా ధర ₹${aiPriceKg}.`;
    } else if (currentLang === 'pa') {
      speech = `${crop.cropName} (${crop.variety}), ${crop.location} ਤੋਂ। ਗ੍ਰੇਡ ${crop.grade}, ${crop.isOrganic ? 'ਜੈਵਿਕ ਫ਼ਸਲ' : 'ਖੇਤ ਦੀ ਤਾਜ਼ੀ ਫ਼ਸਲ'}। ਕਿਸਾਨ ਦਾ ਭਾਅ ₹${priceKg} ਪ੍ਰਤੀ ਕਿਲੋ, AI ਅੰਦਾਜ਼ਾ ₹${aiPriceKg} ਪ੍ਰਤੀ ਕਿਲੋ।`;
    } else {
      speech = `${crop.cropName}, ${crop.variety} from ${crop.location}. Quality ${crop.grade}, ${crop.isOrganic ? 'organically certified with zero chemicals' : 'natural farm gate harvest'}. Asking price is ₹${priceKg} per kilogram, with an AI fair benchmark of ₹${aiPriceKg} per kilogram. Direct pickup available.`;
    }

    window.dispatchEvent(new CustomEvent('agri-voice-speak', { detail: { text: speech } }));
  };

  const buyerOrders = orders.filter(o => o.buyerId === (user?.id || "buyer_1"));

  return (
    <div style={{ padding: '20px 0 40px 0' }}>
      <div className="container">

        {/* Compact Header & Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '14px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2>{t.buyer_hub_title || "Procurement & Sourcing Hub"}</h2>
              <span className="tag tag-green">
                <ShieldCheck size={12} /> {t.buyer_verified_tag || "Verified Direct Mandi"}
              </span>
            </div>
            <p className="text-subtle" style={{ marginTop: '2px', fontSize: '0.85rem' }}>
              {t.logged_in_as || "Logged in as"} <strong>{user?.name || 'Vikram Malhotra'}</strong> • {t.facility || "Facility"}: {user?.location || 'Vashi APMC, Mumbai'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--bg-subtle)',
            padding: '3px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-light)'
          }}>
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`btn btn-sm ${activeTab === 'marketplace' ? 'btn-primary' : 'btn-outline'}`}
              style={{ border: 'none', borderRadius: 'var(--radius-sm)' }}
              id="tab-buyer-browse"
            >
              {t.browse_farm_gate || "Browse Farm Gate"} ({filteredCrops.length})
            </button>
            <button
              onClick={() => setActiveTab('my_orders')}
              className={`btn btn-sm ${activeTab === 'my_orders' ? 'btn-primary' : 'btn-outline'}`}
              style={{ border: 'none', borderRadius: 'var(--radius-sm)' }}
              id="tab-buyer-orders"
            >
              {t.my_orders_tab || "My Orders"} ({buyerOrders.length})
            </button>
          </div>
        </div>

        {activeTab === 'marketplace' ? (
          <div>
            
            {/* Biophilic Category Chips Bar */}
            <div style={{ marginBottom: '14px' }}>
              <div className="category-chips-container">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                  >
                    <span>{cat.icon}</span>
                    <span>{getCategoryDisplayName(cat.id, cat.label)}</span>
                  </button>
                ))}
                
                {/* Organic Only Quick Filter Chip */}
                <button
                  onClick={() => setOrganicOnly(prev => !prev)}
                  className={`category-chip ${organicOnly ? 'active' : ''}`}
                  style={{ marginLeft: 'auto', borderStyle: 'dashed' }}
                  title={currentLang === 'ta' ? "100% இயற்கை விவசாய விளைபொருட்கள் மட்டும்" : "Filter 100% certified organic produce"}
                >
                  <Leaf size={14} color={organicOnly ? '#ffffff' : 'var(--agri-green)'} />
                  <span>{currentLang === 'ta' ? 'இயற்கை விவசாயம் மட்டும்' : 'Certified Organic Only'}</span>
                </button>
              </div>
            </div>

            {/* Compact Search and Multi-Filter Bar */}
            <div className="swiss-card" style={{ marginBottom: '20px', padding: '16px 20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', alignItems: 'end' }}>
                
                {/* Search */}
                <div>
                  <label className="form-label">{t.search_produce_label || (currentLang === 'ta' ? "பயிர் தேடல்" : "Search Produce")}</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t.search_placeholder || (currentLang === 'ta' ? "பயிர், வகை, மாவட்டம்..." : "Search crop, variety, state...")}
                      className="form-input"
                      style={{ paddingLeft: '32px' }}
                    />
                    <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
                  </div>
                </div>

                {/* Crop Name */}
                <div>
                  <label className="form-label">{t.crop_type_label || (currentLang === 'ta' ? "குறிப்பிட்ட பயிர்" : "Specific Crop")}</label>
                  <select 
                    value={selectedCropFilter}
                    onChange={(e) => setSelectedCropFilter(e.target.value)}
                    className="form-select"
                  >
                    {uniqueCropNames.map(name => (
                      <option key={name} value={name}>
                        {name === 'All' ? (currentLang === 'ta' ? 'அனைத்துப் பயிர்கள்' : 'All Specific Crops') : getCropDisplayName(name)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Grade */}
                <div>
                  <label className="form-label">{t.quality_grade_label || (currentLang === 'ta' ? "தர கிரேடு" : "Quality Grade")}</label>
                  <select 
                    value={selectedGradeFilter}
                    onChange={(e) => setSelectedGradeFilter(e.target.value)}
                    className="form-select"
                  >
                    <option value="All">{currentLang === 'ta' ? 'அனைத்து கிரேடுகள்' : 'All Grades'}</option>
                    <option value="Grade A">{currentLang === 'ta' ? 'கிரேடு A (ஏற்றுமதி / உயர்தரம்)' : 'Grade A (Export / Top Quality)'}</option>
                    <option value="Grade B">{currentLang === 'ta' ? 'கிரேடு B (சந்தை தரம்)' : 'Grade B (Standard Market)'}</option>
                    <option value="Grade C">{currentLang === 'ta' ? 'கிரேடு C (செயலாக்க தரம்)' : 'Grade C (Processing / Bulk)'}</option>
                  </select>
                </div>

                {/* Price Range Slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <label className="form-label" style={{ margin: 0 }}>{t.max_rate_label || (currentLang === 'ta' ? "அதிகபட்ச விலை" : "Max Rate")}</label>
                    <span className="text-mono" style={{ fontWeight: 700, color: 'var(--agri-green)' }}>
                      ₹{maxPriceKgFilter} {currentLang === 'ta' ? '/ கிலோ' : '/ kg'}
                    </span>
                  </div>
                  <input 
                    type="range"
                    min="10"
                    max="1500"
                    step="10"
                    value={maxPriceKgFilter}
                    onChange={(e) => setMaxPriceKgFilter(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--agri-green)', cursor: 'pointer' }}
                  />
                </div>

              </div>
            </div>

            {/* Results Count & Quick Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', fontSize: '0.9rem' }}>
              <span className="text-subtle">
                {currentLang === 'ta' ? (
                  <span>மொத்தம் <strong style={{ color: 'var(--text-primary)' }}>{filteredCrops.length}</strong> சரிபார்க்கப்பட்ட நேரடி உழவர் சந்தை பயிர்கள்</span>
                ) : (
                  <span>Showing <strong style={{ color: 'var(--text-primary)' }}>{filteredCrops.length}</strong> farm-gate verified listings</span>
                )}
              </span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span className="tag tag-green" style={{ fontSize: '0.725rem' }}>
                  <ShieldCheck size={12} /> {currentLang === 'ta' ? 'APMC சரிபார்க்கப்பட்டது' : 'APMC Verified'}
                </span>
              </div>
            </div>

            {/* Responsive Biophilic Marketplace Grid */}
            <div className="grid-3">
              {filteredCrops.map(crop => {
                const qtyKg = crop.quantityKg || crop.quantity * 100 || 1000;
                const priceKg = crop.expectedPriceKg || (crop.expectedPrice ? (crop.expectedPrice / 100).toFixed(1) : 25);
                const aiPriceKg = crop.aiPredictedPriceKg || (crop.aiPredictedPrice ? (crop.aiPredictedPrice / 100).toFixed(1) : 25);
                const isUnderAi = Number(priceKg) <= Number(aiPriceKg);
                const cropImg = resolveCropImage(crop.cropName) || crop.image;

                return (
                  <div key={crop.id} className="swiss-card" style={{ display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
                    
                    {/* Image Header with Category & Organic Badges */}
                    <div style={{ position: 'relative', height: '165px', backgroundColor: 'var(--bg-subtle)' }}>
                      <img 
                        src={cropImg} 
                        alt={crop.cropName} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 40%, rgba(0,0,0,0.65) 100%)'
                      }} />

                      {/* Top Badges */}
                      <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <span className="tag tag-green" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', color: 'var(--agri-green)' }}>
                          {crop.grade}
                        </span>
                        {crop.isOrganic && (
                          <span className="tag tag-green" style={{ backgroundColor: '#10b981', color: '#ffffff', border: 'none' }}>
                            <Leaf size={10} /> {currentLang === 'ta' ? 'இயற்கை' : 'Organic'}
                          </span>
                        )}
                      </div>

                      {/* Category Tag Top Right */}
                      <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                        <span className="tag" style={{ backgroundColor: 'rgba(0,0,0,0.65)', color: '#ffffff', border: 'none' }}>
                          {getCategoryDisplayName(crop.category, crop.category || "Produce")}
                        </span>
                      </div>

                      {/* Bottom Info on Image */}
                      <div style={{ position: 'absolute', bottom: '8px', left: '10px', right: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: '#ffffff', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                          <Calendar size={11} style={{ verticalAlign: 'middle', marginRight: '3px' }} /> {currentLang === 'ta' ? 'அறுவடை:' : 'Harvest:'} {crop.harvestDate}
                        </span>
                        
                        {/* Voice Listen Button */}
                        <button
                          onClick={() => readCropAloud(crop)}
                          style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '30px',
                            height: '30px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'var(--agri-green)',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                          }}
                          title={currentLang === 'ta' ? "வானிஸ்ரீயின் தமிழ் குரலில் கேட்க" : "Listen with Tara (Mild Voice)"}
                        >
                          <Volume2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Card Content Area */}
                    <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      
                      <div style={{ marginBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <h4 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-primary)' }}>
                            {getCropDisplayName(crop.cropName)}
                          </h4>
                          <span className="text-mono" style={{ fontSize: '0.675rem', color: 'var(--text-muted)' }}>
                            {currentLang === 'ta' ? 'APMC சரிபார்ப்பு' : 'APMC Verified'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {crop.variety} • <strong style={{ color: 'var(--text-primary)' }}>{qtyKg.toLocaleString()} {currentLang === 'ta' ? 'கிலோ இருப்பு' : 'kg Available'}</strong>
                        </div>
                      </div>

                      {/* Farmer and Mandi Location Strip */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 10px',
                        backgroundColor: 'var(--bg-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: '12px',
                        fontSize: '0.775rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <UserCheck size={13} color="var(--agri-green)" />
                          <span style={{ fontWeight: 600 }}>{crop.farmerName}</span>
                          <span style={{ color: 'var(--harvest-amber)', display: 'flex', alignItems: 'center', fontSize: '0.7rem' }}>
                            <Star size={10} fill="currentColor" /> {crop.farmerRating || 4.8}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--text-secondary)' }}>
                          <MapPin size={11} />
                          <span>{crop.location}</span>
                        </div>
                      </div>

                      {/* Pricing Comparison in ₹/kg */}
                      <div style={{
                        borderTop: '1px solid var(--border-light)',
                        borderBottom: '1px solid var(--border-light)',
                        padding: '10px 0',
                        marginBottom: '12px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <div>
                            <span style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', display: 'block' }}>
                              {currentLang === 'ta' ? 'விவசாயி கோரும் விலை' : 'Farmer Asking Rate'}
                            </span>
                            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                              ₹{priceKg} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{currentLang === 'ta' ? '/ கிலோ' : '/ kg'}</span>
                            </span>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', justifyContent: 'flex-end' }}>
                              <ShieldCheck size={12} color="var(--agri-green)" />
                              <span style={{ fontSize: '0.725rem', color: 'var(--agri-green)', fontWeight: 600 }}>
                                {currentLang === 'ta' ? 'மண்டி வழிகாட்டி விலை' : 'Mandi Benchmark Rate'}
                              </span>
                            </div>
                            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--agri-green)' }}>
                              ₹{aiPriceKg} {currentLang === 'ta' ? '/ கிலோ' : '/ kg'}
                            </span>
                          </div>
                        </div>

                        <div style={{ marginTop: '5px' }}>
                          {isUnderAi ? (
                            <span className="tag tag-green" style={{ fontSize: '0.675rem' }}>
                              <TrendingDown size={11} /> {currentLang === 'ta' ? 'சிறந்த விலை (மண்டி விலையை விட குறைவு)' : 'Below Mandi Rate'}
                            </span>
                          ) : (
                            <span className="tag tag-amber" style={{ fontSize: '0.675rem' }}>
                              <TrendingUp size={11} /> {currentLang === 'ta' ? 'பிரீமியம் தரம் (மண்டி விலையை விட அதிகம்)' : 'Above Mandi Rate'}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ marginTop: 'auto', display: 'flex', gap: '6px' }}>
                        <button 
                          className="btn btn-accent"
                          style={{ flex: 1, fontWeight: 700 }}
                          onClick={() => {
                            if (isGuest && onRequireAuth) {
                              onRequireAuth();
                              return;
                            }
                            setSelectedCropForOrder(crop);
                            setOrderQuantityKg(Math.min(qtyKg, 2500));
                          }}
                        >
                          <ShoppingCart size={14} />
                          <span>{currentLang === 'ta' ? 'நேரடி ஆர்டர்' : 'Direct Order'}</span>
                        </button>

                        <button 
                          className="btn btn-outline"
                          onClick={() => {
                            if (isGuest && onRequireAuth) {
                              onRequireAuth();
                              return;
                            }
                            onOpenChat({
                              id: crop.farmerId,
                              companyName: `${crop.farmerName} (Farmer)`
                            });
                          }}
                          title={currentLang === 'ta' ? "விவசாயியுடன் நேரடி அரட்டை" : "Open End-to-End Encrypted Chat with Farmer"}
                        >
                          <MessageSquare size={14} color="var(--crypto-blue)" />
                        </button>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        ) : (
          /* Buyer Orders Tab */
          <div>
            <div style={{ marginBottom: '16px' }}>
              <h3>{t.procurement_contracts_title || "Procurement Contracts & Deliveries"}</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {buyerOrders.map(order => (
                <div key={order.id} className="swiss-card" style={{ padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span className="text-mono" style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                          {order.id}
                        </span>
                        <span className={`tag ${order.status === 'In Transit' ? 'tag-amber' : 'tag-green'}`}>
                          {order.status === 'In Transit' ? (t.status_in_transit || order.status) : (t.status_delivered || order.status)}
                        </span>
                        <span className="tag tag-neutral" style={{ fontSize: '0.7rem' }}>
                          {order.orderDate}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '1.2rem', margin: '4px 0' }}>
                        {order.cropName}
                      </h4>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {t.grower_label || "Grower:"} <strong>{order.farmerName}</strong> • {t.origin_label || "Origin:"} {order.pickupLocation} → {order.destination}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>
                        {t.total_contract_amount || "Total Contract Amount"}
                      </span>
                      <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--agri-green)' }}>
                        ₹{order.totalAmount.toLocaleString()}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                        ({(order.quantityKg || order.quantity * 100).toLocaleString()} kg @ ₹{order.unitPriceKg || (order.unitPrice / 100).toFixed(1)}/kg)
                      </span>
                    </div>

                  </div>

                  {/* Tracking Bar */}
                  <div style={{
                    marginTop: '14px',
                    padding: '10px 14px',
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Truck size={16} color="var(--agri-green)" />
                      <span style={{ fontSize: '0.825rem' }}>
                        {t.milestone_label || "Milestone:"} <strong>{order.trackingMilestone}</strong>
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => onOpenSupplyChain(order)}
                      >
                        <Truck size={13} />
                        <span>{t.supply_chain_view_btn || "Supply Chain View"}</span>
                      </button>

                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => onOpenChat({
                          id: order.farmerId,
                          companyName: `${order.farmerName} (Farmer)`
                        })}
                      >
                        <MessageSquare size={13} color="var(--crypto-blue)" />
                        <span>{t.chat_farmer_btn || "Chat Farmer"}</span>
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* Order Placement Modal */}
        {selectedCropForOrder && (
          <div className="modal-backdrop" onClick={() => setSelectedCropForOrder(null)}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Place Purchase Order</h3>
                <button 
                  onClick={() => setSelectedCropForOrder(null)} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-muted)' }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleOrderSubmit}>
                <div className="modal-body">
                  <div style={{
                    padding: '12px',
                    backgroundColor: 'var(--agri-green-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '16px',
                    border: '1px solid var(--agri-green-border)'
                  }}>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--agri-green-dark)' }}>
                      {selectedCropForOrder.cropName} ({selectedCropForOrder.variety})
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Farmer: <strong>{selectedCropForOrder.farmerName}</strong> • {selectedCropForOrder.location} • {selectedCropForOrder.grade}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Procurement Volume in Kilograms (kg)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      min="100"
                      max={selectedCropForOrder.quantityKg || 50000}
                      value={orderQuantityKg}
                      onChange={(e) => setOrderQuantityKg(e.target.value)}
                      required
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Max available: {(selectedCropForOrder.quantityKg || 1000).toLocaleString()} kg
                    </span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Delivery Destination Hub</label>
                    <select 
                      className="form-select"
                      value={destinationHub}
                      onChange={(e) => setDestinationHub(e.target.value)}
                    >
                      <option value="Vashi APMC, Mumbai">Vashi APMC, Mumbai</option>
                      <option value="Azadpur Mandi, Delhi">Azadpur Mandi, Delhi</option>
                      <option value="Madurai Logistics Park, Tamil Nadu">Madurai Logistics Park, Tamil Nadu</option>
                      <option value="Bangalore Agri-Terminal, Karnataka">Bangalore Agri-Terminal, Karnataka</option>
                    </select>
                  </div>

                  {/* Pricing Breakdown */}
                  <div style={{
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px',
                    backgroundColor: 'var(--bg-subtle)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                      <span>Unit Rate:</span>
                      <strong>₹{selectedCropForOrder.expectedPriceKg || 25} / kg</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                      <span>Quantity:</span>
                      <strong>{Number(orderQuantityKg).toLocaleString()} kg</strong>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      borderTop: '1px solid var(--border-light)',
                      paddingTop: '8px',
                      color: 'var(--agri-green)'
                    }}>
                      <span>Total Payable:</span>
                      <span>₹{Math.round((selectedCropForOrder.expectedPriceKg || 25) * Number(orderQuantityKg)).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-outline" 
                    onClick={() => setSelectedCropForOrder(null)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                  >
                    Confirm & Dispatch Logistics
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

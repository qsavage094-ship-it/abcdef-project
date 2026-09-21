import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AuthScreen from './components/AuthScreen';
import FarmerPortal from './components/FarmerPortal';
import BuyerPortal from './components/BuyerPortal';
import AdminPortal from './components/AdminPortal';
import ChatModal from './components/ChatModal';
import PricePredictionModal from './components/PricePredictionModal';
import DemandForecastModal from './components/DemandForecastModal';
import SupplyChainModal from './components/SupplyChainModal';
import OnboardingModal from './components/OnboardingModal';
import AiVoiceAssistant from './components/AiVoiceAssistant';
import { translations } from './i18n/translations';
import { INITIAL_CROPS, MOCK_BUYERS, INITIAL_ORDERS, INITIAL_CHAT_MESSAGES } from './data/mockData';
import { Home, TrendingUp, BarChart3, Truck, LogOut, Sprout, ShoppingBag, UserCheck, ShieldCheck, ArrowRight } from 'lucide-react';

const LOCALIZED_MANDI_DATA = {
  hi: {
    label: "लाइव मंडी भाव",
    items: [
      { crop: "बासमती 1121 धान (करनाल)", rate: "₹44.0/किलो", change: "+4.2%" },
      { crop: "शरबती गेहूँ (लुधियाना)", rate: "₹27.5/किलो", change: "+1.8%" },
      { crop: "सलेम हल्दी (5.2% करक्यूमिन)", rate: "₹145.0/किलो", change: "+6.5%" },
      { crop: "अल्लेप्पी हरी इलायची (8mm बोल्ड)", rate: "₹1,480.0/किलो", change: "+8.0%" },
      { crop: "रत्नागिरी हापूस आम", rate: "₹185.0/किलो", change: "+5.1%" },
      { crop: "सौराष्ट्र मूंगफली (जूनागढ़)", rate: "₹74.0/किलो", change: "+2.4%" },
      { crop: "दार्जिलिंग फर्स्ट फ्लश चाय", rate: "₹850.0/किलो", change: "+3.9%" },
      { crop: "देशी चना (इंदौर)", rate: "₹66.0/किलो", change: "+1.5%" },
      { crop: "शंकर-6 जैविक कपास (राजकोट)", rate: "₹75.0/किलो", change: "+3.2%" },
      { crop: "लासलगांव लाल प्याज (नासिक)", rate: "₹25.0/किलो", change: "-0.5%" },
      { crop: "कूर्ग अरेबिका कॉफी बीन्स", rate: "₹340.0/किलो", change: "+2.8%" },
      { crop: "कश्मीर रॉयल डिलीशियस सेब", rate: "₹120.0/किलो", change: "+4.0%" }
    ]
  },
  hinglish: {
    label: "LIVE MANDI RATES",
    items: [
      { crop: "Basmati 1121 Dhan (Karnal)", rate: "₹44.0/kg", change: "+4.2%" },
      { crop: "Sharbati Gehu (Ludhiana)", rate: "₹27.5/kg", change: "+1.8%" },
      { crop: "Salem Haldi (Curcumin 5.2%)", rate: "₹145.0/kg", change: "+6.5%" },
      { crop: "Alleppey Hari Elaichi (8mm)", rate: "₹1,480.0/kg", change: "+8.0%" },
      { crop: "Ratnagiri Hapus Aam", rate: "₹185.0/kg", change: "+5.1%" },
      { crop: "Saurashtra Moongfali", rate: "₹74.0/kg", change: "+2.4%" },
      { crop: "Darjeeling Tea Leaf", rate: "₹850.0/kg", change: "+3.9%" },
      { crop: "Desi Chana Dal (Indore)", rate: "₹66.0/kg", change: "+1.5%" },
      { crop: "Shankar-6 Cotton (Rajkot)", rate: "₹75.0/kg", change: "+3.2%" },
      { crop: "Lasalgaon Red Pyaz", rate: "₹25.0/kg", change: "-0.5%" }
    ]
  },
  mr: {
    label: "थेट बाजारभाव",
    items: [
      { crop: "बासमती 1121 धान (कर्नाल)", rate: "₹44.0/किलो", change: "+4.2%" },
      { crop: "शरबती गहू (लुधियाना)", rate: "₹27.5/किलो", change: "+1.8%" },
      { crop: "सलेम हळद (कर्क्युमिन 5.2%)", rate: "₹145.0/किलो", change: "+6.5%" },
      { crop: "अल्लेप्पी हिरवी वेलची (8mm)", rate: "₹1,480.0/किलो", change: "+8.0%" },
      { crop: "रत्नागिरी हापूस आंबा", rate: "₹185.0/किलो", change: "+5.1%" },
      { crop: "सौराष्ट्र भुईमूग शेंगा", rate: "₹74.0/किलो", change: "+2.4%" },
      { crop: "देशी हरभरा (इंदूर)", rate: "₹66.0/किलो", change: "+1.5%" },
      { crop: "लासलगाव लाल कांदा", rate: "₹25.0/किलो", change: "-0.5%" }
    ]
  },
  pa: {
    label: "ਲਾਈਵ ਮੰਡੀ ਭਾਅ",
    items: [
      { crop: "1121 ਬਾਸਮਤੀ ਝੋਨਾ (ਕਰਨਾਲ)", rate: "₹44.0/ਕਿਲੋ", change: "+4.2%" },
      { crop: "ਸ਼ਰਬਤੀ ਕਣਕ (ਲੁਧਿਆਣਾ)", rate: "₹27.5/ਕਿਲੋ", change: "+1.8%" },
      { crop: "ਸਲੇਮ ਹਲਦੀ (ਕਰਕਿਊਮਿਨ 5.2%)", rate: "₹145.0/ਕਿਲੋ", change: "+6.5%" },
      { crop: "ਅਲੈਪੀ ਹਰੀ ਇਲਾਇਚੀ (8mm)", rate: "₹1,480.0/ਕਿਲੋ", change: "+8.0%" },
      { crop: "ਰਤਨਾਗਿਰੀ ਅਲਫਾਂਸੋ ਅੰਬ", rate: "₹185.0/ਕਿਲੋ", change: "+5.1%" },
      { crop: "ਸੌਰਾਸ਼ਟਰ ਮੂੰਗਫਲੀ", rate: "₹74.0/ਕਿਲੋ", change: "+2.4%" },
      { crop: "ਦੇਸੀ ਛੋਲੇ (ਇੰਦੌਰ)", rate: "₹66.0/ਕਿਲੋ", change: "+1.5%" },
      { crop: "ਸ਼ੰਕਰ-6 ਜੈਵਿਕ ਕਪਾਹ", rate: "₹75.0/ਕਿਲੋ", change: "+3.2%" }
    ]
  },
  ta: {
    label: "நேரடி உழவர் சந்தை விலை",
    items: [
      { crop: "பாசுமதி 1121 நெல் (கர்னால்)", rate: "₹44.0/கிலோ", change: "+4.2%" },
      { crop: "சர்பதி கோதுமை (லூதியானா)", rate: "₹27.5/கிலோ", change: "+1.8%" },
      { crop: "சேலம் மஞ்சள் (5.2% குர்குமின்)", rate: "₹145.0/கிலோ", change: "+6.5%" },
      { crop: "ஆலப்புழா ஏலக்காய் (8mm)", rate: "₹1,480.0/கிலோ", change: "+8.0%" },
      { crop: "அல்போன்சா மாம்பழம் (ரத்னகிரி)", rate: "₹185.0/கிலோ", change: "+5.1%" },
      { crop: "நாட்டுத் தக்காளி (திண்டுக்கல்)", rate: "₹24.5/கிலோ", change: "+3.8%" },
      { crop: "சௌராஷ்டிரா நிலக்கடலை", rate: "₹74.0/கிலோ", change: "+2.4%" },
      { crop: "டார்ஜிலிங் தேயிலை", rate: "₹850.0/கிலோ", change: "+3.9%" },
      { crop: "நாசிக் சிவப்பு வெங்காயம்", rate: "₹25.0/கிலோ", change: "-0.5%" },
      { crop: "சங்கர்-6 இயற்கை பருத்தி", rate: "₹75.0/கிலோ", change: "+3.2%" }
    ]
  },
  te: {
    label: "లైవ్ మార్కెట్ ధరలు",
    items: [
      { crop: "బాస్మతి 1121 వరి (కర్నాల్)", rate: "₹44.0/కిలో", change: "+4.2%" },
      { crop: "శర్బతి గోధుమలు (లూధియానా)", rate: "₹27.5/కిలో", change: "+1.8%" },
      { crop: "సేలం పసుపు (5.2% కర్కుమిన్)", rate: "₹145.0/కిలో", change: "+6.5%" },
      { crop: "అలెప్పి గ్రీన్ ఏలకులు (8mm)", rate: "₹1,480.0/కిలో", change: "+8.0%" },
      { crop: "రత్నగిరి అల్ఫోన్సో మామిడి", rate: "₹185.0/కిలో", change: "+5.1%" },
      { crop: "గుంటూరు సన్నం మిర్చి (S4)", rate: "₹195.0/కిలో", change: "+3.5%" }
    ]
  },
  kn: {
    label: "ಲೈವ್ ಮಾರುಕಟ್ಟೆ ದರ",
    items: [
      { crop: "ಬಾಸ್ಮತಿ 1121 ಭತ್ತ (ಕರ್ನಾಲ್)", rate: "₹44.0/ಕೆಜಿ", change: "+4.2%" },
      { crop: "ಶರ್ಬತಿ ಗೋಧಿ (ಲುಧಿಯಾನ)", rate: "₹27.5/ಕೆಜಿ", change: "+1.8%" },
      { crop: "ಸೇಲಂ ಅರಿಶಿನ (5.2% ಕರ್ಕ್ಯುಮಿನ್)", rate: "₹145.0/ಕೆಜಿ", change: "+6.5%" },
      { crop: "ಅಲೆಪ್ಪಿ ಹಸಿರು ಏಲಕ್ಕಿ (8mm)", rate: "₹1,480.0/ಕೆಜಿ", change: "+8.0%" },
      { crop: "ರತ್ನಗಿರಿ ಆಪೂಸ್ ಮಾವು", rate: "₹185.0/ಕೆಜಿ", change: "+5.1%" }
    ]
  },
  bn: {
    label: "লাইভ বাজার দর",
    items: [
      { crop: "বাসমতী ১১২১ ধান (কারনাল)", rate: "₹৪৪.০/কেজি", change: "+৪.২%" },
      { crop: "শরবতি গম (লুধিয়ানা)", rate: "₹২৭.৫/কেজি", change: "+১.৮%" },
      { crop: "সালেম হলুদ (৫.২% কার্কিউমিন)", rate: "₹১৪৫.০/কেজি", change: "+৬.৫%" },
      { crop: "আলেপ্পি এলাচ (৮ মিমি)", rate: "₹১,৪৮০.০/কেজি", change: "+৮.০%" }
    ]
  },
  gu: {
    label: "લાઈવ મંડી ભાવ",
    items: [
      { crop: "બાસમતી 1121 ડાંગર (કરનાલ)", rate: "₹44.0/કિલો", change: "+4.2%" },
      { crop: "શરબતી ઘઉં (લુધિયાણા)", rate: "₹27.5/કિલો", change: "+1.8%" },
      { crop: "સલેમ હળદર (5.2% કરક્યુમિન)", rate: "₹145.0/કિલો", change: "+6.5%" },
      { crop: "સૌરાષ્ટ્ર મગફળી (જૂનાગઢ)", rate: "₹74.0/કિલો", change: "+2.4%" },
      { crop: "ઊંઝા સાફ જીરું (99.5%)", rate: "₹290.0/કિલો", change: "+4.5%" }
    ]
  },
  en: {
    label: "LIVE MANDI RATES",
    items: [
      { crop: "Basmati 1121 Paddy (Karnal)", rate: "₹44.0/kg", change: "+4.2%" },
      { crop: "Sharbati Wheat (Ludhiana)", rate: "₹27.5/kg", change: "+1.8%" },
      { crop: "Salem Turmeric (5.2% Curcumin)", rate: "₹145.0/kg", change: "+6.5%" },
      { crop: "Alleppey Green Cardamom (8mm)", rate: "₹1,480.0/kg", change: "+8.0%" },
      { crop: "Alphonso Mango (Ratnagiri)", rate: "₹185.0/kg", change: "+5.1%" },
      { crop: "Saurashtra Groundnut (Junagadh)", rate: "₹74.0/kg", change: "+2.4%" },
      { crop: "Darjeeling First Flush Tea", rate: "₹850.0/kg", change: "+3.9%" },
      { crop: "Desi Chickpea (Indore)", rate: "₹66.0/kg", change: "+1.5%" },
      { crop: "Shankar-6 Organic Cotton", rate: "₹75.0/kg", change: "+3.2%" },
      { crop: "Lasalgaon Red Onion (Nashik)", rate: "₹25.0/kg", change: "-0.5%" }
    ]
  }
};

export default function App() {
  // Authentication State: null = Guest Mode (can browse full marketplace without login)
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'
  const [currentLang, setLang] = useState('en'); // Default language is English, with full multi-language switching

  // Shared Data in kg
  const [crops, setCrops] = useState(INITIAL_CROPS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [buyers] = useState(MOCK_BUYERS);

  // Active Modals
  const [activeChatRecipient, setActiveChatRecipient] = useState(null);
  const [showPriceLab, setShowPriceLab] = useState(false);
  const [showDemandRadar, setShowDemandRadar] = useState(false);
  const [activeSupplyChainOrder, setActiveSupplyChainOrder] = useState(null);
  const [showGenericSupplyChain, setShowGenericSupplyChain] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Set data-theme on document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const t = translations[currentLang] || translations.en;

  const handleAddCrop = (newCrop) => {
    setCrops(prev => [newCrop, ...prev]);
  };

  const handlePlaceOrder = (newOrder) => {
    setOrders(prev => [newOrder, ...prev]);
  };

  const handleAcceptOrder = (orderId) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'In Transit' } : o));
  };

  const handleRejectOrder = (orderId) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Cancelled' } : o));
  };

  return (
    <div data-theme={theme} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)' }}>
      
      {/* Live Mandi Rate Ticker Bar (Dynamically Localized to User's Language) */}
      {(() => {
        const activeMandi = LOCALIZED_MANDI_DATA[currentLang] || LOCALIZED_MANDI_DATA.en;
        return (
          <div className="mandi-ticker-wrap">
            <div style={{ padding: '0 16px', display: 'flex', alignItems: 'center', gap: '6px', borderRight: '1px solid var(--border-light)', flexShrink: 0 }}>
              <span className="live-pulse-dot"></span>
              <span style={{ fontSize: '0.725rem', fontWeight: 800, color: 'var(--agri-green)' }}>
                {activeMandi.label}
              </span>
            </div>

            <div className="mandi-ticker-track">
              {[...activeMandi.items, ...activeMandi.items].map((item, idx) => (
                <div key={idx} className="ticker-item">
                  <span>{item.crop}:</span>
                  <span className="ticker-rate">{item.rate}</span>
                  <span style={{ fontSize: '0.675rem', color: item.change.startsWith('+') ? 'var(--agri-green)' : 'var(--harvest-amber)' }}>
                    {item.change}
                  </span>
                  <span style={{ opacity: 0.3 }}>•</span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Biophilic Header (Adaptive for Guests & Logged-in Users) */}
      <Header 
        user={currentUser}
        onLogout={() => setCurrentUser(null)}
        onOpenAuth={() => setShowAuthModal(true)}
        theme={theme}
        toggleTheme={toggleTheme}
        currentLang={currentLang}
        setLang={setLang}
        t={t}
        onOpenPriceLab={() => setShowPriceLab(true)}
        onOpenDemandRadar={() => setShowDemandRadar(true)}
        onOpenSupplyChain={() => setShowGenericSupplyChain(true)}
        onOpenOnboarding={() => setShowOnboarding(true)}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>

        {/* If Guest (Unauthenticated): Show Welcoming Hero Banner + Full Marketplace Display */}
        {!currentUser && (
          <div className="container" style={{ paddingTop: '20px' }}>
            <div className="hero-banner-biophilic">
              <div style={{ maxWidth: '820px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', marginBottom: '12px' }}>
                  <Sprout size={15} color="var(--agri-green)" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--agri-green)' }}>
                    {currentLang === 'ta'
                      ? "100% சான்றளிக்கப்பட்ட நேரடி உழவர் சந்தை • இடைத்தரகர்கள் இல்லை • APMC மண்டி விலை"
                      : currentLang === 'hi'
                        ? "100% प्रमाणित डायरेक्ट मंडी • बिचौलियों से मुक्त • पारदर्शी मंडी भाव"
                        : "100% Certified Direct Mandi • Zero Middlemen • Transparent Mandi Valuation"}
                  </span>
                </div>

                <h1 style={{ fontSize: '2.4rem', lineHeight: '1.25', marginBottom: '12px', color: 'var(--text-primary)' }}>
                  {currentLang === 'ta'
                    ? "நேரடி பண்ணை உழவர் சந்தை • இடைத்தரகர்கள் இன்றி நியாயமான சந்தை விலை"
                    : currentLang === 'hi' 
                      ? "सीधे खेत से ताज़ा उपज • बिना किसी बिचौलिये के" 
                      : currentLang === 'mr'
                        ? "थेट शेतातून ताजी पिके • दलालांशिवाय थेट खरेदी-विक्री"
                        : "Direct Farm-Gate Agricultural Marketplace • Transparent Mandi Valuation"}
                </h1>

                <p style={{ fontSize: '1.0rem', color: 'var(--text-secondary)', lineHeight: '1.55', marginBottom: '20px' }}>
                  {currentLang === 'ta'
                    ? "28+ வகையான நேரடி விவசாயப் பயிர்கள் — தானியங்கள், பருப்பு வகைகள், மசாலா பொருட்கள், பழங்கள் மற்றும் காய்கறிகள். நேரடி உழவர் சந்தை விலை ஒப்பீடு மற்றும் வானிஸ்ரீயின் நட்பான தமிழ் குரல் வழிகாட்டலுடன் வாங்குங்கள்."
                    : currentLang === 'hi'
                      ? "विश्वसनीय कृषि मंच। यहाँ 28+ प्रकार की फसलें — बासमती धान, शरबती गेहूँ, सलेम हल्दी और ताज़ा फल सीधे किसानों से उपलब्ध हैं। पारदर्शी मंडी दरें देखें और ऑडियो गाइड से मदद लें।"
                      : "Explore 28+ agricultural crops across Grains, Pulses, Spices, Cash Crops, Fruits, and Vegetables. Check live APMC mandi benchmarks and listen to our multilingual audio guide in your native language."}
                </p>

                {/* 1-Click Fast Demo Profile Switches for Guests */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => setCurrentUser({
                      id: 'farmer_1',
                      role: 'farmer',
                      name: currentLang === 'ta' ? 'அண்ணாமலை முத்து' : 'Rameshwar Patil',
                      email: 'annamalai@patilfarm.in',
                      location: currentLang === 'ta' ? 'திண்டுக்கல், தமிழ்நாடு' : 'Nashik, Maharashtra'
                    })}
                    id="btn-quick-demo-farmer"
                  >
                    <span>🌾 {currentLang === 'ta' ? 'விவசாயி முறை (அண்ணாமலை)' : currentLang === 'hi' ? 'किसान मोड देखें (रामेश्वर पाटिल)' : 'Test as Farmer (Rameshwar)'}</span>
                    <ArrowRight size={14} />
                  </button>

                  <button
                    className="btn btn-accent"
                    onClick={() => setCurrentUser({
                      id: 'buyer_1',
                      role: 'buyer',
                      name: currentLang === 'ta' ? 'சவுதர்ன் ஸ்பைசஸ்' : 'Vikram Malhotra',
                      email: 'procurement@freshagro.in',
                      location: currentLang === 'ta' ? 'கோயம்புத்தூர் மார்க்கெட்' : 'Vashi APMC, Mumbai'
                    })}
                    id="btn-quick-demo-buyer"
                  >
                    <span>🏢 {currentLang === 'ta' ? 'வாங்குபவர் முறை (சவுதர்ன் ஸ்பைசஸ்)' : currentLang === 'hi' ? 'थोक खरीदार मोड (फ्रेशएग्रो)' : 'Test as Buyer (FreshAgro)'}</span>
                    <ArrowRight size={14} />
                  </button>

                  <button
                    className="btn btn-outline"
                    onClick={() => setShowAuthModal(true)}
                    style={{ borderStyle: 'dashed' }}
                  >
                    <span>🔒 {currentLang === 'ta' ? 'உள்நுழைவு / பதிவு' : currentLang === 'hi' ? 'कस्टम लॉगिन / साइन अप' : 'Sign In / Register'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Public Marketplace Catalog (Browse All Produce Freely) */}
            <BuyerPortal 
              user={null}
              crops={crops}
              orders={orders}
              onPlaceOrder={handlePlaceOrder}
              onOpenChat={() => setShowAuthModal(true)}
              onOpenSupplyChain={(order) => setActiveSupplyChainOrder(order)}
              t={t}
              isGuest={true}
              onRequireAuth={() => setShowAuthModal(true)}
              currentLang={currentLang}
            />
          </div>
        )}

        {/* If Logged In as Farmer: Strict Farmer Portal */}
        {currentUser?.role === 'farmer' && (
          <FarmerPortal 
            user={currentUser}
            crops={crops}
            onAddCrop={handleAddCrop}
            orders={orders}
            onAcceptOrder={handleAcceptOrder}
            onRejectOrder={handleRejectOrder}
            buyers={buyers}
            onOpenChat={(buyer) => setActiveChatRecipient(buyer)}
            onOpenSupplyChain={(order) => setActiveSupplyChainOrder(order)}
            t={t}
          />
        )}

        {/* If Logged In as Buyer: Dedicated Buyer Portal */}
        {currentUser?.role === 'buyer' && (
          <BuyerPortal 
            user={currentUser}
            crops={crops}
            orders={orders}
            onPlaceOrder={handlePlaceOrder}
            onOpenChat={(farmer) => setActiveChatRecipient(farmer)}
            onOpenSupplyChain={(order) => setActiveSupplyChainOrder(order)}
            t={t}
            isGuest={false}
            currentLang={currentLang}
          />
        )}

        {/* If Logged In as Admin: Oversight Portal */}
        {currentUser?.role === 'admin' && (
          <AdminPortal 
            user={currentUser}
            crops={crops}
            orders={orders}
            t={t}
          />
        )}
      </main>

      {/* Minimal Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-light)',
        padding: '20px 0',
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        marginTop: '30px',
        backgroundColor: 'var(--bg-card)'
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <strong style={{ color: 'var(--color-deep-green)' }}>{t.brand || "AgriDirect"}</strong> — {t.tagline || "Digital Agri-Marketplace & Supply Chain"}.
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            100% Direct APMC Mandi Trading Platform
          </div>
        </div>
      </footer>

      {/* Auth Modal (Opens on request for Guests) */}
      {showAuthModal && (
        <div className="modal-backdrop" onClick={() => setShowAuthModal(false)}>
          <div style={{ maxWidth: '520px', width: '100%' }} onClick={(e) => e.stopPropagation()}>
            <AuthScreen 
              onLogin={(user) => {
                setCurrentUser(user);
                setShowAuthModal(false);
              }}
              onClose={() => setShowAuthModal(false)}
              theme={theme}
              toggleTheme={toggleTheme}
              currentLang={currentLang}
              setLang={setLang}
              t={t}
            />
          </div>
        </div>
      )}

      {/* Other Modals */}
      {activeChatRecipient && (
        <ChatModal 
          recipient={activeChatRecipient}
          currentUserRole={currentUser?.role || 'buyer'}
          currentUserId={currentUser?.id || 'guest'}
          onClose={() => setActiveChatRecipient(null)}
          initialMessages={INITIAL_CHAT_MESSAGES}
          t={t}
        />
      )}

      {showPriceLab && (
        <PricePredictionModal 
          onClose={() => setShowPriceLab(false)}
          t={t}
        />
      )}

      {showDemandRadar && (
        <DemandForecastModal 
          onClose={() => setShowDemandRadar(false)}
          t={t}
        />
      )}

      {(activeSupplyChainOrder || showGenericSupplyChain) && (
        <SupplyChainModal 
          order={activeSupplyChainOrder}
          onClose={() => {
            setActiveSupplyChainOrder(null);
            setShowGenericSupplyChain(false);
          }}
          t={t}
        />
      )}

      {showOnboarding && (
        <OnboardingModal 
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          initialRole={currentUser?.role}
          t={t}
        />
      )}

      {/* Universal Multilingual AI Voice Assistant ('Tara' in 10 languages) */}
      <AiVoiceAssistant 
        user={currentUser} 
        t={t} 
        currentLang={currentLang}
        onLangChange={setLang}
      />

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cropService } from '../services/api';
import CropCard from '../components/CropCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  FiSearch, 
  FiArrowRight, 
  FiCheckCircle, 
  FiTrendingUp, 
  FiShield, 
  FiTruck,
  FiShoppingBag
} from 'react-icons/fi';
import { FaLeaf, FaSeedling, FaTractor, FaAppleAlt } from 'react-icons/fa';

const Home = () => {
  const [featuredCrops, setFeaturedCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroSearch, setHeroSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await cropService.getFeatured();
        if (res.data && res.data.success) {
          setFeaturedCrops(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching featured crops:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/crops?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/crops');
    }
  };

  const categories = [
    {
      name: 'Grains & Cereals',
      count: 'Basmati, Wheat, Bajra, Maize',
      icon: '🌾',
      bg: 'from-amber-500/10 to-yellow-500/20',
      border: 'border-amber-200'
    },
    {
      name: 'Vegetables',
      count: 'Tomatoes, Onions, Potatoes, Capsicum',
      icon: '🥕',
      bg: 'from-emerald-500/10 to-green-500/20',
      border: 'border-emerald-200'
    },
    {
      name: 'Fruits',
      count: 'Shimla Apples, Alphonso Mangoes, Grapes',
      icon: '🍎',
      bg: 'from-rose-500/10 to-pink-500/20',
      border: 'border-rose-200'
    },
    {
      name: 'Pulses & Legumes',
      count: 'Arhar Dal, Kabuli Chana, Green Moong',
      icon: '🌱',
      bg: 'from-lime-500/10 to-emerald-500/20',
      border: 'border-lime-200'
    },
    {
      name: 'Spices',
      count: 'Black Pepper, Guntur Chillies, Turmeric',
      icon: '🌶️',
      bg: 'from-orange-500/10 to-amber-500/20',
      border: 'border-orange-200'
    },
    {
      name: 'Cash Crops',
      count: 'Cotton, Sugarcane, Jute, Arabica Coffee',
      icon: '☕',
      bg: 'from-teal-500/10 to-cyan-500/20',
      border: 'border-teal-200'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-950 to-slate-900 text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-6 backdrop-blur-sm animate-pulse">
            <FaSeedling className="text-emerald-400" />
            <span>Next-Gen Agricultural Trade & Management</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            Direct Farm Produce Trade, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-amber-300">
              Fair Pricing for Every Kisan
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-emerald-100/80 max-w-2xl mx-auto leading-relaxed">
            Eliminating middlemen. Direct digital mandi platform connecting farmers, agricultural cooperatives, and commercial buyers with verified crop listings.
          </p>

          {/* Hero Search Box */}
          <form
            onSubmit={handleHeroSearch}
            className="mt-8 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-2 p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl"
          >
            <div className="relative w-full flex items-center">
              <FiSearch className="absolute left-4 text-slate-300 text-lg" />
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Search crops like Basmati, Wheat, Mangoes, or state..."
                className="w-full pl-11 pr-4 py-3 bg-white text-slate-900 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shrink-0 flex items-center justify-center gap-2"
            >
              <span>Explore</span>
              <FiArrowRight />
            </button>
          </form>

          {/* Quick Tags */}
          <div className="mt-4 flex flex-wrap justify-center items-center gap-2 text-xs text-emerald-200/70">
            <span>Popular:</span>
            <Link to="/crops?category=Grains%20%26%20Cereals" className="underline hover:text-white">Pusa 1121 Basmati</Link>
            <span>•</span>
            <Link to="/crops?category=Fruits" className="underline hover:text-white">Shimla Apples</Link>
            <span>•</span>
            <Link to="/crops?category=Spices" className="underline hover:text-white">Tellicherry Pepper</Link>
            <span>•</span>
            <Link to="/crops?organic=true" className="underline hover:text-white">Certified Organic</Link>
          </div>

          {/* Key Metric Highlights */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-black text-emerald-400">30+</p>
              <p className="text-xs text-slate-300 mt-1 font-medium">Domain Crops Listed</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-black text-amber-300">100%</p>
              <p className="text-xs text-slate-300 mt-1 font-medium">Verified Farmers</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-black text-teal-300">0%</p>
              <p className="text-xs text-slate-300 mt-1 font-medium">Middleman Margin</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-black text-rose-300">Fast</p>
              <p className="text-xs text-slate-300 mt-1 font-medium">Direct Mandi Dispatch</p>
            </div>
          </div>

        </div>
      </section>

      {/* Main Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
              Agricultural Produce
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Browse by Crop Category
            </h2>
          </div>
          <Link
            to="/crops"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-900"
          >
            <span>View All Categories</span>
            <FiArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/crops?category=${encodeURIComponent(cat.name)}`}
              className={`p-6 rounded-2xl border ${cat.border} bg-gradient-to-br ${cat.bg} hover:shadow-lg transition-all duration-200 group flex items-start justify-between`}
            >
              <div>
                <span className="text-3xl mb-3 block">{cat.icon}</span>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-600 mt-1">{cat.count}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 group-hover:scale-110 transition-all shadow-sm">
                <FiArrowRight />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Crops Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
              Fresh Harvests
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Crop Produce Listings
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Directly available from regional farms with verified harvest details
            </p>
          </div>
          <Link
            to="/crops"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition"
          >
            <span>All 30+ Crops</span>
            <FiArrowRight />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading featured crop listings..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCrops.map((crop) => (
              <CropCard key={crop._id} crop={crop} />
            ))}
          </div>
        )}
      </section>

      {/* How AgroConnect Works */}
      <section className="bg-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              How AgroConnect Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Transparent, accountable agricultural management for farmers and wholesale buyers alike.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Farmers List Produce</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Farmers upload harvest details, quantity, expected price per quintal/kg, soil type, and location.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Buyers Submit Procurement</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Buyers search available lots, inspect specifications, and send instant procurement requests with delivery details.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Dispatch & Order Tracking</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Farmers and admins approve the deal, dispatch lots from the mandi, and track fulfillment in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to modernize your crop trade?
            </h2>
            <p className="text-sm text-emerald-100/90 leading-relaxed">
              Join hundreds of farmers and agribusiness buyers already trading with zero broker markups on AgroConnect.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/register"
              className="px-6 py-3 bg-white text-emerald-900 hover:bg-emerald-50 text-sm font-bold rounded-xl shadow transition"
            >
              Create Free Account
            </Link>
            <Link
              to="/crops"
              className="px-6 py-3 bg-emerald-700/80 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition border border-emerald-500/40"
            >
              Explore Catalog
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;

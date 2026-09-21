import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { cropService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CreateRequestModal from '../components/CreateRequestModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  FiArrowLeft, 
  FiMapPin, 
  FiUser, 
  FiPhone, 
  FiCalendar, 
  FiPackage, 
  FiCheckCircle, 
  FiShield, 
  FiShoppingBag,
  FiAward
} from 'react-icons/fi';

const CropDetails = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchCropDetails = async () => {
      try {
        const res = await cropService.getById(id);
        if (res.data && res.data.success) {
          setCrop(res.data.data);
        } else {
          setError(res.data.message || 'Produce record not found');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Error loading crop details');
      } finally {
        setLoading(false);
      }
    };

    fetchCropDetails();
  }, [id]);

  const handleOpenProcure = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/crops/${id}` } } });
      return;
    }
    setIsModalOpen(true);
  };

  const handleRequestSuccess = (newRequest) => {
    setSuccessMessage(
      `Procurement request for ${newRequest.requestedQuantity} ${newRequest.unit} placed successfully! You can track its status in 'My Requests'.`
    );
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Loading crop produce details..." />
      </div>
    );
  }

  if (error || !crop) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Crop Not Found</h2>
        <p className="text-xs text-slate-500">{error || 'The requested crop could not be located.'}</p>
        <Link
          to="/crops"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
        >
          <FiArrowLeft /> Back to Crop Catalog
        </Link>
      </div>
    );
  }

  const fallbackImage =
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Back button */}
      <div>
        <Link
          to="/crops"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition"
        >
          <FiArrowLeft /> Back to Browse Crops
        </Link>
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between gap-3 text-sm text-emerald-900 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <FiCheckCircle className="text-emerald-600 text-xl shrink-0" />
            <span>{successMessage}</span>
          </div>
          <Link
            to="/my-requests"
            className="text-xs font-bold underline text-emerald-800 shrink-0 hover:text-emerald-950"
          >
            View My Requests →
          </Link>
        </div>
      )}

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Imagery & Badges */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 aspect-4/3 max-h-[460px] w-full">
            <img
              src={crop.imageUrl || fallbackImage}
              alt={crop.name}
              onError={(e) => {
                e.target.src = fallbackImage;
              }}
              className="w-full h-full object-cover"
            />
            {crop.organicStatus && (
              <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                <FiAward /> Certified Organic
              </span>
            )}
            <span className="absolute top-4 right-4 bg-white/95 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
              Status: {crop.status}
            </span>
          </div>

          {/* Quick Quality Indicators */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
              <span className="text-xs text-slate-400 block font-medium">Category</span>
              <span className="text-xs font-bold text-slate-800">{crop.category}</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
              <span className="text-xs text-slate-400 block font-medium">Soil Origin</span>
              <span className="text-xs font-bold text-slate-800">{crop.soilType || 'Natural Loam'}</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
              <span className="text-xs text-slate-400 block font-medium">Harvest Date</span>
              <span className="text-xs font-bold text-slate-800">
                {crop.harvestDate ? new Date(crop.harvestDate).toLocaleDateString() : 'Fresh Lot'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Crop Info & Order CTA */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1 block">
              {crop.category} Produce Lot
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {crop.name}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
              Harvested and stored under compliant regional agricultural guidelines.
            </p>
          </div>

          {/* Pricing Box */}
          <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-2xl border border-emerald-200/80 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-800 block">
                Wholesale Mandi Price
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-black text-slate-900">
                  ₹{crop.pricePerUnit.toLocaleString('en-IN')}
                </span>
                <span className="text-sm font-semibold text-slate-600">/ {crop.unit}</span>
              </div>
              <p className="text-xs text-emerald-700 mt-1">
                Zero commission • Direct farmer settlement
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-500 block">Available Stock</span>
              <span className="text-xl font-bold text-emerald-950">
                {crop.quantity} {crop.unit}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-800">Produce Details & Quality Notes</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-white p-4 rounded-xl border border-slate-200">
              {crop.description}
            </p>
          </div>

          {/* Farmer & Mandi Location Information */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Producer & Farm Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2.5 text-slate-700">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <FiUser />
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Farmer / Producer</span>
                  <span className="font-semibold text-slate-800">{crop.farmerName}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-slate-700">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <FiMapPin />
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Farm / Mandi Location</span>
                  <span className="font-semibold text-slate-800">{crop.location}</span>
                </div>
              </div>

              {crop.farmerPhone && (
                <div className="flex items-center gap-2.5 text-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <FiPhone />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Direct Contact</span>
                    <span className="font-semibold text-slate-800">{crop.farmerPhone}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2.5 text-slate-700">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <FiPackage />
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Dispatch Ready</span>
                  <span className="font-semibold text-slate-800">
                    {crop.status === 'Available' ? 'Immediate Dispatch' : crop.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleOpenProcure}
              disabled={crop.status === 'Sold Out'}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiShoppingBag className="text-lg" />
              <span>
                {crop.status === 'Sold Out'
                  ? 'Produce Currently Sold Out'
                  : 'Place Procurement Request'}
              </span>
            </button>
            {!isAuthenticated && (
              <p className="text-[11px] text-center text-slate-500 mt-2">
                Note: You will be prompted to login to finalize your request.
              </p>
            )}
          </div>

        </div>

      </div>

      {/* Procurement Modal */}
      <CreateRequestModal
        crop={crop}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleRequestSuccess}
      />

    </div>
  );
};

export default CropDetails;

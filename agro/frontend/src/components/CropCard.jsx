import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiUser, FiCalendar, FiArrowRight } from 'react-icons/fi';
import { FaCheckCircle, FaAward } from 'react-icons/fa';

const CropCard = ({ crop }) => {
  const {
    _id,
    name,
    category,
    farmerName,
    location,
    quantity,
    unit,
    pricePerUnit,
    organicStatus,
    status,
    imageUrl
  } = crop;

  const fallbackImage =
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80';

  const categoryColors = {
    'Grains & Cereals': 'bg-amber-100 text-amber-800 border-amber-200',
    Vegetables: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Fruits: 'bg-rose-100 text-rose-800 border-rose-200',
    'Pulses & Legumes': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Spices: 'bg-orange-100 text-orange-800 border-orange-200',
    'Cash Crops': 'bg-teal-100 text-teal-800 border-teal-200'
  };

  const statusBadge = {
    Available: 'bg-emerald-500 text-white',
    Reserved: 'bg-amber-500 text-white',
    'Sold Out': 'bg-slate-400 text-white'
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1">
      {/* Image and Badges */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={imageUrl || fallbackImage}
          alt={name}
          onError={(e) => {
            e.target.src = fallbackImage;
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Status Badge */}
        <span
          className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm ${
            statusBadge[status] || 'bg-slate-500 text-white'
          }`}
        >
          {status}
        </span>

        {/* Organic Tag */}
        {organicStatus && (
          <span className="absolute top-3 left-3 bg-emerald-600/90 backdrop-blur text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <FaAward className="text-emerald-200 text-xs" /> Organic
          </span>
        )}

        {/* Category Pill */}
        <span
          className={`absolute bottom-3 left-3 text-xs font-medium px-2.5 py-1 rounded-lg border backdrop-blur-md bg-white/90 shadow-sm ${
            categoryColors[category] || 'bg-slate-100 text-slate-800'
          }`}
        >
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
            {name}
          </h3>

          {/* Farmer & Location details */}
          <div className="mt-3 space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <FiUser className="text-emerald-600 shrink-0" />
              <span className="font-medium text-slate-700 truncate">{farmerName}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiMapPin className="text-emerald-600 shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          </div>
        </div>

        {/* Pricing and Action */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Price</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-extrabold text-slate-900">
                ₹{pricePerUnit.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-500 font-medium">/{unit}</span>
            </div>
            <span className="text-[11px] text-slate-500 block">
              Stock: {quantity} {unit}
            </span>
          </div>

          <Link
            to={`/crops/${_id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white rounded-xl transition-all duration-200"
          >
            <span>Details</span>
            <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CropCard;

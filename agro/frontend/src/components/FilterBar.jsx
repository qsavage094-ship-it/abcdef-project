import React from 'react';
import { FiFilter, FiRotateCcw } from 'react-icons/fi';

const FilterBar = ({
  category,
  setCategory,
  organic,
  setOrganic,
  status,
  setStatus,
  sort,
  setSort,
  onReset
}) => {
  const categories = [
    'All',
    'Grains & Cereals',
    'Vegetables',
    'Fruits',
    'Pulses & Legumes',
    'Spices',
    'Cash Crops'
  ];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
      {/* Category Pills */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <FiFilter className="text-emerald-600" /> Categories
          </span>
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
          >
            <FiRotateCcw className="text-xs" /> Reset Filters
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                category === cat
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Secondary dropdown filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
        
        {/* Organic Status */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Farming Method
          </label>
          <select
            value={organic}
            onChange={(e) => setOrganic(e.target.value)}
            className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="All">All Types</option>
            <option value="true">Certified Organic Only</option>
            <option value="false">Conventional Produce</option>
          </select>
        </div>

        {/* Stock Status */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Availability
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available Only</option>
            <option value="Reserved">Reserved</option>
            <option value="Sold Out">Sold Out</option>
          </select>
        </div>

        {/* Sort by */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Sort By
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="newest">Newest Harvests First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="quantity-high">Highest Available Quantity</option>
            <option value="name-asc">Crop Name (A-Z)</option>
          </select>
        </div>

      </div>
    </div>
  );
};

export default FilterBar;

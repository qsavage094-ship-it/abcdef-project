import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { cropService } from '../services/api';
import CropCard from '../components/CropCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiX, FiLayers } from 'react-icons/fi';

const CropsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter state initialized from URL params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [organic, setOrganic] = useState(searchParams.get('organic') || 'All');
  const [status, setStatus] = useState(searchParams.get('status') || 'All');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Synchronize state with URL parameters
  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (category !== 'All') params.category = category;
    if (organic !== 'All') params.organic = organic;
    if (status !== 'All') params.status = status;
    if (sort !== 'newest') params.sort = sort;
    setSearchParams(params, { replace: true });
  }, [search, category, organic, status, sort]);

  // Fetch crops based on active parameters
  const fetchCrops = async () => {
    setLoading(true);
    setError('');
    try {
      const queryParams = {};
      if (search.trim()) queryParams.search = search.trim();
      if (category !== 'All') queryParams.category = category;
      if (organic !== 'All') queryParams.organic = organic;
      if (status !== 'All') queryParams.status = status;
      if (sort) queryParams.sort = sort;

      const res = await cropService.getAll(queryParams);
      if (res.data && res.data.success) {
        setCrops(res.data.data);
      } else {
        setError(res.data.message || 'Failed to retrieve crops');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error loading crops');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, [category, organic, status, sort]);

  const handleSearchSubmit = () => {
    fetchCrops();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setOrganic('All');
    setStatus('All');
    setSort('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header & Title */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
          <FiLayers />
          <span>Agricultural Marketplace</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Browse Crop Produce
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Search wholesale lots of grains, pulses, fruits, and cash crops directly from regional Indian agricultural producers.
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <SearchBar
            search={search}
            setSearch={setSearch}
            onSearchSubmit={handleSearchSubmit}
            placeholder="Search crop name, farmer name, state, or keywords..."
          />
        </div>

        <FilterBar
          category={category}
          setCategory={setCategory}
          organic={organic}
          setOrganic={setOrganic}
          status={status}
          setStatus={setStatus}
          sort={sort}
          setSort={setSort}
          onReset={handleResetFilters}
        />
      </div>

      {/* Active filters indicators */}
      {(search || category !== 'All' || organic !== 'All' || status !== 'All') && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <span className="font-semibold">Active filters:</span>
          {search && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800">
              Search: "{search}"
              <button type="button" onClick={() => setSearch('')}>
                <FiX className="hover:text-red-600" />
              </button>
            </span>
          )}
          {category !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800">
              Category: {category}
              <button type="button" onClick={() => setCategory('All')}>
                <FiX className="hover:text-red-600" />
              </button>
            </span>
          )}
          {organic !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800">
              {organic === 'true' ? 'Certified Organic' : 'Conventional'}
              <button type="button" onClick={() => setOrganic('All')}>
                <FiX className="hover:text-red-600" />
              </button>
            </span>
          )}
          {status !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800">
              Status: {status}
              <button type="button" onClick={() => setStatus('All')}>
                <FiX className="hover:text-red-600" />
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-emerald-700 underline font-semibold ml-2 hover:text-emerald-900"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>
          Showing <strong className="text-slate-800">{crops.length}</strong> available crop produce lots
        </span>
      </div>

      {/* Grid or Empty / Loading State */}
      {loading ? (
        <LoadingSpinner text="Searching and loading crop listings..." />
      ) : error ? (
        <div className="p-8 text-center bg-red-50 rounded-2xl border border-red-200">
          <p className="text-sm font-semibold text-red-700">{error}</p>
          <button
            type="button"
            onClick={fetchCrops}
            className="mt-4 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl"
          >
            Retry
          </button>
        </div>
      ) : crops.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto text-2xl">
            🌱
          </div>
          <h3 className="text-lg font-bold text-slate-800">No crops matched your criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms or relaxing the category and organic filters to view more harvests.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-2 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow hover:bg-emerald-700"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {crops.map((crop) => (
            <CropCard key={crop._id} crop={crop} />
          ))}
        </div>
      )}

    </div>
  );
};

export default CropsList;

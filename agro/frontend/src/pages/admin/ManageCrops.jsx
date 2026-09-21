import React, { useState, useEffect } from 'react';
import { cropService } from '../../services/api';
import CropFormModal from './CropFormModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiSearch, 
  FiLayers, 
  FiExternalLink, 
  FiCheckCircle 
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

const ManageCrops = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cropToEdit, setCropToEdit] = useState(null);
  const [successBanner, setSuccessBanner] = useState('');

  const fetchCrops = async () => {
    setLoading(true);
    try {
      const res = await cropService.getAll();
      if (res.data && res.data.success) {
        setCrops(res.data.data);
      } else {
        setError(res.data.message || 'Failed to fetch crops');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error fetching crops');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  const handleOpenCreate = () => {
    setCropToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (crop) => {
    setCropToEdit(crop);
    setIsModalOpen(true);
  };

  const handleDeleteCrop = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}" from the system?`)) {
      return;
    }

    try {
      const res = await cropService.delete(id);
      if (res.data && res.data.success) {
        setCrops((prev) => prev.filter((c) => c._id !== id));
        setSuccessBanner(`"${name}" was deleted successfully.`);
        setTimeout(() => setSuccessBanner(''), 4000);
      } else {
        alert(res.data.message || 'Failed to delete crop');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting crop record');
    }
  };

  const handleSaveSuccess = (savedCrop, actionType) => {
    if (actionType === 'created') {
      setCrops((prev) => [savedCrop, ...prev]);
      setSuccessBanner(`New crop "${savedCrop.name}" created successfully!`);
    } else {
      setCrops((prev) =>
        prev.map((c) => (c._id === savedCrop._id ? savedCrop : c))
      );
      setSuccessBanner(`Crop "${savedCrop.name}" updated successfully!`);
    }
    setTimeout(() => setSuccessBanner(''), 4000);
  };

  // Filter local crops
  const filteredCrops = crops.filter((crop) => {
    const matchesSearch =
      crop.name.toLowerCase().includes(search.toLowerCase()) ||
      crop.location.toLowerCase().includes(search.toLowerCase()) ||
      crop.farmerName.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === 'All' || crop.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
            <FiLayers />
            <span>Admin Catalog Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Manage Crop Listings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Create, update stock, modify pricing, and remove agricultural produce lots
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition shrink-0"
        >
          <FiPlus className="text-base" />
          <span>Add New Crop Produce</span>
        </button>
      </div>

      {/* Success Notification */}
      {successBanner && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in">
          <FiCheckCircle className="text-emerald-600 text-base shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Filters & Search Row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search crop, farmer, or region..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 shrink-0">Filter:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 text-xs rounded-xl border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All Categories</option>
            <option value="Grains & Cereals">Grains & Cereals</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
            <option value="Pulses & Legumes">Pulses & Legumes</option>
            <option value="Spices">Spices</option>
            <option value="Cash Crops">Cash Crops</option>
          </select>
        </div>
      </div>

      {/* Table of Crops */}
      {loading ? (
        <LoadingSpinner text="Loading marketplace crop directory..." />
      ) : error ? (
        <div className="p-6 bg-red-50 text-red-700 rounded-2xl text-center text-xs font-semibold border border-red-200">
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 border-collapse">
              <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[11px] border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Produce & Category</th>
                  <th className="px-4 py-3.5">Farmer & Region</th>
                  <th className="px-4 py-3.5">Stock</th>
                  <th className="px-4 py-3.5">Price / Unit</th>
                  <th className="px-4 py-3.5">Organic</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCrops.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-slate-400">
                      No crop produce found matching search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredCrops.map((crop) => (
                    <tr key={crop._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 font-medium">
                        <div className="flex items-center gap-3">
                          <img
                            src={crop.imageUrl}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                            onError={(e) => {
                              e.target.src =
                                'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=100&q=80';
                            }}
                          />
                          <div>
                            <span className="font-bold text-slate-900 block line-clamp-1">
                              {crop.name}
                            </span>
                            <span className="text-[10px] text-slate-400">{crop.category}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-slate-800 block">{crop.farmerName}</span>
                        <span className="text-[11px] text-slate-400">{crop.location}</span>
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-800">
                        {crop.quantity} {crop.unit}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-emerald-800">
                          ₹{crop.pricePerUnit.toLocaleString('en-IN')}
                        </span>
                        <span className="text-slate-400">/{crop.unit}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        {crop.organicStatus ? (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                            Certified Organic
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Conventional</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            crop.status === 'Available'
                              ? 'bg-emerald-100 text-emerald-800'
                              : crop.status === 'Reserved'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {crop.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-1.5">
                        <Link
                          to={`/crops/${crop._id}`}
                          target="_blank"
                          className="p-1.5 inline-block text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
                          title="View public details page"
                        >
                          <FiExternalLink />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(crop)}
                          className="p-1.5 text-slate-600 hover:text-emerald-700 rounded-lg hover:bg-emerald-50 transition"
                          title="Edit produce record"
                        >
                          <FiEdit />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCrop(crop._id, crop.name)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                          title="Delete crop record"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Crop Modal */}
      <CropFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cropToEdit={cropToEdit}
        onSaveSuccess={handleSaveSuccess}
      />

    </div>
  );
};

export default ManageCrops;

import React, { useState, useEffect } from 'react';
import { cropService } from '../../services/api';
import { FiX, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const CropFormModal = ({ isOpen, onClose, cropToEdit, onSaveSuccess }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: '',
    category: 'Grains & Cereals',
    quantity: '',
    unit: 'quintal',
    pricePerUnit: '',
    location: '',
    organicStatus: false,
    status: 'Available',
    imageUrl: '',
    soilType: 'Alluvial Soil',
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (cropToEdit) {
      setFormData({
        name: cropToEdit.name || '',
        category: cropToEdit.category || 'Grains & Cereals',
        quantity: cropToEdit.quantity || '',
        unit: cropToEdit.unit || 'quintal',
        pricePerUnit: cropToEdit.pricePerUnit || '',
        location: cropToEdit.location || '',
        organicStatus: cropToEdit.organicStatus || false,
        status: cropToEdit.status || 'Available',
        imageUrl: cropToEdit.imageUrl || '',
        soilType: cropToEdit.soilType || 'Alluvial Soil',
        description: cropToEdit.description || ''
      });
    } else {
      setFormData({
        name: '',
        category: 'Grains & Cereals',
        quantity: '',
        unit: 'quintal',
        pricePerUnit: '',
        location: '',
        organicStatus: false,
        status: 'Available',
        imageUrl: '',
        soilType: 'Alluvial Soil',
        description: ''
      });
    }
    setError('');
  }, [cropToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (
      !formData.name.trim() ||
      !formData.category ||
      !formData.quantity ||
      !formData.pricePerUnit ||
      !formData.location.trim() ||
      !formData.description.trim()
    ) {
      setError('Please fill in all mandatory fields');
      return;
    }

    setLoading(true);

    try {
      if (cropToEdit) {
        const res = await cropService.update(cropToEdit._id, formData);
        if (res.data && res.data.success) {
          onSaveSuccess(res.data.data, 'updated');
          onClose();
        } else {
          setError(res.data.message || 'Failed to update crop');
        }
      } else {
        const res = await cropService.create(formData);
        if (res.data && res.data.success) {
          onSaveSuccess(res.data.data, 'created');
          onClose();
        } else {
          setError(res.data.message || 'Failed to create crop');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Grains & Cereals',
    'Vegetables',
    'Fruits',
    'Pulses & Legumes',
    'Spices',
    'Cash Crops'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              {cropToEdit ? 'Edit Crop Produce Listing' : 'Add New Agricultural Crop Listing'}
            </h3>
            <p className="text-xs text-slate-500">
              {cropToEdit ? `Updating ${cropToEdit.name}` : 'Post new produce to the AgroConnect marketplace'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 font-medium">
              <FiAlertCircle className="text-base shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Crop Produce Title *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Traditional Basmati Paddy (Pusa 1121)"
              required
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Farm / Mandi Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Ludhiana, Punjab"
                required
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Quantity *
              </label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="250"
                required
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Unit
              </label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="kg">Kilogram (kg)</option>
                <option value="quintal">Quintal (100 kg)</option>
                <option value="ton">Metric Ton</option>
                <option value="crate">Crate / Box</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Price Per Unit (₹) *
              </label>
              <input
                type="number"
                min="0"
                value={formData.pricePerUnit}
                onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
                placeholder="3850"
                required
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Market Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Available">Available</option>
                <option value="Reserved">Reserved</option>
                <option value="Sold Out">Sold Out</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Soil Profile Origin
              </label>
              <input
                type="text"
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                placeholder="e.g. Alluvial Loam, Black Cotton"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Produce Image URL
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="organicStatus"
              checked={formData.organicStatus}
              onChange={(e) => setFormData({ ...formData, organicStatus: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
            />
            <label htmlFor="organicStatus" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Mark as Certified Organic Produce
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Description & Harvest Specifications *
            </label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe grain size, moisture levels, harvesting methods, or packaging specifications..."
              required
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
            ></textarea>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : cropToEdit ? 'Save Changes' : 'Publish Crop Listing'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default CropFormModal;

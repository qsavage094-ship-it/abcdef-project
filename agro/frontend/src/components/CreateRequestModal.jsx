import React, { useState } from 'react';
import { requestService } from '../services/api';
import { FiX, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const CreateRequestModal = ({ crop, isOpen, onClose, onSuccess }) => {
  if (!isOpen || !crop) return null;

  const [quantity, setQuantity] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalPrice = Number(quantity || 0) * crop.pricePerUnit;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!quantity || Number(quantity) <= 0) {
      setError('Please enter a valid requested quantity greater than zero');
      return;
    }

    if (Number(quantity) > crop.quantity) {
      setError(`Requested quantity cannot exceed available stock (${crop.quantity} ${crop.unit})`);
      return;
    }

    if (!deliveryAddress.trim()) {
      setError('Please provide the destination delivery address or mandi warehouse location');
      return;
    }

    if (!contactPhone.trim()) {
      setError('Please provide a contact phone number for dispatch coordination');
      return;
    }

    setLoading(true);

    try {
      const response = await requestService.create({
        cropId: crop._id,
        requestedQuantity: Number(quantity),
        deliveryAddress: deliveryAddress.trim(),
        contactPhone: contactPhone.trim(),
        notes: notes.trim()
      });

      if (response.data && response.data.success) {
        if (onSuccess) {
          onSuccess(response.data.data);
        }
        onClose();
      } else {
        setError(response.data.message || 'Failed to submit procurement request');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error creating crop request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Procure Crop Produce
            </h3>
            <p className="text-xs text-slate-500">
              Submit a direct trade booking request to the farmer
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 font-medium">
              <FiAlertCircle className="text-base shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Crop summary card */}
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/60 rounded-xl flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-emerald-950 text-sm">{crop.name}</p>
              <p className="text-emerald-700">Farmer: {crop.farmerName} • {crop.location}</p>
            </div>
            <div className="text-right">
              <span className="font-extrabold text-emerald-900 text-sm">
                ₹{crop.pricePerUnit.toLocaleString('en-IN')}
              </span>
              <span className="text-emerald-700">/{crop.unit}</span>
              <p className="text-[11px] text-emerald-600">Stock: {crop.quantity} {crop.unit}</p>
            </div>
          </div>

          {/* Quantity Input & Computed Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Quantity Needed ({crop.unit}) *
              </label>
              <input
                type="number"
                min="1"
                max={crop.quantity}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Estimated Total Value
              </label>
              <div className="px-3 py-2 text-sm font-bold text-slate-900 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between">
                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                <span className="text-[11px] font-normal text-slate-500">Auto-calc</span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Delivery Address / Mandi Hub *
            </label>
            <input
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="e.g. Warehouse 4B, APMC Yard, Vashi, Navi Mumbai"
              required
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Contact Phone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contact Phone Number *
            </label>
            <input
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="e.g. +91 98765 43210"
              required
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Notes / Special Instructions */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Special Handling / Transport Notes
            </label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Requires tarpaulin cover during transit, moisture test at unloading"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            ></textarea>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md hover:shadow transition flex items-center gap-1.5 disabled:opacity-50"
            >
              {loading ? (
                <span>Submitting...</span>
              ) : (
                <>
                  <FiCheckCircle /> Confirm Procurement Request
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateRequestModal;

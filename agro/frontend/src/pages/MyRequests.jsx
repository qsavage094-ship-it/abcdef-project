import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { requestService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  FiClipboard, 
  FiClock, 
  FiMapPin, 
  FiPhone, 
  FiCheckCircle, 
  FiXCircle, 
  FiAlertTriangle, 
  FiArrowRight, 
  FiFileText 
} from 'react-icons/fi';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchMyRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await requestService.getMyRequests();
      if (res.data && res.data.success) {
        setRequests(res.data.data);
      } else {
        setError(res.data.message || 'Failed to load your requests');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error fetching requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const handleCancelRequest = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this crop procurement request?')) {
      return;
    }

    setActionLoading(id);
    try {
      const res = await requestService.cancel(id);
      if (res.data && res.data.success) {
        // Update local list
        setRequests((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: 'Cancelled' } : r))
        );
      } else {
        alert(res.data.message || 'Failed to cancel request');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error cancelling request');
    } finally {
      setActionLoading(null);
    }
  };

  const statusColors = {
    Pending: 'bg-amber-100 text-amber-800 border-amber-200',
    Approved: 'bg-sky-100 text-sky-800 border-sky-200',
    'In Transit': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    Completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Cancelled: 'bg-slate-100 text-slate-600 border-slate-200'
  };

  const filteredRequests =
    activeFilter === 'All'
      ? requests
      : requests.filter((r) => r.status === activeFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
            <FiClipboard />
            <span>Kisan Trade Orders</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Crop Procurement Requests
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Track status, delivery destinations, and cancel pending procurement bookings
          </p>
        </div>

        <Link
          to="/crops"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition"
        >
          <span>Explore More Crops</span>
          <FiArrowRight />
        </Link>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {['All', 'Pending', 'Approved', 'In Transit', 'Completed', 'Cancelled'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveFilter(tab)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeFilter === tab
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab}
            <span className="ml-1.5 opacity-70">
              ({tab === 'All' ? requests.length : requests.filter((r) => r.status === tab).length})
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner text="Fetching your procurement requests..." />
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center">
          <p className="text-sm font-semibold text-red-700">{error}</p>
          <button
            type="button"
            onClick={fetchMyRequests}
            className="mt-3 px-4 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg"
          >
            Retry
          </button>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto text-2xl">
            <FiFileText />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No requests found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You have no crop procurement requests in this category. Browse available harvests to send direct booking requests to farmers.
          </p>
          <Link
            to="/crops"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition"
          >
            Browse Crops Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => (
            <div
              key={req._id}
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow transition-shadow space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-base shrink-0">
                    🌾
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {req.cropName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Request ID: <span className="font-mono">{req._id}</span> • Placed on {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <span
                  className={`self-start sm:self-auto text-xs font-bold px-3 py-1 rounded-full border ${
                    statusColors[req.status] || 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {req.status}
                </span>
              </div>

              {/* Order Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Quantity Booked</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {req.requestedQuantity} {req.unit}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block font-medium">Rate / Unit</span>
                  <span className="font-bold text-slate-800 text-sm">
                    ₹{req.unitPrice.toLocaleString('en-IN')} /{req.unit}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block font-medium">Total Trade Value</span>
                  <span className="font-extrabold text-emerald-700 text-base">
                    ₹{req.totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block font-medium">Farmer Contact</span>
                  <span className="font-bold text-slate-800">
                    {req.farmer?.phone || req.contactPhone || 'Provided upon dispatch'}
                  </span>
                </div>
              </div>

              {/* Delivery Address & Notes */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                <div className="flex items-start gap-1.5 text-slate-600">
                  <FiMapPin className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Delivery Mandi / Address:</strong> {req.deliveryAddress}
                  </span>
                </div>
                {req.notes && (
                  <p className="text-slate-500 italic pl-5">
                    "{req.notes}"
                  </p>
                )}
              </div>

              {/* Actions */}
              {(req.status === 'Pending' || req.status === 'Approved') && (
                <div className="pt-1 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => handleCancelRequest(req._id)}
                    disabled={actionLoading === req._id}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-xl transition disabled:opacity-50"
                  >
                    <FiXCircle />
                    <span>{actionLoading === req._id ? 'Cancelling...' : 'Cancel Request'}</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default MyRequests;

import React, { useState, useEffect } from 'react';
import { adminService, requestService } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { 
  FiClipboard, 
  FiSearch, 
  FiMapPin, 
  FiPhone, 
  FiUser, 
  FiCheckCircle, 
  FiCheck, 
  FiClock, 
  FiTruck 
} from 'react-icons/fi';

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      if (search.trim()) params.search = search.trim();

      const res = await adminService.getAllRequests(params);
      if (res.data && res.data.success) {
        setRequests(res.data.data);
      } else {
        setError(res.data.message || 'Failed to fetch requests');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error fetching requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRequests();
  };

  const handleStatusChange = async (requestId, newStatus) => {
    setUpdatingId(requestId);
    try {
      const res = await requestService.updateStatus(requestId, newStatus);
      if (res.data && res.data.success) {
        setRequests((prev) =>
          prev.map((r) => (r._id === requestId ? { ...r, status: newStatus } : r))
        );
      } else {
        alert(res.data.message || 'Failed to update request status');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating request status');
    } finally {
      setUpdatingId(null);
    }
  };

  const statusColors = {
    Pending: 'bg-amber-100 text-amber-800 border-amber-200',
    Approved: 'bg-sky-100 text-sky-800 border-sky-200',
    'In Transit': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    Completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Cancelled: 'bg-slate-100 text-slate-600 border-slate-200'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
          <FiClipboard />
          <span>Agricultural Logistics Control</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Manage Crop Procurement Requests
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Supervise order progression from Pending review to Mandi dispatch and final Delivery
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search crop, buyer, or address..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 shrink-0">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 text-xs rounded-xl border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="In Transit">In Transit</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Requests Listing */}
      {loading ? (
        <LoadingSpinner text="Loading procurement order queue..." />
      ) : error ? (
        <div className="p-6 bg-red-50 text-red-700 rounded-2xl text-center text-xs font-semibold border border-red-200">
          {error}
        </div>
      ) : requests.length === 0 ? (
        <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-2 shadow-sm">
          <p className="text-base font-bold text-slate-700">No procurement requests found</p>
          <p className="text-xs text-slate-400">Try changing the status filter or search keywords.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {req.cropName}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Order Ref: <span className="font-mono">{req._id}</span> • Placed {new Date(req.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Status Transition Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Status:</span>
                  <select
                    value={req.status}
                    disabled={updatingId === req._id}
                    onChange={(e) => handleStatusChange(req._id, e.target.value)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      statusColors[req.status] || 'bg-slate-100'
                    }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Order Information Columns */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Buyer Details</span>
                  <span className="font-bold text-slate-800 text-sm block">{req.buyerName}</span>
                  <span className="text-slate-500">{req.buyerEmail}</span>
                  <span className="text-slate-500 block">{req.contactPhone}</span>
                </div>

                <div>
                  <span className="text-slate-400 block font-medium">Volume</span>
                  <span className="font-bold text-slate-800 text-sm block">
                    {req.requestedQuantity} {req.unit}
                  </span>
                  <span className="text-slate-500">Rate: ₹{req.unitPrice} /{req.unit}</span>
                </div>

                <div>
                  <span className="text-slate-400 block font-medium">Total Settlement Value</span>
                  <span className="font-black text-emerald-800 text-base block">
                    ₹{req.totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block font-medium">Farmer / Producer</span>
                  <span className="font-bold text-slate-800 text-sm block">
                    {req.farmer?.name || 'Assigned Farmer'}
                  </span>
                  <span className="text-slate-500">{req.farmer?.phone || 'Contact on file'}</span>
                </div>
              </div>

              {/* Delivery Mandi */}
              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 text-slate-600 border border-slate-100">
                <div className="flex items-center gap-2">
                  <FiMapPin className="text-emerald-600 shrink-0" />
                  <span><strong>Destination:</strong> {req.deliveryAddress}</span>
                </div>
                {req.notes && (
                  <p className="text-slate-500 italic pl-5">
                    "{req.notes}"
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default ManageRequests;

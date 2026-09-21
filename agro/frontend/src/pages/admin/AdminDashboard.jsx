import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { 
  FiUsers, 
  FiLayers, 
  FiClipboard, 
  FiCheckCircle, 
  FiTrendingUp, 
  FiPlusCircle, 
  FiArrowRight, 
  FiShield 
} from 'react-icons/fi';
import { FaTractor } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminService.getStats();
      if (res.data && res.data.success) {
        setStats(res.data.data);
      } else {
        setError(res.data.message || 'Failed to fetch administrator statistics');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error loading admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Loading AgroConnect Admin Console..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto my-12 p-6 bg-red-50 border border-red-200 rounded-2xl text-center">
        <p className="text-sm font-semibold text-red-700">{error}</p>
        <button
          type="button"
          onClick={fetchDashboardStats}
          className="mt-4 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Title Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
            <FiShield />
            <span>Administrative Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            AgroConnect Platform Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Supervise farm records, user registrations, and agricultural procurement logistics
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/crops"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
          >
            <FiLayers /> Manage Crops
          </Link>
          <Link
            to="/admin/requests"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition border border-white/20 flex items-center gap-1.5"
          >
            <FiClipboard /> Manage Requests
          </Link>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase">Total Users</span>
            <FiUsers className="text-lg text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">{stats?.totalUsers || 0}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Registered farmers & buyers</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase">Active Crops</span>
            <FiLayers className="text-lg text-teal-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">{stats?.totalCrops || 0}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Lots in marketplace</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase">Total Requests</span>
            <FiClipboard className="text-lg text-amber-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">{stats?.totalRequests || 0}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">{stats?.pendingRequests || 0} pending review</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase">Deals Completed</span>
            <FiCheckCircle className="text-lg text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">{stats?.completedRequests || 0}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Dispatched & settled</span>
        </div>

        <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 shadow-sm col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-emerald-800 mb-2">
            <span className="text-xs font-bold uppercase">Trade Volume</span>
            <FiTrendingUp className="text-lg text-emerald-700" />
          </div>
          <p className="text-2xl font-black text-emerald-950">
            ₹{(stats?.totalTradeValue || 0).toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-emerald-700 mt-1 block">Gross booked value</span>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/admin/crops"
          className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl">
              🌾
            </div>
            <div>
              <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Manage Crop Catalog
              </h3>
              <p className="text-xs text-slate-500">Create, edit, delete & adjust stock</p>
            </div>
          </div>
          <FiArrowRight className="text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          to="/admin/requests"
          className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center text-xl">
              📦
            </div>
            <div>
              <h3 className="font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                Manage Procurement Requests
              </h3>
              <p className="text-xs text-slate-500">Approve, transition status & dispatch</p>
            </div>
          </div>
          <FiArrowRight className="text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          to="/admin/users"
          className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl">
              👥
            </div>
            <div>
              <h3 className="font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                Manage Registered Users
              </h3>
              <p className="text-xs text-slate-500">View accounts & toggle admin permissions</p>
            </div>
          </div>
          <FiArrowRight className="text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* Dual Activity Feed (Recent Requests and Recent Crops) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Requests */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">Recent Procurement Bookings</h3>
            <Link to="/admin/requests" className="text-xs font-bold text-emerald-700 hover:underline">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {stats?.recentRequests?.map((req) => (
              <div
                key={req._id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <p className="font-bold text-slate-800">{req.cropName}</p>
                  <p className="text-slate-500">
                    Buyer: {req.buyerName} • {req.requestedQuantity} {req.unit}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-700 block">
                    ₹{req.totalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
                    {req.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Crop Additions */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">Recently Added Produce Lots</h3>
            <Link to="/admin/crops" className="text-xs font-bold text-emerald-700 hover:underline">
              Manage All →
            </Link>
          </div>

          <div className="space-y-3">
            {stats?.recentCrops?.map((crop) => (
              <div
                key={crop._id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <p className="font-bold text-slate-800">{crop.name}</p>
                  <p className="text-slate-500">
                    {crop.location} • {crop.quantity} {crop.unit} available
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-800 block">
                    ₹{crop.pricePerUnit.toLocaleString('en-IN')} /{crop.unit}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-medium">
                    {crop.organicStatus ? 'Organic' : 'Standard'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;

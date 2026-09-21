import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiClipboard, 
  FiClock, 
  FiCheckCircle, 
  FiArrowRight, 
  FiEdit2, 
  FiSave 
} from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa';

const UserDashboard = () => {
  const { user, updateUserData } = useAuth();
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Profile Edit State
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }

    const fetchStats = async () => {
      try {
        const res = await userService.getStats();
        if (res.data && res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching user stats:', err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setUpdateSuccess('');
    setUpdateError('');

    try {
      const res = await userService.updateProfile(formData);
      if (res.data && res.data.success) {
        updateUserData(res.data.data);
        setUpdateSuccess('Profile details updated successfully!');
        setEditing(false);
      } else {
        setUpdateError(res.data.message || 'Failed to update profile');
      }
    } catch (err) {
      setUpdateError(err.response?.data?.message || err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
            <FaLeaf />
            <span>Kisan & Buyer Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 mt-1">
            Manage your crop procurement requests, regional farm details, and trade activity.
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <Link
            to="/my-requests"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
          >
            <FiClipboard /> My Requests
          </Link>
          <Link
            to="/crops"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition border border-white/20 flex items-center gap-1.5"
          >
            Browse Crops <FiArrowRight />
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
          Procurement Activity Summary
        </h2>
        {loadingStats ? (
          <LoadingSpinner text="Loading trade statistics..." />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-400 font-medium block">Total Requests</span>
              <p className="text-3xl font-black text-slate-900 mt-1">
                {stats?.totalRequests || 0}
              </p>
              <span className="text-[11px] text-slate-500 mt-1 block">Lifetime orders placed</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-amber-200 bg-amber-50/40 shadow-sm">
              <span className="text-xs text-amber-700 font-semibold block">Pending Approval</span>
              <p className="text-3xl font-black text-amber-900 mt-1">
                {stats?.pendingRequests || 0}
              </p>
              <span className="text-[11px] text-amber-600 mt-1 block">Awaiting farmer review</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-teal-200 bg-teal-50/40 shadow-sm">
              <span className="text-xs text-teal-700 font-semibold block">Active / In Transit</span>
              <p className="text-3xl font-black text-teal-900 mt-1">
                {stats?.activeRequests || 0}
              </p>
              <span className="text-[11px] text-teal-600 mt-1 block">En route or approved</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-emerald-200 bg-emerald-50/40 shadow-sm">
              <span className="text-xs text-emerald-700 font-semibold block">Completed Deals</span>
              <p className="text-3xl font-black text-emerald-900 mt-1">
                {stats?.completedRequests || 0}
              </p>
              <span className="text-[11px] text-emerald-600 mt-1 block">Delivered & verified</span>
            </div>
          </div>
        )}
      </div>

      {/* User Profile and Details Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Personal & Farm Profile</h2>
            <p className="text-xs text-slate-500">Contact information used on crop requests and mandi dispatches</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditing(!editing);
              setUpdateSuccess('');
              setUpdateError('');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 transition text-slate-700"
          >
            <FiEdit2 /> {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {updateSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium flex items-center gap-2">
            <FiCheckCircle className="text-emerald-600" />
            <span>{updateSuccess}</span>
          </div>
        )}

        {updateError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
            {updateError}
          </div>
        )}

        {!editing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <FiUser className="text-lg" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">Registered Name</span>
                <span className="font-bold text-slate-800">{user?.name}</span>
                <span className="text-[10px] ml-2 px-2 py-0.5 rounded bg-slate-100 text-slate-600 capitalize">
                  {user?.role}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <FiMail className="text-lg" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">Email Address</span>
                <span className="font-bold text-slate-800">{user?.email}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <FiPhone className="text-lg" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">Contact Phone</span>
                <span className="font-bold text-slate-800">{user?.phone || 'Not provided'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <FiMapPin className="text-lg" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">Farm / Dispatch Address</span>
                <span className="font-bold text-slate-800">{user?.address || 'Not provided'}</span>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Contact Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Farm / Mandi Location Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl flex items-center gap-1.5 shadow transition disabled:opacity-50"
              >
                <FiSave /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
  );
};

export default UserDashboard;

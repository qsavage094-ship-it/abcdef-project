import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiUsers, FiSearch, FiShield, FiUser, FiTrash2, FiCheckCircle } from 'react-icons/fi';

const ManageUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [successBanner, setSuccessBanner] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers();
      if (res.data && res.data.success) {
        setUsers(res.data.data);
      } else {
        setError(res.data.message || 'Failed to fetch registered users');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error fetching user directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Change role of this account to "${newRole}"?`)) {
      return;
    }

    try {
      const res = await adminService.updateUserRole(userId, newRole);
      if (res.data && res.data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
        setSuccessBanner(`User role updated to ${newRole}`);
        setTimeout(() => setSuccessBanner(''), 4000);
      } else {
        alert(res.data.message || 'Failed to update user role');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating role');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (userId === currentUser?._id) {
      alert('You cannot delete your own active administrator account.');
      return;
    }

    if (!window.confirm(`Are you sure you want to remove user "${userName}" from the platform?`)) {
      return;
    }

    try {
      const res = await adminService.deleteUser(userId);
      if (res.data && res.data.success) {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
        setSuccessBanner(`User "${userName}" was removed successfully.`);
        setTimeout(() => setSuccessBanner(''), 4000);
      } else {
        alert(res.data.message || 'Failed to delete user');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting user');
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.address && u.address.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
          <FiUsers />
          <span>Platform Accounts</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Manage Registered Users
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          View all registered farmers, commercial buyers, and assign administrative permissions
        </p>
      </div>

      {/* Success Notification */}
      {successBanner && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in">
          <FiCheckCircle className="text-emerald-600 text-base shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or city..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium hidden sm:block">
          Total Users: <strong className="text-slate-800">{filteredUsers.length}</strong>
        </span>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner text="Fetching user accounts..." />
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
                  <th className="px-5 py-3.5">User</th>
                  <th className="px-4 py-3.5">Contact Phone</th>
                  <th className="px-4 py-3.5">Address / Region</th>
                  <th className="px-4 py-3.5">Role</th>
                  <th className="px-4 py-3.5">Joined Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-400">
                      No user accounts found matching "{search}".
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                            {u.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{u.name}</span>
                            <span className="text-[11px] text-slate-400">{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-700 font-medium">
                        {u.phone || 'N/A'}
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 max-w-xs truncate">
                        {u.address || 'N/A'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {u.role === 'admin' ? 'Administrator' : 'Farmer / User'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-2">
                        {u._id !== currentUser?._id && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleRoleToggle(u._id, u.role)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                            >
                              Toggle Role
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u._id, u.name)}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                              title="Delete user"
                            >
                              <FiTrash2 />
                            </button>
                          </>
                        )}
                        {u._id === currentUser?._id && (
                          <span className="text-[11px] text-slate-400 italic">Current Session</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageUsers;

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('agro_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired, optionally clear state or handle redirect
      if (localStorage.getItem('agro_token')) {
        console.warn('Session expired or unauthorized request');
      }
    }
    return Promise.reject(error);
  }
);

// Helper service functions
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me')
};

export const cropService = {
  getAll: (params) => api.get('/crops', { params }),
  getFeatured: () => api.get('/crops/featured'),
  getById: (id) => api.get(`/crops/${id}`),
  create: (cropData) => api.post('/crops', cropData),
  update: (id, cropData) => api.put(`/crops/${id}`, cropData),
  delete: (id) => api.delete(`/crops/${id}`)
};

export const requestService = {
  create: (requestData) => api.post('/requests', requestData),
  getMyRequests: () => api.get('/requests/my'),
  getById: (id) => api.get(`/requests/${id}`),
  cancel: (id) => api.put(`/requests/${id}/cancel`),
  updateStatus: (id, status) => api.put(`/requests/${id}/status`, { status })
};

export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getStats: () => api.get('/users/stats')
};

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getAllRequests: (params) => api.get('/admin/requests', { params })
};

export default api;

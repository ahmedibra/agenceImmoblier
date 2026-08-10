// frontend/src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://capboou.cluster100.hosting.ovh.net/backend/laravel/public/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Intercepteur pour le token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour normaliser les réponses
API.interceptors.response.use(
  (response) => {
    // S'assurer que la réponse a toujours une structure cohérente
    if (response.data && !response.data.hasOwnProperty('success')) {
      response.data.success = true;
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const fetchCsrfToken = async () => {
  try {
    await axios.get('http://capboou.cluster100.hosting.ovh.net/backend/laravel/public', {
      withCredentials: true,
    });
  } catch (error) {
    console.error('Erreur CSRF:', error);
  }
};

export const auth = {
  register: (data) => API.post('/register', data),
  login: (data) => API.post('/login', data),
  logout: () => API.post('/logout'),
  getUser: () => API.get('/user'),
  updateProfile: (data) => API.put('/user/profile', data),
  updatePassword: (data) => API.put('/user/password', data),
  getAllUsers: () => API.get('/admin/users'),
  updateUserRole: (id, data) => API.put(`/admin/users/${id}/role`, data),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  forgotPassword: (email) => API.post('/forgot-password', { email }),
  resetPassword: (data) => API.post('/reset-password', data),

};

export const properties = {
  getAll: (params) => API.get('/properties', { params }),
  getOne: (id) => API.get(`/properties/${id}`),
  create: (data) => API.post('/properties', data),
  updateStatus: (id, data) => API.patch(`/properties/${id}/status`, data),

  update: (id, data) => API.put(`/properties/${id}`, data),
  delete: (id) => API.delete(`/properties/${id}`),
  myProperties: () => API.get('/my-properties'),

  
};

export const bookings = {
  getAll: () => API.get('/bookings'),
  getOne: (id) => API.get(`/bookings/${id}`),
  create: (data) => API.post('/bookings', data),
  cancel: (id) => API.put(`/bookings/${id}/cancel`),
  hostBookings: () => API.get('/host/bookings'),
  confirm: (id) => API.patch(`/host/bookings/${id}/confirm`),
  reject: (id) => API.patch(`/host/bookings/${id}/reject`),
};

export const favorites = {
  getAll: () => API.get('/favorites'),
  add: (propertyId) => API.post(`/favorites/${propertyId}`),
  remove: (propertyId) => API.delete(`/favorites/${propertyId}`),
};

export const reviews = {
  create: (data) => API.post('/reviews', data),
  update: (id, data) => API.put(`/reviews/${id}`, data),
  delete: (id) => API.delete(`/reviews/${id}`),
};

export default API;
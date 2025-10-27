import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  googleAuth: (data) => api.post('/auth/google', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

// Menu API
export const menuAPI = {
  getCategories: () => api.get('/menu/categories'),
  createCategory: (data) => api.post('/menu/categories', data),
  updateCategory: (id, data) => api.put(`/menu/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/menu/categories/${id}`),

  getMenuItems: (categoryId) => api.get('/menu/items', { params: { category: categoryId } }),
  getMenuItem: (id) => api.get(`/menu/items/${id}`),
  createMenuItem: (data) => api.post('/menu/items', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateMenuItem: (id, data) => api.put(`/menu/items/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteMenuItem: (id) => api.delete(`/menu/items/${id}`)
};

// Orders API
export const ordersAPI = {
  createOrder: (data) => api.post('/orders', data),
  getOrders: (status) => api.get('/orders', { params: { status } }),
  getOrder: (id) => api.get(`/orders/${id}`),
  trackOrder: (orderNumber) => api.get(`/orders/track/${orderNumber}`),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  getMyOrders: () => api.get('/orders/my/orders'),
  getOrderStats: () => api.get('/orders/stats')
};

// Support API
export const supportAPI = {
  sendMessage: (data) => api.post('/support/message', data)
};

export default api;

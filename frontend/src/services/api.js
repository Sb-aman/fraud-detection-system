import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import mockData from '../data/mockData';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const authAPI = {
  login: async (credentials) => {
    await delay(800);
    if (credentials.email && credentials.password.length >= 4) {
      const user = {
        id: 'USR-001',
        name: 'Admin User',
        email: credentials.email,
        role: 'Fraud Analyst',
        phone: '+91 98765 43210',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
      };
      const token = 'mock-jwt-token-' + Date.now();
      return { data: { user, token } };
    }
    throw { response: { data: { message: 'Invalid credentials' } } };
  },
};

export const dashboardAPI = {
  getStats: async () => {
    await delay();
    return { data: mockData.dashboardStats };
  },
  getActivityFeed: async () => {
    await delay();
    return { data: mockData.activityFeed };
  },
};

export const transactionsAPI = {
  getAll: async (params = {}) => {
    await delay();
    let data = [...mockData.transactions];

    if (params.search) {
      const q = params.search.toLowerCase();
      data = data.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.customerName.toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q)
      );
    }
    if (params.status && params.status !== 'all') {
      data = data.filter((t) => t.status === params.status);
    }
    if (params.riskMin) {
      data = data.filter((t) => t.riskScore >= Number(params.riskMin));
    }
    if (params.riskMax) {
      data = data.filter((t) => t.riskScore <= Number(params.riskMax));
    }
    if (params.country && params.country !== 'all') {
      data = data.filter((t) => t.country === params.country);
    }

    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const start = (page - 1) * limit;
    const paginated = data.slice(start, start + limit);

    return {
      data: paginated,
      meta: { total: data.length, page, limit, totalPages: Math.ceil(data.length / limit) },
    };
  },
  getById: async (id) => {
    await delay();
    const txn = mockData.transactions.find((t) => t.id === id);
    if (!txn) throw { response: { status: 404, data: { message: 'Transaction not found' } } };
    return { data: txn };
  },
};

export const alertsAPI = {
  getAll: async (params = {}) => {
    await delay();
    let data = [...mockData.alerts];
    if (params.severity && params.severity !== 'all') {
      data = data.filter((a) => a.severity === params.severity);
    }
    if (params.status && params.status !== 'all') {
      data = data.filter((a) => a.status === params.status);
    }
    return { data };
  },
  resolve: async (id) => {
    await delay();
    const alert = mockData.alerts.find((a) => a.id === id);
    if (alert) alert.status = 'resolved';
    return { data: alert };
  },
};

export const customersAPI = {
  getAll: async (params = {}) => {
    await delay();
    let data = [...mockData.customers];
    if (params.search) {
      const q = params.search.toLowerCase();
      data = data.filter(
        (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
      );
    }
    if (params.riskLevel && params.riskLevel !== 'all') {
      data = data.filter((c) => c.riskLevel === params.riskLevel);
    }
    return { data };
  },
};

export const analyticsAPI = {
  getAll: async () => {
    await delay();
    return { data: mockData.analytics };
  },
};

export default api;

import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import mockData from '../data/mockData';

// =====================================================
// AXIOS INSTANCE
// =====================================================

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// =====================================================
// REQUEST INTERCEPTOR
// JWT TOKEN AUTOMATICALLY SEND KAREGA
// =====================================================

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

// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

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


// =====================================================
// AUTH API
// REAL BACKEND
// =====================================================

export const authAPI = {

  // LOGIN
  login: async (credentials) => {
    const response = await api.post(
      '/auth/login',
      credentials
    );

    return response;
  },

  // REGISTER
  register: async (userData) => {
    const response = await api.post(
      '/auth/register',
      userData
    );

    return response;
  },

  // PROFILE
  getProfile: async () => {
    const response = await api.get(
      '/auth/profile'
    );

    return response;
  },
};


// =====================================================
// ACCOUNT API
// REAL BACKEND
// =====================================================

export const accountAPI = {

  // GET BALANCE
  getBalance: async () => {
    const response = await api.get(
      '/transactions/balance'
    );

    return response;
  },
};


// =====================================================
// TRANSACTIONS API
// REAL BACKEND
// =====================================================

export const transactionsAPI = {

  // SEND MONEY
  sendMoney: async ({
    receiverAccount,
    amount,
  }) => {

    const response = await api.post(
      '/transactions/send',
      {
        receiverAccount,
        amount,
      }
    );

    return response;
  },


  // TRANSACTION HISTORY
  getHistory: async () => {

    const response = await api.get(
      '/transactions/history'
    );

    return response;
  },
  getBalance: async() => {
    return api.get('/transactions/history');
  },


  // ---------------------------------------------------
  // TEMPORARY MOCK FUNCTIONS
  // Dashboard ke existing UI ko break hone se bachane ke liye
  // ---------------------------------------------------

  getAll: async (params = {}) => {

    let data = [...mockData.transactions];

    if (params.search) {

      const q = params.search.toLowerCase();

      data = data.filter(
        (t) =>
          t.id?.toLowerCase().includes(q) ||
          t.customerName?.toLowerCase().includes(q) ||
          t.location?.toLowerCase().includes(q)
      );
    }

    if (params.status && params.status !== 'all') {

      data = data.filter(
        (t) => t.status === params.status
      );
    }

    if (params.riskMin) {

      data = data.filter(
        (t) => t.riskScore >= Number(params.riskMin)
      );
    }

    if (params.riskMax) {

      data = data.filter(
        (t) => t.riskScore <= Number(params.riskMax)
      );
    }

    if (params.country && params.country !== 'all') {

      data = data.filter(
        (t) => t.country === params.country
      );
    }

    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;

    const start = (page - 1) * limit;

    const paginated = data.slice(
      start,
      start + limit
    );

    return {
      data: paginated,
      meta: {
        total: data.length,
        page,
        limit,
        totalPages: Math.ceil(
          data.length / limit
        ),
      },
    };
  },


  getById: async (id) => {

    const txn = mockData.transactions.find(
      (t) => t.id === id
    );

    if (!txn) {

      throw {
        response: {
          status: 404,
          data: {
            message: 'Transaction not found',
          },
        },
      };
    }

    return {
      data: txn,
    };
  },
};


// =====================================================
// DASHBOARD API
// CURRENTLY MOCK
// BAAD ME REAL BACKEND SE CONNECT KARENGE
// =====================================================

export const dashboardAPI = {

  getStats: async () => {

    return {
      data: mockData.dashboardStats,
    };
  },


  getActivityFeed: async () => {

    return {
      data: mockData.activityFeed,
    };
  },
};


// =====================================================
// FRAUD ALERTS API
// CURRENTLY MOCK
// =====================================================

export const alertsAPI = {

  getAll: async (params = {}) => {

    let data = [...mockData.alerts];

    if (
      params.severity &&
      params.severity !== 'all'
    ) {

      data = data.filter(
        (a) => a.severity === params.severity
      );
    }

    if (
      params.status &&
      params.status !== 'all'
    ) {

      data = data.filter(
        (a) => a.status === params.status
      );
    }

    return {
      data,
    };
  },


  resolve: async (id) => {

    const alert = mockData.alerts.find(
      (a) => a.id === id
    );

    if (alert) {
      alert.status = 'resolved';
    }

    return {
      data: alert,
    };
  },
};


// =====================================================
// CUSTOMERS API
// CURRENTLY MOCK
// =====================================================

export const customersAPI = {

  getAll: async (params = {}) => {

    let data = [...mockData.customers];

    if (params.search) {

      const q = params.search.toLowerCase();

      data = data.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
      );
    }

    if (
      params.riskLevel &&
      params.riskLevel !== 'all'
    ) {

      data = data.filter(
        (c) =>
          c.riskLevel === params.riskLevel
      );
    }

    return {
      data,
    };
  },
};


// =====================================================
// ANALYTICS API
// CURRENTLY MOCK
// =====================================================

export const analyticsAPI = {

  getAll: async () => {

    return {
      data: mockData.analytics,
    };
  },
};


// =====================================================
// DEFAULT EXPORT
// =====================================================

export default api;
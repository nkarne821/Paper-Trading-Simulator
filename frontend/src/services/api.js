import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/password', data),
  deleteAccount: () => api.delete('/auth/delete-account'),
};

export const stockAPI = {
  getQuote: (symbol) => api.get(`/stocks/quote/${symbol}`),
  search: (query) => api.get(`/stocks/search?query=${query}`),
  getMarketOverview: () => api.get('/stocks/market-overview'),
  getAllStocks: () => api.get('/stocks/all'),
};

export const portfolioAPI = {
  getPortfolio: () => api.get('/portfolio'),
};

export const tradingAPI = {
  buy: (data) => api.post('/trading/buy', data),
  sell: (data) => api.post('/trading/sell', data),
  getTransactions: () => api.get('/trading/transactions'),
  getRecentTransactions: () => api.get('/trading/transactions/recent'),
};

export const watchlistAPI = {
  getWatchlist: () => api.get('/watchlist'),
  add: (data) => api.post('/watchlist/add', data),
  remove: (symbol) => api.delete(`/watchlist/remove/${symbol}`),
};

export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  getUnread: () => api.get('/notifications/unread'),
  getCount: () => api.get('/notifications/count'),
  markAllRead: () => api.put('/notifications/read-all'),
  markRead: (id) => api.put(`/notifications/read/${id}`),
};

export const learningAPI = {
  getAllArticles: () => api.get('/learning/articles'),
  getByCategory: (category) => api.get(`/learning/articles/category/${category}`),
  getFeatured: () => api.get('/learning/articles/featured'),
  getRecent: () => api.get('/learning/articles/recent'),
  getBySlug: (slug) => api.get(`/learning/articles/${slug}`),
};

export const dashboardAPI = {
  getDashboard: () => api.get('/dashboard'),
};

export default api;
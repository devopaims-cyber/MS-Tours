// Shared axios instance. Vite proxies /api → http://localhost:5000 in dev.

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: false,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT from localStorage to every request.
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('mst_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {
    /* localStorage may be unavailable in some browsers */
  }
  return config;
});

// Normalize errors so callers always get { message, status }.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      'Something went wrong';
    return Promise.reject({ status, message, raw: err });
  }
);

export default api;

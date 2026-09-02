// Shared axios instance. In dev, Vite's proxy forwards /api → API server
// (port comes from VITE_API_URL, see vite.config.js). In prod, set
// VITE_API_URL to the full API origin (e.g. https://api.example.com/api).

import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
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

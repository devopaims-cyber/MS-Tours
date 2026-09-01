import api from './axios';

export const listPackages = (params = {}) =>
  api.get('/packages', { params }).then((r) => r.data);
export const getFeaturedPackages = () => api.get('/packages/featured').then((r) => r.data);
export const searchPackages = (params = {}) =>
  api.get('/packages/search', { params }).then((r) => r.data);
export const getPackage = (id) => api.get(`/packages/${id}`).then((r) => r.data);

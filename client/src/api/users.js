import api from './axios';

export const getProfile = () => api.get('/users/profile').then((r) => r.data);
export const updateProfile = (payload) => api.put('/users/profile', payload).then((r) => r.data);
export const getFavorites = () => api.get('/users/favorites').then((r) => r.data);
export const addFavorite = (packageId) =>
  api.post('/users/favorites', { packageId }).then((r) => r.data);
export const removeFavorite = (packageId) =>
  api.delete(`/users/favorites/${packageId}`).then((r) => r.data);

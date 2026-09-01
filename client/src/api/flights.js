import api from './axios';

export const searchFlights = (params = {}) =>
  api.get('/flights/search', { params }).then((r) => r.data);
export const getFlight = (id) => api.get(`/flights/${id}`).then((r) => r.data);

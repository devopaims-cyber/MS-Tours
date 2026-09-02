import api from './axios';

export const getTravelportStatus = () =>
  api.get('/travelport/status').then((r) => r.data);

export const searchLive = (params = {}) =>
  api.post('/travelport/search', params).then((r) => r.data);

export const createPnr = (payload = {}) =>
  api.post('/travelport/pnr', payload).then((r) => r.data);

export const getPnr = (locator, params = {}) =>
  api.get(`/travelport/pnr/${encodeURIComponent(locator)}`, { params }).then((r) => r.data);

export const cancelPnr = (locator) =>
  api.delete(`/travelport/pnr/${encodeURIComponent(locator)}`).then((r) => r.data);

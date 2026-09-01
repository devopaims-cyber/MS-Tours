import api from './axios';

export const listHotels = (params = {}) => api.get('/hotels', { params }).then((r) => r.data);
export const searchHotels = (params = {}) =>
  api.get('/hotels/search', { params }).then((r) => r.data);
export const getHotel = (id) => api.get(`/hotels/${id}`).then((r) => r.data);

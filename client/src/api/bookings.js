import api from './axios';

export const createBooking = (payload) => api.post('/bookings', payload).then((r) => r.data);
export const listBookings = () => api.get('/bookings').then((r) => r.data);
export const getBooking = (id) => api.get(`/bookings/${id}`).then((r) => r.data);
export const cancelBooking = (id) => api.patch(`/bookings/${id}/cancel`).then((r) => r.data);

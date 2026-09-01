import api from './axios';

export const processPayment = (payload) =>
  api.post('/payments/process', payload).then((r) => r.data);

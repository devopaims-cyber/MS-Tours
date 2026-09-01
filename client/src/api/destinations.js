import api from './axios';

export const listDestinations = () => api.get('/destinations').then((r) => r.data);
export const fetchDestinations = listDestinations;
export const getDestination = (id) => api.get(`/destinations/${id}`).then((r) => r.data);

import api from './axios';

export const fetchPackageReviews = (packageId) =>
  api.get(`/reviews/package/${packageId}`).then((r) => r.data);
export const fetchHotelReviews = (hotelId) =>
  api.get(`/reviews/hotel/${hotelId}`).then((r) => r.data);
export const listPackageReviews = fetchPackageReviews;
export const listHotelReviews = fetchHotelReviews;
export const createReview = (payload) => api.post('/reviews', payload).then((r) => r.data);

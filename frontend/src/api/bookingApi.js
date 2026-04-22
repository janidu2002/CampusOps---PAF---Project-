import axios from './axios';

export const bookingApi = {
  getAll: (params) => axios.get('/bookings', { params }),
  getById: (id) => axios.get(`/bookings/${id}`),
  create: (data) => axios.post('/bookings', data),
  approve: (id, adminNote) => axios.patch(`/bookings/${id}/approve`, null, { params: { adminNote } }),
  reject: (id, rejectionReason) => axios.patch(`/bookings/${id}/reject`, null, { params: { rejectionReason } }),
  cancel: (id) => axios.patch(`/bookings/${id}/cancel`),
};

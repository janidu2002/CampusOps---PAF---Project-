import axios from './axios';

export const ticketApi = {
  getAll: (params) => axios.get('/tickets', { params }),
  getById: (id) => axios.get(`/tickets/${id}`),
  create: (formData) => axios.post('/tickets', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateStatus: (id, status, notes) => axios.patch(`/tickets/${id}/status`, null, { params: { status, notes } }),
  assign: (id, technicianId) => axios.patch(`/tickets/${id}/assign`, null, { params: { technicianId } }),
  delete: (id) => axios.delete(`/tickets/${id}`),
};

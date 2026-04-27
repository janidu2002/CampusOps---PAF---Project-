import axios from './axios';

export const commentApi = {
  getAll: (ticketId) => axios.get(`/tickets/${ticketId}/comments`),
  add: (ticketId, data) => axios.post(`/tickets/${ticketId}/comments`, data),
  update: (ticketId, id, data) => axios.put(`/tickets/${ticketId}/comments/${id}`, data),
  delete: (ticketId, id) => axios.delete(`/tickets/${ticketId}/comments/${id}`),
};


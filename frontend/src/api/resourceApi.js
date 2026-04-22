import axios from './axios';

export const resourceApi = {
  getAll: (params) => axios.get('/resources', { params }),
  getById: (id) => axios.get(`/resources/${id}`),
  create: (data) => axios.post('/resources', data),
  update: (id, data) => axios.put(`/resources/${id}`, data),
  delete: (id) => axios.delete(`/resources/${id}`),
};

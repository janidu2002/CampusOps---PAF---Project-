import axios from './axios';

export const notificationApi = {
  getAll: (params) => axios.get('/notifications', { params }),
  getUnreadCount: () => axios.get('/notifications/unread-count'),
  markAsRead: (id) => axios.patch(`/notifications/${id}/read`),
  markAllAsRead: () => axios.patch('/notifications/read-all'),
  delete: (id) => axios.delete(`/notifications/${id}`),
};

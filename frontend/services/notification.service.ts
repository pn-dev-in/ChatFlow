import api from './api';
import { ApiResponse, Notification } from '@/types';

export const notificationService = {
  async getNotifications() {
    const res = await api.get<ApiResponse<Notification[]>>('/notifications');
    return res.data.data;
  },

  async getUnreadCount() {
    const res = await api.get<ApiResponse<{ count: number }>>('/notifications/unread-count');
    return res.data.data.count;
  },

  async markAsRead(id: string) {
    await api.patch(`/notifications/${id}/read`);
  },

  async markAllAsRead() {
    await api.patch('/notifications/read-all');
  },
};

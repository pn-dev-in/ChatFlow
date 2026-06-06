import api from './api';
import { Analytics, ApiResponse, Group, User } from '@/types';

export const adminService = {
  async getUsers(page = 1) {
    const res = await api.get<ApiResponse<{ users: User[]; pagination: { total: number; pages: number } }>>('/admin/users', { params: { page } });
    return res.data.data;
  },

  async toggleUserActive(userId: string) {
    const res = await api.patch<ApiResponse<User>>(`/admin/users/${userId}/toggle-active`);
    return res.data.data;
  },

  async getGroups(page = 1) {
    const res = await api.get<ApiResponse<{ groups: Group[]; pagination: { total: number } }>>('/admin/groups', { params: { page } });
    return res.data.data;
  },

  async getAnalytics() {
    const res = await api.get<ApiResponse<Analytics>>('/admin/analytics');
    return res.data.data;
  },

  async getAuditLogs() {
    const res = await api.get<ApiResponse<unknown[]>>('/admin/audit-logs');
    return res.data.data;
  },
};

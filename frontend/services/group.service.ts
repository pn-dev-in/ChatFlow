import api from './api';
import { ApiResponse, Group } from '@/types';

export const groupService = {
  async createGroup(data: {
    name: string;
    description?: string;
    isPrivate?: boolean;
    memberIds: string[];
  }) {
    const res = await api.post<ApiResponse<Group>>('/groups', data);
    return res.data.data;
  },

  async getGroup(groupId: string) {
    const res = await api.get<ApiResponse<Group>>(`/groups/${groupId}`);
    return res.data.data;
  },

  async updateGroup(groupId: string, data: Partial<Group>) {
    const res = await api.patch<ApiResponse<Group>>(`/groups/${groupId}`, data);
    return res.data.data;
  },

  async addMember(groupId: string, userId: string, role = 'MEMBER') {
    const res = await api.post(`/groups/${groupId}/members`, { userId, role });
    return res.data.data;
  },
};

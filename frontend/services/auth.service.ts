import api from './api';
import { ApiResponse, AuthResponse, User } from '@/types';

export const authService = {
  async register(data: {
    email: string;
    username: string;
    password: string;
    displayName?: string;
  }) {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return res.data.data;
  },

  async login(email: string, password: string) {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password });
    return res.data.data;
  },

  async logout() {
    await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
  },

  async getProfile() {
    const res = await api.get<ApiResponse<User>>('/users/me');
    return res.data.data;
  },
};

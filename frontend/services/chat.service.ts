import api from './api';
import { ApiResponse, Conversation, Message, User } from '@/types';

export const chatService = {
  async getConversations() {
    const res = await api.get<ApiResponse<Conversation[]>>('/conversations');
    return res.data.data;
  },

  async getConversation(id: string) {
    const res = await api.get<ApiResponse<Conversation>>(`/conversations/${id}`);
    return res.data.data;
  },

  async createDirectConversation(participantId: string) {
    const res = await api.post<ApiResponse<Conversation>>('/conversations/direct', { participantId });
    return res.data.data;
  },

  async markAsRead(conversationId: string) {
    const res = await api.post(`/conversations/${conversationId}/read`);
    return res.data.data;
  },

  async getMessages(conversationId: string, cursor?: string) {
    const res = await api.get<ApiResponse<Message[]>>(`/messages/${conversationId}`, {
      params: { cursor, limit: 50 },
    });
    return res.data.data;
  },

  async sendMessage(conversationId: string, data: { content?: string; type?: string; replyToId?: string }) {
    const res = await api.post<ApiResponse<Message>>(`/messages/${conversationId}`, data);
    return res.data.data;
  },

  async editMessage(messageId: string, content: string) {
    const res = await api.patch<ApiResponse<Message>>(`/messages/${messageId}`, { content });
    return res.data.data;
  },

  async deleteMessage(messageId: string, deleteForAll = false) {
    const res = await api.delete<ApiResponse<Message>>(`/messages/${messageId}`, {
      params: { deleteForAll },
    });
    return res.data.data;
  },

  async addReaction(messageId: string, emoji: string) {
    const res = await api.post(`/messages/${messageId}/reactions`, { emoji });
    return res.data.data;
  },

  async searchMessages(query: string, conversationId?: string) {
    const res = await api.get<ApiResponse<Message[]>>('/messages/search', {
      params: { q: query, conversationId },
    });
    return res.data.data;
  },

  async searchUsers(query: string) {
    const res = await api.get<ApiResponse<User[]>>('/users/search', { params: { q: query } });
    return res.data.data;
  },
};

import api from './api';
import { AiConversation, AiMessage, ApiResponse } from '@/types';

export const aiService = {
  async getConversations() {
    const res = await api.get<ApiResponse<AiConversation[]>>('/ai/conversations');
    return res.data.data;
  },

  async createConversation(title?: string) {
    const res = await api.post<ApiResponse<AiConversation>>('/ai/conversations', { title });
    return res.data.data;
  },

  async getConversation(id: string) {
    const res = await api.get<ApiResponse<AiConversation>>(`/ai/conversations/${id}`);
    return res.data.data;
  },

  async sendMessage(conversationId: string, content: string) {
    const res = await api.post<ApiResponse<AiMessage>>(`/ai/conversations/${conversationId}/messages`, { content });
    return res.data.data;
  },

  async generateReply(text: string) {
    const res = await api.post<ApiResponse<{ reply: string }>>('/ai/reply', { text });
    return res.data.data.reply;
  },

  async summarize(conversationId: string) {
    const res = await api.post<ApiResponse<{ summary: string }>>('/ai/summarize', { conversationId });
    return res.data.data.summary;
  },

  async translate(text: string, targetLanguage: string) {
    const res = await api.post<ApiResponse<{ translation: string }>>('/ai/translate', { text, targetLanguage });
    return res.data.data.translation;
  },

  async correctGrammar(text: string) {
    const res = await api.post<ApiResponse<{ corrected: string }>>('/ai/grammar', { text });
    return res.data.data.corrected;
  },

  async getSuggestions(text: string) {
    const res = await api.post<ApiResponse<{ suggestions: string[] }>>('/ai/suggestions', { text });
    return res.data.data.suggestions;
  },
};

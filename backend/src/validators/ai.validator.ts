import { z } from 'zod';

export const createAiConversationSchema = z.object({
  title: z.string().max(100).optional(),
});

export const sendAiMessageSchema = z.object({
  content: z.string().min(1).max(10000),
});

export const aiActionSchema = z.object({
  conversationId: z.string().cuid().optional(),
  text: z.string().min(1).max(10000),
  targetLanguage: z.string().max(10).optional(),
});

export const aiConversationIdSchema = z.object({
  aiConversationId: z.string().cuid(),
});

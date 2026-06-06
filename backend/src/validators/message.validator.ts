import { z } from 'zod';

export const sendMessageSchema = z.object({
  content: z.string().max(10000).optional(),
  type: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT', 'SYSTEM']).default('TEXT'),
  replyToId: z.string().cuid().optional(),
});

export const editMessageSchema = z.object({
  content: z.string().min(1).max(10000),
});

export const messageIdSchema = z.object({
  messageId: z.string().cuid(),
});

export const searchMessagesSchema = z.object({
  q: z.string().min(1).max(200),
  conversationId: z.string().cuid().optional(),
  limit: z.coerce.number().min(1).max(50).default(20),
});

export const reactionSchema = z.object({
  emoji: z.string().min(1).max(10),
});

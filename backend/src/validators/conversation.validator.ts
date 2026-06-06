import { z } from 'zod';

export const createDirectConversationSchema = z.object({
  participantId: z.string().cuid(),
});

export const conversationIdSchema = z.object({
  conversationId: z.string().cuid(),
});

export const paginationSchema = z.object({
  cursor: z.string().cuid().optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
});

import { z } from 'zod';

export const sendFriendRequestSchema = z.object({
  receiverId: z.string().cuid(),
});

export const friendRequestIdSchema = z.object({
  requestId: z.string().cuid(),
});

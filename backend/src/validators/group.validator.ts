import { z } from 'zod';

export const createGroupSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  isPrivate: z.boolean().default(false),
  memberIds: z.array(z.string().cuid()).min(1).max(100),
});

export const updateGroupSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional().nullable(),
  isPrivate: z.boolean().optional(),
});

export const groupIdSchema = z.object({
  groupId: z.string().cuid(),
});

export const addMemberSchema = z.object({
  userId: z.string().cuid(),
  role: z.enum(['ADMIN', 'MEMBER']).default('MEMBER'),
});

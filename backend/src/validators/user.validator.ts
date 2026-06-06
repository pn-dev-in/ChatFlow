import { z } from 'zod';

export const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  timezone: z.string().max(50).optional(),
  darkMode: z.boolean().optional(),
});

export const searchUsersSchema = z.object({
  q: z.string().min(1).max(100),
  limit: z.coerce.number().min(1).max(50).default(20),
});

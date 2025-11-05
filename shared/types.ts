import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  password: z.string(),
  telegram_chat_id: z.string().optional(),
  telegram_token: z.string().optional(),
  telegramotp: z.boolean().optional(),
  twoFactorSecret: z.string().optional(),
  twoFactorEnabled: z.boolean().optional(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
  newsLatters: z.boolean().optional(),
  autoReply: z.boolean().optional(),
  theme: z.string().optional(),
  language: z.string().optional(),
  phone: z.string().optional(),
  profileImage: z.string().optional(),
  bio: z.string().optional(),
  emailVerified: z.boolean().optional(),
  phoneVerified: z.boolean().optional(),
  lastLogin: z.date().optional(),
  loginAttempts: z.number().optional(),
  status: z.string().optional(),
  resetToken: z.string().optional(),
  resetTokenExpiry: z.date().optional(),
  deletedAt: z.date().optional(),
});

export type User = z.infer<typeof UserSchema>;
// server/types.ts

// Shape that mirrors your DB columns exactly (camelCase in code, map in storage.ts)
export interface DbUser {
  id: string;
  name: string;
  email: string;
  password: string;

  // Telegram
  telegramChatId: string | null;
  telegramToken: string | null;
  telegramotp: boolean | null;          // true/false or null if not configured

  // 2FA
  twoFactorSecret: string | null;
  twoFactorEnabled: boolean;            // pick true default; adjust if needed

  // Activity
  isActive: boolean;
  lastActive: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// What you attach to req.user (avoid huge payload; keep what you actually use)
export interface SessionUser {
  id: string;
  email: string;
  name: string;

  telegramotp?: boolean | null;
  telegramToken?: string | null;
  telegramChatId?: string | null;

  twoFactorEnabled?: boolean;
  twoFactorSecret?: string | null;
}

// Payloads for storage operations
export interface InsertUser {
  name: string;
  email: string;
  password: string;
  twoFactorSecret?: string | null;
  twoFactorEnabled?: boolean;
  telegramToken?: string | null;
  telegramChatId?: string | null;
  telegramotp?: boolean | null;
}

export interface UpdateUser {
  name?: string;
  email?: string;
  password?: string;
  twoFactorSecret?: string | null;
  twoFactorEnabled?: boolean;
  telegramToken?: string | null;
  telegramChatId?: string | null;
  telegramotp?: boolean | null;
  isActive?: boolean;
  lastActive?: Date | null;
}

// Narrowing helpers (optional but handy)
export interface AppError {
  message: string;
}
export function isAppError(error: unknown): error is AppError {
  return typeof error === "object" && error !== null && "message" in error;
}
export function isSessionUser(u: any): u is SessionUser {
  return u && typeof u === "object" && typeof u.id === "string" && typeof u.email === "string";
}

/**
 * SSvSS Server-side In-Memory OTP Store
 * Uses globalThis singleton pattern to persist active OTPs across API routes & dev reloads.
 */

export interface StoredOtp {
  code: string;
  expiry: number;
}

const globalForOtp = globalThis as unknown as {
  ssvssOtpStore?: Map<string, StoredOtp>;
};

export const otpStore: Map<string, StoredOtp> =
  globalForOtp.ssvssOtpStore ?? new Map<string, StoredOtp>();

if (process.env.NODE_ENV !== "production") {
  globalForOtp.ssvssOtpStore = otpStore;
}

export function saveServerOtp(email: string, code: string, validityMinutes = 5): void {
  const cleanEmail = email.trim().toLowerCase();
  const expiry = Date.now() + validityMinutes * 60 * 1000;
  otpStore.set(cleanEmail, { code, expiry });
}

export function getServerOtp(email: string): StoredOtp | undefined {
  const cleanEmail = email.trim().toLowerCase();
  return otpStore.get(cleanEmail);
}

export function clearServerOtp(email: string): void {
  const cleanEmail = email.trim().toLowerCase();
  otpStore.delete(cleanEmail);
}

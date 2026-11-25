/**
 * SSvSS Server-side OTP System
 * Supports both HMAC-signed stateless tokens (Vercel Serverless safe) and in-memory fallback.
 */

import crypto from "crypto";

export interface StoredOtp {
  code: string;
  expiry: number;
}

const OTP_SECRET =
  process.env.OTP_SECRET ||
  process.env.NEXT_PUBLIC_ADMIN_PIN ||
  "dharmavaram_silk_otp_secret_key_2027";

export function createOtpToken(email: string, code: string, validityMinutes = 5): { token: string; expiry: number } {
  const cleanEmail = email.trim().toLowerCase();
  const expiry = Date.now() + validityMinutes * 60 * 1000;
  const payload = `${cleanEmail}:${code}:${expiry}`;
  const signature = crypto.createHmac("sha256", OTP_SECRET).update(payload).digest("hex");
  const token = Buffer.from(`${payload}.${signature}`).toString("base64url");
  return { token, expiry };
}

export function verifyOtpToken(
  email: string,
  code: string,
  token: string
): { isValid: boolean; error?: string } {
  try {
    const raw = Buffer.from(token, "base64url").toString("utf8");
    const lastDot = raw.lastIndexOf(".");
    if (lastDot === -1) {
      return { isValid: false, error: "Invalid verification token format." };
    }

    const payload = raw.substring(0, lastDot);
    const signature = raw.substring(lastDot + 1);

    const expectedSignature = crypto.createHmac("sha256", OTP_SECRET).update(payload).digest("hex");
    if (signature !== expectedSignature) {
      return { isValid: false, error: "Invalid or tampered verification token." };
    }

    const [tokenEmail, tokenCode, expiryStr] = payload.split(":");
    if (tokenEmail !== email.trim().toLowerCase()) {
      return { isValid: false, error: "Verification token does not match this email address." };
    }

    const expiry = parseInt(expiryStr, 10);
    if (Date.now() > expiry) {
      return { isValid: false, error: "OTP has expired. Please request a new verification code." };
    }

    if (tokenCode !== code.trim()) {
      return { isValid: false, error: "Incorrect OTP code! Please enter the exact 6-digit code." };
    }

    return { isValid: true };
  } catch {
    return { isValid: false, error: "Failed to verify OTP token." };
  }
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

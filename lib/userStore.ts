/**
 * Server-side User Registry (`app_users`) with multi-layer persistence:
 * 1. Supabase `app_users` table (if configured)
 * 2. Local JSON file `.data/users.json` + globalThis memory (for local Node.js)
 * 3. Signed HttpOnly cookie `ssvss_users_registry` (guarantees cross-container persistence on Vercel Serverless)
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import { normalizeEmail } from "@/lib/validation";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

const USER_COOKIE_NAME = "ssvss_users_registry";
const SECRET =
  process.env.OTP_SECRET ||
  process.env.NEXT_PUBLIC_ADMIN_PIN ||
  "dharmavaram_silk_otp_secret_key_2027";

const globalForUsers = globalThis as unknown as {
  ssvssAppUsers?: Map<string, AppUser>;
};

const memoryUsers: Map<string, AppUser> =
  globalForUsers.ssvssAppUsers ?? new Map<string, AppUser>();
globalForUsers.ssvssAppUsers = memoryUsers;

const DATA_DIR = path.join(process.cwd(), ".data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

function loadFromDisk(): AppUser[] {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const raw = fs.readFileSync(USERS_FILE, "utf8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // Ignore read-only filesystem errors on serverless
  }
  return [];
}

function saveToDisk(users: AppUser[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
  } catch {
    // Ignore read-only filesystem errors on serverless (Vercel)
  }
}

function signUsersList(users: AppUser[]): string {
  const json = JSON.stringify(users);
  const payload = Buffer.from(json, "utf8").toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

function parseUsersCookie(cookieVal: string | undefined): AppUser[] {
  if (!cookieVal) return [];
  try {
    const dotIdx = cookieVal.lastIndexOf(".");
    if (dotIdx === -1) return [];
    const payload = cookieVal.substring(0, dotIdx);
    const sig = cookieVal.substring(dotIdx + 1);
    const expectedSig = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
    if (sig !== expectedSig) return [];
    const json = Buffer.from(payload, "base64url").toString("utf8");
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function getCookieUsers(): Promise<AppUser[]> {
  try {
    const cookieStore = await cookies();
    const rawCookie = cookieStore.get(USER_COOKIE_NAME)?.value;
    return parseUsersCookie(rawCookie);
  } catch {
    return [];
  }
}

export async function findAppUserByEmail(rawEmail: string): Promise<AppUser | null> {
  const cleanEmail = normalizeEmail(rawEmail);
  if (!cleanEmail) return null;

  // 1. Check Supabase `app_users` if configured
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("app_users")
        .select("id, name, email, created_at")
        .eq("email", cleanEmail)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          name: data.name,
          email: data.email,
          createdAt: data.created_at || new Date().toISOString(),
        };
      }
    } catch (err) {
      console.warn("Supabase app_users lookup fallback:", err);
    }
  }

  // 2. Check in-memory store
  const memMatch = memoryUsers.get(cleanEmail);
  if (memMatch) return memMatch;

  // 3. Check local disk store
  const diskUsers = loadFromDisk();
  for (const u of diskUsers) {
    memoryUsers.set(normalizeEmail(u.email), u);
  }
  const diskMatch = diskUsers.find((u) => normalizeEmail(u.email) === cleanEmail);
  if (diskMatch) return diskMatch;

  // 4. Check signed cookie (essential for Vercel stateless serverless)
  const cookieUsers = await getCookieUsers();
  for (const u of cookieUsers) {
    memoryUsers.set(normalizeEmail(u.email), u);
  }
  const cookieMatch = cookieUsers.find((u) => normalizeEmail(u.email) === cleanEmail);
  if (cookieMatch) return cookieMatch;

  return null;
}

export async function createAppUser(
  name: string,
  rawEmail: string
): Promise<{ user: AppUser; alreadyExists: boolean; cookieValue: string }> {
  const cleanEmail = normalizeEmail(rawEmail);
  const cleanName = name.trim();

  const existing = await findAppUserByEmail(cleanEmail);
  const cookieUsers = await getCookieUsers();
  const diskUsers = loadFromDisk();

  // Merge all known users for cookie serialization
  const merged = new Map<string, AppUser>();
  for (const u of diskUsers) merged.set(normalizeEmail(u.email), u);
  for (const u of cookieUsers) merged.set(normalizeEmail(u.email), u);
  for (const [k, u] of memoryUsers.entries()) merged.set(k, u);

  if (existing) {
    merged.set(cleanEmail, existing);
    const list = Array.from(merged.values()).slice(-20);
    return {
      user: existing,
      alreadyExists: true,
      cookieValue: signUsersList(list),
    };
  }

  const newUser: AppUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: cleanName,
    email: cleanEmail,
    createdAt: new Date().toISOString(),
  };

  // 1. Insert into Supabase `app_users` if configured
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("app_users")
        .insert({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          created_at: newUser.createdAt,
        })
        .select()
        .single();

      if (!error && data) {
        newUser.id = data.id;
      }
    } catch (err) {
      console.warn("Supabase app_users insert fallback:", err);
    }
  }

  // 2. Persist in memory & local disk
  memoryUsers.set(cleanEmail, newUser);
  merged.set(cleanEmail, newUser);
  const allUsers = Array.from(merged.values());
  saveToDisk(allUsers);

  // Keep last 20 users in cookie to stay well within 4KB browser cookie limit
  const cookieValue = signUsersList(allUsers.slice(-20));

  return {
    user: newUser,
    alreadyExists: false,
    cookieValue,
  };
}

export const USER_REGISTRY_COOKIE = USER_COOKIE_NAME;

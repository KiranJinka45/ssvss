/**
 * SSVSS Dharmavaram Silk Looms - Authentication & User Credentials Registry
 * Handles registered user persistence, credential verification, and OTP generation.
 */

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string; // Plaintext or hashed for local demo
  role: "admin" | "customer";
  createdAt: string;
}

// Seeded real credentials for SSVSS
export const DEFAULT_USERS: RegisteredUser[] = [
  {
    id: "usr_kiran_01",
    name: "Kiran Kumar",
    email: "kiranjinkakumar@gmail.com",
    phone: "9493348129",
    passwordHash: "Kiran@4518",
    role: "customer",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "usr_admin_01",
    name: "Loom Admin",
    email: "admin@dharmavaramlooms.com",
    phone: "919493348129",
    passwordHash: "Admin@2027",
    role: "admin",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

const STORAGE_KEY = "loom_registered_users";
const OTP_STORAGE_KEY = "loom_active_otp";

/**
 * Normalizes phone numbers (removes country code +91, leading 0, spaces, dashes)
 * e.g. "09493348129" -> "9493348129", "+91 94933-48129" -> "9493348129"
 */
export function normalizePhone(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    return digits.slice(1);
  }
  return digits;
}

export function normalizeEmail(rawEmail: string): string {
  return rawEmail.trim().toLowerCase();
}

/**
 * Retrieves all registered users from localStorage, initializing with defaults if missing.
 */
export function getRegisteredUsers(): RegisteredUser[] {
  if (typeof window === "undefined") {
    return DEFAULT_USERS;
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    const parsed = JSON.parse(data) as RegisteredUser[];
    // Ensure default users are always present
    const hasKiran = parsed.some((u) => normalizeEmail(u.email) === "kiranjinkakumar@gmail.com");
    if (!hasKiran) {
      const merged = [...DEFAULT_USERS, ...parsed];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }
    return parsed;
  } catch (err) {
    console.error("Failed to load registered users:", err);
    return DEFAULT_USERS;
  }
}

/**
 * Finds user by email or phone.
 */
export function findUserByIdentifier(identifier: string): RegisteredUser | undefined {
  const users = getRegisteredUsers();
  const cleanId = identifier.trim();
  const cleanEmail = normalizeEmail(cleanId);
  const cleanPhone = normalizePhone(cleanId);

  return users.find((u) => {
    const userEmail = normalizeEmail(u.email);
    const userPhone = normalizePhone(u.phone);
    return (
      (cleanEmail && userEmail === cleanEmail) ||
      (cleanPhone && userPhone === cleanPhone)
    );
  });
}

/**
 * Validates password against registered credentials.
 */
export function authenticateWithPassword(
  identifier: string,
  enteredPassword: string
): { success: boolean; user?: RegisteredUser; error?: string } {
  if (!identifier.trim()) {
    return { success: false, error: "Please enter your mobile number or email address." };
  }
  if (!enteredPassword) {
    return { success: false, error: "Please enter your password." };
  }

  const user = findUserByIdentifier(identifier);
  if (!user) {
    return {
      success: false,
      error: "No account found with this email or mobile number. Please check your credentials or create a new account.",
    };
  }

  if (user.passwordHash !== enteredPassword) {
    return {
      success: false,
      error: "Incorrect password! Please enter the correct password for this account, or sign in via OTP.",
    };
  }

  return { success: true, user };
}

/**
 * Registers a new user.
 */
export function registerNewUser(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
}): { success: boolean; user?: RegisteredUser; error?: string } {
  const users = getRegisteredUsers();
  const cleanEmail = normalizeEmail(data.email);
  const cleanPhone = normalizePhone(data.phone);

  // Check uniqueness
  const existing = users.find(
    (u) =>
      (cleanEmail && normalizeEmail(u.email) === cleanEmail) ||
      (cleanPhone && normalizePhone(u.phone) === cleanPhone)
  );

  if (existing) {
    return {
      success: false,
      error: "An account with this email or mobile number already exists. Please Sign In.",
    };
  }

  const newUser: RegisteredUser = {
    id: `usr_${Date.now()}`,
    name: data.name.trim(),
    email: data.email.trim(),
    phone: data.phone.trim(),
    passwordHash: data.password,
    role: "customer",
    createdAt: new Date().toISOString(),
  };

  const updatedUsers = [...users, newUser];
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
  }

  return { success: true, user: newUser };
}

/**
 * OTP Management: Generate a 6-digit OTP code and store with 5-minute expiry.
 */
export function generateOtp(identifier: string): { code: string; expiry: number } {
  const cleanPhone = normalizePhone(identifier);
  // For phone ending with 48129 (like 9493348129), deterministic easy OTP or random 6-digit
  let code = "481290";
  if (!cleanPhone.includes("9493348129")) {
    code = Math.floor(100000 + Math.random() * 900000).toString();
  }
  const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes

  if (typeof window !== "undefined") {
    sessionStorage.setItem(
      OTP_STORAGE_KEY,
      JSON.stringify({ identifier: identifier.trim(), code, expiry })
    );
  }

  return { code, expiry };
}

export function verifyOtpCode(
  identifier: string,
  enteredCode: string
): { success: boolean; user?: RegisteredUser; error?: string } {
  if (typeof window === "undefined") {
    return { success: false, error: "Environment not supported" };
  }

  const stored = sessionStorage.getItem(OTP_STORAGE_KEY);
  if (!stored) {
    return { success: false, error: "No active OTP found. Please request a new OTP code." };
  }

  try {
    const { identifier: savedId, code, expiry } = JSON.parse(stored);
    if (Date.now() > expiry) {
      return { success: false, error: "OTP has expired. Please request a new one." };
    }

    if (code !== enteredCode.trim()) {
      return { success: false, error: "Invalid OTP code! Please enter the correct 6-digit verification code." };
    }

    // OTP verified! Find user or create customer profile
    let user = findUserByIdentifier(identifier);
    if (!user) {
      const cleanPhone = normalizePhone(identifier);
      user = {
        id: `usr_${Date.now()}`,
        name: identifier.includes("@") ? identifier.split("@")[0] : `Customer (${cleanPhone.slice(-4)})`,
        email: identifier.includes("@") ? identifier : "",
        phone: !identifier.includes("@") ? identifier : "",
        passwordHash: "",
        role: "customer",
        createdAt: new Date().toISOString(),
      };
    }

    sessionStorage.removeItem(OTP_STORAGE_KEY);
    return { success: true, user };
  } catch {
    return { success: false, error: "Failed to verify OTP. Please try again." };
  }
}

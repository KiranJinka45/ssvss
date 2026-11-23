/**
 * Strict Indian Mobile Number Validation Utility
 *
 * Implements TRAI (Telecom Regulatory Authority of India) & DoT standards:
 * 1. Must be exactly 10 numeric digits (after stripping country code +91 / 0 / spaces).
 * 2. Must start with valid Indian mobile network prefixes: 6, 7, 8, or 9.
 *    (Digits 0-5 are invalid for Indian mobile allocations: 1 is emergency/service, 2-4 are landline/unassigned).
 * 3. Must not be repetitive dummy numbers (e.g., 0000000000, 1111111111, 9999999999).
 * 4. Must not be obvious fake sequential numbers (e.g., 1234567890, 9876543210).
 */

export interface PhoneValidationResult {
  isValid: boolean;
  cleanPhone: string; // 10 digits
  formattedPhone: string; // e.g. "+91 98765 43210"
  error?: string;
}

export function validateIndianMobile(rawPhone?: string | null): PhoneValidationResult {
  if (!rawPhone || typeof rawPhone !== "string") {
    return {
      isValid: false,
      cleanPhone: "",
      formattedPhone: "",
      error: "Mobile number is required.",
    };
  }

  // Strip all non-digit characters
  let digits = rawPhone.replace(/\D/g, "");

  // Handle leading country code (+91) or STD trunk (0)
  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  if (digits.length === 0) {
    return {
      isValid: false,
      cleanPhone: "",
      formattedPhone: "",
      error: "Please enter your 10-digit mobile number.",
    };
  }

  if (digits.length < 10) {
    return {
      isValid: false,
      cleanPhone: digits,
      formattedPhone: digits,
      error: `Please enter all 10 digits (currently ${digits.length}/10).`,
    };
  }

  if (digits.length > 10) {
    return {
      isValid: false,
      cleanPhone: digits.slice(0, 10),
      formattedPhone: digits.slice(0, 10),
      error: "Mobile number must not exceed 10 digits.",
    };
  }

  // Strict check: First digit must be 6, 7, 8, or 9
  const firstDigit = digits.charAt(0);
  if (!["6", "7", "8", "9"].includes(firstDigit)) {
    return {
      isValid: false,
      cleanPhone: digits,
      formattedPhone: digits,
      error: `Invalid number: Indian mobile numbers must start with 6, 7, 8, or 9 (starts with '${firstDigit}').`,
    };
  }

  // Reject all identical digits (e.g. 1111111111, 2222222222, ..., 9999999999, 0000000000)
  if (/^(\d)\1{9}$/.test(digits)) {
    return {
      isValid: false,
      cleanPhone: digits,
      formattedPhone: digits,
      error: "Invalid number: Repeated dummy digits are not permitted.",
    };
  }

  // Reject obvious fake sequential numbers
  const invalidSequences = [
    "1234567890",
    "0123456789",
    "9876543210",
    "8901234567",
    "7890123456",
    "6789012345",
  ];
  if (invalidSequences.includes(digits)) {
    return {
      isValid: false,
      cleanPhone: digits,
      formattedPhone: digits,
      error: "Invalid number: Please enter a genuine working mobile number.",
    };
  }

  // Valid 10-digit Indian mobile
  const formatted = `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  return {
    isValid: true,
    cleanPhone: digits,
    formattedPhone: formatted,
  };
}

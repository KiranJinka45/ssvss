/**
 * Email normalization and smart domain typo detection.
 */

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

const DOMAIN_TYPOS: Record<string, string> = {
  "gmaill.com": "gmail.com",
  "gmal.com": "gmail.com",
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gnail.com": "gmail.com",
  "gimail.com": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.cm": "gmail.com",
  "gmail.con": "gmail.com",
  "gamil.com": "gmail.com",
  "yaho.com": "yahoo.com",
  "yahooo.com": "yahoo.com",
  "yhoo.com": "yahoo.com",
  "yahoo.co": "yahoo.com",
  "outlok.com": "outlook.com",
  "outllok.com": "outlook.com",
  "outlook.co": "outlook.com",
  "hotmal.com": "hotmail.com",
  "hotmial.com": "hotmail.com",
  "hotmai.com": "hotmail.com",
  "iclod.com": "icloud.com",
  "icoud.com": "icloud.com",
};

export interface EmailValidationResult {
  isValid: boolean;
  normalized: string;
  error?: string;
  suggestion?: string;
}

export function validateEmailWithTypoCheck(rawEmail: string): EmailValidationResult {
  const normalized = normalizeEmail(rawEmail);

  if (!normalized) {
    return {
      isValid: false,
      normalized,
      error: "Email address is required.",
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalized)) {
    return {
      isValid: false,
      normalized,
      error: "Please enter a valid email address (e.g. kiranjinkakumar@gmail.com).",
    };
  }

  const [localPart, domainPart] = normalized.split("@");
  if (domainPart && DOMAIN_TYPOS[domainPart]) {
    const correctedDomain = DOMAIN_TYPOS[domainPart];
    return {
      isValid: true,
      normalized,
      suggestion: `${localPart}@${correctedDomain}`,
    };
  }

  return {
    isValid: true,
    normalized,
  };
}

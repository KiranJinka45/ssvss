/**
 * Dharmavaram Silk Sarees — Production Merchant & Compliance Configuration
 * Single source of truth for payments, compliance, and contact details.
 */

export const MERCHANT_CONFIG = {
  BRAND_NAME: process.env.NEXT_PUBLIC_BRAND_NAME || "Dharmavaram Handloom Silk Looms",
  WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919493348129",
  UPI_ID: process.env.NEXT_PUBLIC_UPI_ID || "dharmavaramlooms@icici",
  UPI_PAYEE_NAME: process.env.NEXT_PUBLIC_UPI_PAYEE_NAME || "Sri Sathya Sai Handloom Weavers Guild",
  GSTIN: process.env.NEXT_PUBLIC_GSTIN || "37AAJCS8921M1ZX",
  SILK_MARK_ID: process.env.NEXT_PUBLIC_SILK_MARK_ID || "CSB/AP/DHM/2026/894",
  ORIGIN_LOCATION: "Dharmavaram, Sri Sathya Sai District, Andhra Pradesh - 515671",
  DISPATCH_TIMELINE: "Within 24 Hours via Insured Express Courier",
  ESTABLISHED_YEAR: 1974,
};

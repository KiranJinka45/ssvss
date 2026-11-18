/**
 * Dharmavaram Silk Sarees — WhatsApp Social Commerce Engine
 * Generates zero-leakage direct wa.me URLs for high-conversion social traffic.
 */

import { MERCHANT_CONFIG } from "@/lib/config";

export interface OrderWhatsAppParams {
  sku: string;
  title: string;
  price: number;
  selectedFinish?: string;
  customNotes?: string;
  phoneNumber?: string;
}

export interface LiveCallWhatsAppParams {
  customerName: string;
  customerPhone: string;
  sku?: string;
  productTitle?: string;
  price?: number;
  phoneNumber?: string;
}

export interface WholesaleWhatsAppParams {
  boutiqueName: string;
  contactPerson: string;
  city: string;
  gstin?: string;
  quantity: number;
  tierName: string;
  estimatedTotal: number;
  phoneNumber?: string;
}

/**
 * Format Indian phone number ensuring no spaces, dashes or plus signs
 */
export function cleanPhoneNumber(phone?: string): string {
  const target = phone || MERCHANT_CONFIG.WHATSAPP_NUMBER;
  const digits = target.replace(/\D/g, "");
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits;
}

/**
 * Clean and format 10-digit customer mobile
 */
export function formatCustomerPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2);
  }
  return digits;
}

/**
 * Generate Direct WhatsApp Checkout Link (0% Gateway Fee, Direct Current Account UPI)
 */
export function generateOrderWhatsAppUrl(params: OrderWhatsAppParams): string {
  const phone = cleanPhoneNumber(params.phoneNumber);
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(params.price);

  const finish = params.selectedFinish || "Standard Unstitched Blouse Piece";

  const messageLines = [
    `🙏 *Namaste ${MERCHANT_CONFIG.BRAND_NAME}!*`,
    ``,
    `I would like to order directly from your loom:`,
    `✦ *Product:* ${params.title}`,
    `✦ *SKU:* ${params.sku}`,
    `✦ *Direct Loom Price:* ${formattedPrice} (All-India Insured Shipping Included)`,
    `✦ *Finish Selected:* ${finish}`,
  ];

  if (params.customNotes) {
    messageLines.push(`✦ *Special Note:* ${params.customNotes}`);
  }

  messageLines.push(
    ``,
    `💳 *Payment Note:* Pay via Direct Business UPI (*${MERCHANT_CONFIG.UPI_ID}* - ${MERCHANT_CONFIG.UPI_PAYEE_NAME}) for 0% extra gateway charges & same-day insured dispatch from Dharmavaram.`,
    ``,
    `Please share your official Current Account UPI QR or Bank NEFT details so I can transfer and share my delivery address. Dhanyavadagalu!`
  );

  return `https://wa.me/${phone}?text=${encodeURIComponent(messageLines.join("\n"))}`;
}

/**
 * Generate WhatsApp Link for Instant Live Loom Video Call
 */
export function generateLiveCallWhatsAppUrl(params: LiveCallWhatsAppParams): string {
  const phone = cleanPhoneNumber(params.phoneNumber);
  const cleanCustomerPhone = formatCustomerPhone(params.customerPhone);

  const formattedPrice = params.price
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(params.price)
    : "";

  const sareeLine =
    params.sku && params.productTitle
      ? `${params.productTitle} (${params.sku}${formattedPrice ? ` - ${formattedPrice}` : ""})`
      : "General Dharmavaram Loom Showcase";

  const messageLines = [
    `Namaskaram! I want to start a Live Loom Video Call right now.`,
    ``,
    `• Name: ${params.customerName.trim()}`,
    `• Phone: +91 ${cleanCustomerPhone}`,
    `• Saree: ${sareeLine}`,
    ``,
    `Please accept my WhatsApp Video Call to show the zari & pallu in natural light!`
  ];

  return `https://wa.me/${phone}?text=${encodeURIComponent(messageLines.join("\n"))}`;
}

/**
 * Generate WhatsApp Link for B2B Boutique Wholesale Proforma
 */
export function generateWholesaleWhatsAppUrl(params: WholesaleWhatsAppParams): string {
  const phone = cleanPhoneNumber(params.phoneNumber);
  const formattedTotal = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(params.estimatedTotal);

  const messageLines = [
    `🏛️ *${MERCHANT_CONFIG.BRAND_NAME} — B2B Wholesale Proforma Request*`,
    ``,
    `Namaste Master Weavers!`,
    `We would like to request an official wholesale proforma invoice for our boutique:`,
    ``,
    `✦ *Boutique / Store:* ${params.boutiqueName}`,
    `✦ *Contact Person:* ${params.contactPerson}`,
    `✦ *Location:* ${params.city}`,
    `✦ *GSTIN:* ${params.gstin || "Applied / Unregistered"}`,
    `✦ *Quantity:* ${params.quantity} Handloom Sarees`,
    `✦ *Tier Applied:* ${params.tierName}`,
    `✦ *Estimated Total:* ${formattedTotal} (+5% GST ITC Applicable)`,
    ``,
    `Please send official proforma invoice with Current Account NEFT/UPI details and dispatch schedule.`
  ];

  return `https://wa.me/${phone}?text=${encodeURIComponent(messageLines.join("\n"))}`;
}

/**
 * Verification Test Suite for Pricing Engine, B2B Tiers & WhatsApp Deep Link Utilities
 */

import {
  formatINR,
  calculatePricingBreakdown,
  getB2BTier,
  calculateWholesaleQuote,
  calculateUnitProfit,
  B2B_TIERS,
} from "../lib/pricing.ts";

import {
  cleanPhoneNumber,
  generateOrderWhatsAppUrl,
  generateLiveCallWhatsAppUrl,
  generateWholesaleWhatsAppUrl,
} from "../lib/whatsapp.ts";

import { CATALOG } from "../data/catalog.ts";

let failed = false;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    failed = true;
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

console.log("=== RUNNING DHARMAVARAM COMMERCE ENGINE VERIFICATION ===\n");

// 1. Phone number cleansing check
assert(cleanPhoneNumber("9494392027") === "919494392027", "10-digit phone cleanses to 919494392027");
assert(cleanPhoneNumber("+91 94943-92027") === "919494392027", "Formatted phone with +91 and spaces cleanses cleanly");

// 2. WhatsApp Order URL encoding check
const testOrderUrl = generateOrderWhatsAppUrl({
  sku: "DRM-PS-005",
  title: "Pure Dharmavaram Pattu: Deep Magenta with Gandaberunda Pallu",
  price: 12500,
  selectedFinish: "Bridal Tassels & Fall-Pico (+₹450)",
});
assert(testOrderUrl.startsWith("https://wa.me/919494392027?text="), "Order link has valid wa.me prefix and target number");
assert(testOrderUrl.includes("DRM-PS-005"), "Order link contains SKU code DRM-PS-005");
assert(testOrderUrl.includes(encodeURIComponent("Bridal Tassels")), "Order link correctly encodes finish selection");

// 3. WhatsApp Video Call Booking link check
const testCallUrl = generateLiveCallWhatsAppUrl({
  sku: "DRM-HL-009",
  productTitle: "Handloom Bridal Heirloom",
  customerName: "Sowmya Reddy",
  preferredDate: "2026-12-05",
  preferredTimeSlot: "11:00 AM - 12:00 PM (Morning Loom Sunlight)",
});
assert(testCallUrl.includes(encodeURIComponent("Sowmya Reddy")), "Live call link encodes customer name");
assert(testCallUrl.includes("DRM-HL-009"), "Live call link encodes target SKU");

// 4. WhatsApp Wholesale Quote link check
const testWholesaleUrl = generateWholesaleWhatsAppUrl({
  boutiqueName: "Sringara Sarees Bangalore",
  contactPerson: "Ananya Sharma",
  city: "Bangalore",
  gstin: "29AAAAA0000A1Z5",
  quantity: 25,
  tierName: "Growth Wholesale Tier",
  estimatedTotal: 234375,
});
assert(testWholesaleUrl.includes(encodeURIComponent("Sringara Sarees Bangalore")), "Wholesale link includes boutique name");
assert(testWholesaleUrl.includes("29AAAAA0000A1Z5"), "Wholesale link includes GSTIN");

// 5. Pricing & 5% GST calculations
const breakdown = calculatePricingBreakdown(12500, 18500);
assert(breakdown.totalPrice === 12500, "Total price matches retail price ₹12,500");
assert(breakdown.gstAmount > 0 && breakdown.basePrice + breakdown.gstAmount === 12500, "Base price + 5% GST equals total price exactly");
assert(breakdown.savingsAmount === 6000, "Showroom savings equals ₹6,000");
assert(breakdown.savingsPercentage === 32, "Showroom savings percentage is 32%");

// 6. B2B Tier MOQ Rules
assert(getB2BTier(5) === null, "MOQ < 10 returns null (ineligible for wholesale)");
assert(getB2BTier(10)?.discountPercentage === 18, "MOQ 10 returns Tier 1 (18%)");
assert(getB2BTier(24)?.discountPercentage === 18, "MOQ 24 returns Tier 1 (18%)");
assert(getB2BTier(25)?.discountPercentage === 25, "MOQ 25 returns Tier 2 (25%)");
assert(getB2BTier(49)?.discountPercentage === 25, "MOQ 49 returns Tier 2 (25%)");
assert(getB2BTier(50)?.discountPercentage === 32, "MOQ 50+ returns Tier 3 (32%)");

// 7. Wholesale quote math
const wholesaleQuote = calculateWholesaleQuote(12500, 25);
assert(wholesaleQuote.discountedUnitPrice === Math.round(12500 * 0.75), "Unit wholesale price correctly applies 25% discount");
assert(wholesaleQuote.isEligible === true, "25 units is marked eligible");

// 8. Unit Profit Calculation (Admin Margin)
const unitProfit = calculateUnitProfit(12500, 7400);
assert(unitProfit.netProfit === 12500 - (7400 + 180 + 650 + 140), "Net profit after COGS, packaging, CAC, insurance is exact");
assert(unitProfit.netMarginPercent >= 30, "Net profit margin is healthy (> 30%)");

// 9. Catalog integrity check
assert(CATALOG.length === 12, "Catalog contains exactly 12 authentic SKUs");
const semiSilk = CATALOG.filter(c => c.category === "semi-silk");
const pureSilk = CATALOG.filter(c => c.category === "pure-silk");
const handloom = CATALOG.filter(c => c.category === "handloom-bridal");
assert(semiSilk.length === 4, "Semi-Silk collection has 4 SKUs");
assert(pureSilk.length === 4, "Pure Silk collection has 4 SKUs");
assert(handloom.length === 4, "Handloom Bridal collection has 4 SKUs");

if (failed) {
  console.error("\n❌ Some tests failed!");
  process.exit(1);
} else {
  console.log("\n🎉 ALL VERIFICATION CHECKS PASSED WITH ZERO ERRORS!");
}

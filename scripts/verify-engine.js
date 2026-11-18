/**
 * Production Verification Test Suite for Dharmavaram Commerce Engine
 * Validates exact sourcing COGS, margin-protected wholesale tiers, and instant WhatsApp video call links.
 */

const MERCHANT_CONFIG = {
  BRAND_NAME: "Dharmavaram Handloom Silk Looms",
  WHATSAPP_NUMBER: "919493348129",
  UPI_ID: "dharmavaramlooms@icici",
  UPI_PAYEE_NAME: "Sri Sathya Sai Handloom Weavers Guild",
  GSTIN: "37AAJCS8921M1ZX",
  SILK_MARK_ID: "CSB/AP/DHM/2026/894",
};

const FIXED_WHOLESALE_BASE_PRICES = {
  "semi-silk": 2050,
  "pure-silk": 11000,
  "handloom-bridal": 13500,
};

const FIXED_COGS = {
  "semi-silk": 1200,
  "pure-silk": 8500,
  "handloom-bridal": 11500,
};

const B2B_TIERS = [
  {
    id: "starter",
    minUnits: 10,
    maxUnits: 24,
    discountPerSaree: { "semi-silk": 0, "pure-silk": 0, "handloom-bridal": 0 },
  },
  {
    id: "growth",
    minUnits: 25,
    maxUnits: 49,
    discountPerSaree: { "semi-silk": 100, "pure-silk": 300, "handloom-bridal": 300 },
  },
  {
    id: "master",
    minUnits: 50,
    maxUnits: null,
    discountPerSaree: { "semi-silk": 200, "pure-silk": 500, "handloom-bridal": 500 },
  },
];

function cleanPhoneNumber(phone) {
  const target = phone || MERCHANT_CONFIG.WHATSAPP_NUMBER;
  const digits = target.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

function formatCustomerPhone(phone) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  return digits;
}

function generateLiveCallWhatsAppUrl(params) {
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

function getB2BTier(quantity) {
  if (quantity < 10) return null;
  if (quantity >= 50) return B2B_TIERS[2];
  if (quantity >= 25) return B2B_TIERS[1];
  return B2B_TIERS[0];
}

function calculateWholesaleQuote(category, quantity) {
  const tier = getB2BTier(quantity);
  const baseWholesale = FIXED_WHOLESALE_BASE_PRICES[category];
  const cogs = FIXED_COGS[category];
  const concession = tier ? tier.discountPerSaree[category] : 0;
  const discountedUnitPrice = baseWholesale - concession;

  const shippingPerUnit = category === "semi-silk" ? 100 : 150;
  const outreachPerUnit = category === "semi-silk" ? 80 : 100;
  const netProfitPerUnit = discountedUnitPrice - (cogs + shippingPerUnit + outreachPerUnit);
  const totalNetProfit = netProfitPerUnit * quantity;

  return {
    quantity,
    discountedUnitPrice,
    netProfitPerUnit,
    totalNetProfit,
    isEligible: quantity >= 10,
  };
}

let failed = false;
function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    failed = true;
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

console.log("=== RUNNING PRODUCTION VERIFICATION TEST SUITE ===\n");

// 1. Instant Video Call WhatsApp Deep Link Check
const callUrl = generateLiveCallWhatsAppUrl({
  customerName: "Ananya Reddy",
  customerPhone: "9876543210",
  sku: "DRM-PS-005",
  productTitle: "Pure Dharmavaram Pattu: Deep Magenta",
  price: 12500,
});

assert(callUrl.startsWith("https://wa.me/919493348129?text="), "Video call link targets merchant number");
assert(callUrl.includes(encodeURIComponent("Ananya Reddy")), "Video call link encodes customer name");
assert(callUrl.includes(encodeURIComponent("+91 9876543210")), "Video call link formats customer phone with +91");
assert(callUrl.includes("DRM-PS-005"), "Video call link encodes SKU DRM-PS-005");
assert(callUrl.includes(encodeURIComponent("Live Loom Video Call right now")), "Video call link contains urgent instant call request");

// 2. Instant Video Call without SKU (General Home Showcase)
const generalCallUrl = generateLiveCallWhatsAppUrl({
  customerName: "Pooja Sharma",
  customerPhone: "9123456789",
});
assert(generalCallUrl.includes(encodeURIComponent("General Dharmavaram Loom Showcase")), "General showcase properly handles empty SKU/title");

// 3. Semi-Silk Tier 1 Margin Check
const semiTier1 = calculateWholesaleQuote("semi-silk", 15);
assert(semiTier1.discountedUnitPrice === 2050, "Semi-Silk Tier 1 price is exactly ₹2,050");
assert(semiTier1.netProfitPerUnit === 670, "Semi-Silk Tier 1 locks in ₹670 net profit per saree");

// 4. Pure Silk Tier 1 Margin Check
const pureTier1 = calculateWholesaleQuote("pure-silk", 20);
assert(pureTier1.discountedUnitPrice === 11000, "Pure Silk Tier 1 price is exactly ₹11,000");
assert(pureTier1.netProfitPerUnit === 2250, "Pure Silk Tier 1 locks in ₹2,250 net profit per saree");

// 5. Handloom Bridal Tier 1 Margin Check
const handloomTier1 = calculateWholesaleQuote("handloom-bridal", 10);
assert(handloomTier1.discountedUnitPrice === 13500, "Handloom Tier 1 price is exactly ₹13,500");
assert(handloomTier1.netProfitPerUnit === 1750, "Handloom Tier 1 locks in ₹1,750 net profit per saree");

// 6. Tier 2 & 3 Concessions Check
const pureTier2 = calculateWholesaleQuote("pure-silk", 30);
assert(pureTier2.discountedUnitPrice === 10700, "Pure Silk Tier 2 applies ₹300 concession");
assert(pureTier2.netProfitPerUnit === 1950, "Pure Silk Tier 2 maintains ₹1,950 net profit");

const pureTier3 = calculateWholesaleQuote("pure-silk", 50);
assert(pureTier3.discountedUnitPrice === 10500, "Pure Silk Tier 3 applies ₹500 concession");
assert(pureTier3.netProfitPerUnit === 1750, "Pure Silk Tier 3 maintains ₹1,750 net profit on volume");

// 7. MOQ Gate Check
const belowMOQ = calculateWholesaleQuote("pure-silk", 8);
assert(belowMOQ.isEligible === false, "Orders under 10 sarees are locked from wholesale rates");

if (failed) {
  process.exit(1);
} else {
  console.log("\n🎉 ALL VERIFICATION TEST SUITE CHECKS PASSED!");
}

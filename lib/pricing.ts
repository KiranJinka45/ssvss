/**
 * Dharmavaram Silk Sarees — Pricing & Margin-Protected Wholesale Engine
 */

import { SareeCategory } from "@/data/catalog";

export interface PricingBreakdown {
  basePrice: number;
  gstRate: number; // 0.05 (5%)
  gstAmount: number;
  totalPrice: number;
  showroomPrice: number;
  savingsAmount: number;
  savingsPercentage: number;
}

export interface B2BTier {
  id: string;
  name: string;
  minUnits: number;
  maxUnits: number | null;
  badge: string;
  description: string;
  discountPerSaree: {
    "semi-silk": number;
    "pure-silk": number;
    "handloom-bridal": number;
  };
}

export const FIXED_WHOLESALE_BASE_PRICES: Record<SareeCategory, number> = {
  "semi-silk": 2050,
  "pure-silk": 11000,
  "handloom-bridal": 13500,
};

export const FIXED_COGS: Record<SareeCategory, number> = {
  "semi-silk": 1200,
  "pure-silk": 8500,
  "handloom-bridal": 11500,
};

export const B2B_TIERS: B2BTier[] = [
  {
    id: "starter",
    name: "Tier 1 — Boutique Starter",
    minUnits: 10,
    maxUnits: 24,
    badge: "MOQ 10–24",
    description: "Ideal for boutique testing & regional exhibitions. Fixed direct-loom wholesale base.",
    discountPerSaree: {
      "semi-silk": 0,
      "pure-silk": 0,
      "handloom-bridal": 0,
    },
  },
  {
    id: "growth",
    name: "Tier 2 — Partner Boutique",
    minUnits: 25,
    maxUnits: 49,
    badge: "MOQ 25–49",
    description: "Festive stocking & bridal pop-ups. Extra ₹100–₹300 volume concession per saree.",
    discountPerSaree: {
      "semi-silk": 100,
      "pure-silk": 300,
      "handloom-bridal": 300,
    },
  },
  {
    id: "master",
    name: "Tier 3 — Showroom Bulk",
    minUnits: 50,
    maxUnits: null,
    badge: "MOQ 50+",
    description: "Full retail stockist tier. Extra ₹200–₹500 concession per saree with priority loom production.",
    discountPerSaree: {
      "semi-silk": 200,
      "pure-silk": 500,
      "handloom-bridal": 500,
    },
  },
];

/**
 * Format raw number into Indian Rupee representation (e.g., ₹12,500)
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculate standard price breakdown with 5% Textile GST
 */
export function calculatePricingBreakdown(
  retailPrice: number,
  showroomPrice: number
): PricingBreakdown {
  const basePrice = Math.round(retailPrice / 1.05);
  const gstAmount = retailPrice - basePrice;
  const savingsAmount = Math.max(0, showroomPrice - retailPrice);
  const savingsPercentage = showroomPrice > 0 ? Math.round((savingsAmount / showroomPrice) * 100) : 0;

  return {
    basePrice,
    gstRate: 0.05,
    gstAmount,
    totalPrice: retailPrice,
    showroomPrice,
    savingsAmount,
    savingsPercentage,
  };
}

/**
 * Determine eligible B2B discount tier based on order quantity
 */
export function getB2BTier(quantity: number): B2BTier | null {
  if (quantity < 10) return null;
  if (quantity >= 50) return B2B_TIERS[2];
  if (quantity >= 25) return B2B_TIERS[1];
  return B2B_TIERS[0];
}

/**
 * Calculate Margin-Protected B2B bulk wholesale pricing by category
 */
export function calculateWholesaleQuote(
  category: SareeCategory,
  quantity: number,
  retailPriceOverride?: number
) {
  const tier = getB2BTier(quantity);
  const baseWholesale = FIXED_WHOLESALE_BASE_PRICES[category] || 11000;
  const cogs = FIXED_COGS[category] || 8500;
  const retailPrice = retailPriceOverride || (category === "semi-silk" ? 3200 : category === "pure-silk" ? 12500 : 16000);

  const concession = tier ? tier.discountPerSaree[category] : 0;
  const discountedUnitPrice = baseWholesale - concession;

  const subtotal = discountedUnitPrice * quantity;
  const gstAmount = Math.round(subtotal * 0.05);
  const total = subtotal + gstAmount;

  const standardRetailTotal = retailPrice * quantity;
  const totalSavings = standardRetailTotal - subtotal;

  // Real merchant net profit calculation
  const shippingPerUnit = category === "semi-silk" ? 100 : 150;
  const outreachPerUnit = category === "semi-silk" ? 80 : 100;
  const netProfitPerUnit = discountedUnitPrice - (cogs + shippingPerUnit + outreachPerUnit);
  const totalNetProfit = netProfitPerUnit * quantity;

  return {
    quantity,
    tier,
    tierName: tier ? tier.name : "Below MOQ",
    category,
    unitRetailPrice: retailPrice,
    baseWholesalePrice: baseWholesale,
    discountedUnitPrice,
    subtotal,
    gstRate: 0.05,
    gstAmount,
    total,
    totalSavings,
    cogs,
    netProfitPerUnit,
    totalNetProfit,
    isEligible: quantity >= 10,
  };
}

/**
 * Unit Economics & Net Profit Calculator for /admin
 */
export function calculateUnitProfit(
  retailPrice: number,
  cogs: number,
  customCosts?: {
    packaging?: number;
    adSpendCAC?: number;
    shippingInsurance?: number;
    gatewayFee?: number;
  }
) {
  const packaging = customCosts?.packaging ?? 180;
  const adSpendCAC = customCosts?.adSpendCAC ?? 650;
  const shippingInsurance = customCosts?.shippingInsurance ?? 140;
  const gatewayFee = customCosts?.gatewayFee ?? 0;

  const totalCost = cogs + packaging + adSpendCAC + shippingInsurance + gatewayFee;
  const netProfit = retailPrice - totalCost;
  const netMarginPercent = retailPrice > 0 ? Math.round((netProfit / retailPrice) * 100) : 0;

  return {
    retailPrice,
    weaverCOGS: cogs,
    cogs,
    packaging,
    adSpendCAC,
    shippingInsurance,
    gatewayFee,
    totalCost,
    netProfit,
    netMarginPercent,
  };
}

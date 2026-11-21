import { CATALOG, SareeSKU } from "@/data/catalog";

export interface CategoryTier {
  id: string;
  title: string;
  slug: string;
  anchorPrice: string;
  loomPrice: string;
  discountBadge: string;
  description: string;
  image: string;
  isWholesale?: boolean;
}

export const DEFAULT_CATEGORY_TIERS: CategoryTier[] = [
  {
    id: "semi-silk",
    title: "Semi-Silk Festive",
    slug: "semi-silk",
    anchorPrice: "Showroom: ₹4,800",
    loomPrice: "Direct Loom: ₹3,200",
    discountBadge: "33% OFF",
    description: "High-velocity 580g wrinkle-resistant festive drapes with tested antique gold zari.",
    image: "/images/sarees/semi-01.jpg",
  },
  {
    id: "pure-silk",
    title: "Pure Mulberry Silk",
    slug: "pure-silk",
    anchorPrice: "Showroom: ₹18,500",
    loomPrice: "Direct Loom: ₹12,500",
    discountBadge: "32% OFF",
    description: "Central Silk Board Silk Mark certified 740g pure pit-loom weaves with Korvai temple borders.",
    image: "/images/sarees/pure-01.jpg",
  },
  {
    id: "handloom-bridal",
    title: "Handloom Bridal Heirloom",
    slug: "handloom-bridal",
    anchorPrice: "Showroom: ₹25,500+",
    loomPrice: "Direct Loom: ₹16,000+",
    discountBadge: "37% OFF",
    description: "Limited single-loom weaves (18-24 days on pit-loom) with heavy 3G pure gold zari.",
    image: "/images/sarees/handloom-01.jpg",
  },
  {
    id: "wholesale",
    title: "B2B Boutique Wholesale",
    slug: "wholesale",
    anchorPrice: "Tier Discounts up to 32%",
    loomPrice: "MOQ: 10, 25 & 50 Sarees",
    discountBadge: "UP TO 32% OFF",
    description: "Passcode-gated portal for boutique owners with GSTIN capture & direct NEFT proforma.",
    isWholesale: true,
    image: "/images/sarees/pure-02.jpg",
  },
];

export const DEFAULT_MASTER_CREATIONS_SKUS = [
  "DRM-PS-005",
  "DRM-SS-001",
  "DRM-HL-009",
  "DRM-PS-006",
  "DRM-SS-002",
  "DRM-HL-011",
];

export const DEFAULT_COLLECTION_METAS = {
  categoryRail: {
    eyebrow: "Curated Weaving Tiers",
    title: "Explore Our Dharmavaram Loom Collections",
    subtitle: "From high-velocity festive semi-silk to once-in-a-generation bridal heirloom weaves, every saree is priced transparently direct from our pit-looms.",
  },
  masterCreations: {
    eyebrow: "Loom-Fresh Arrivals",
    title: "Master Weaver Creations",
    subtitle: "Individually woven over 4 to 22 days by master artisan families in Dharmavaram. Direct from the pit-looms.",
  },
};

/**
 * Helper to fetch all sarees (built-in CATALOG + any custom sarees created by admin)
 */
export function getAllMergedSarees(): SareeSKU[] {
  if (typeof window === "undefined") {
    return CATALOG;
  }

  const customStr = localStorage.getItem("loom_custom_products");
  let customProducts: SareeSKU[] = [];
  if (customStr) {
    try {
      customProducts = JSON.parse(customStr);
    } catch {
      customProducts = [];
    }
  }

  // Merge custom products (custom takes priority on sku matches, else prepended)
  const mergedMap = new Map<string, SareeSKU>();
  CATALOG.forEach((item) => mergedMap.set(item.sku.toUpperCase(), item));
  customProducts.forEach((item) => mergedMap.set(item.sku.toUpperCase(), item));

  // Apply inventory overrides
  const overridesStr = localStorage.getItem("loom_inventory_overrides");
  if (overridesStr) {
    try {
      const overrides = JSON.parse(overridesStr);
      mergedMap.forEach((item, sku) => {
        if (overrides[sku]) {
          item.stockStatus = overrides[sku];
        }
      });
    } catch {}
  }

  return Array.from(mergedMap.values());
}

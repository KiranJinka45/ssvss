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

export interface HeroSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  href: string;
}

export const HERO_SLIDE_PRESETS: Record<string, { label: string; slides: HeroSlide[] }> = {
  set1: {
    label: "Version 1 (High Quality Cut Banners - Recommended)",
    slides: [
      {
        id: 1,
        image: "/images/banners/banner-set1-1-dharmavaram-pure-silk.jpg",
        title: "Dharmavaram Silk Sarees - A Heritage Woven in Silk",
        subtitle: "Pure Mulberry Silk with Double-Shuttle Korvai Borders",
        href: "/collections/pure-silk",
      },
      {
        id: 2,
        image: "/images/banners/banner-set1-2-handloom-heritage.jpg",
        title: "Handloom Sarees - Pure Weaves. Lasting Grace",
        subtitle: "Direct From Dharmavaram Pit-Looms Since 1974",
        href: "/collections/handloom-bridal",
      },
      {
        id: 3,
        image: "/images/banners/banner-set1-3-semi-kanchipuram.jpg",
        title: "Semi Kanchipuram Dharmavaram Silks - Royal Elegance. Everyday Grace",
        subtitle: "High-Velocity Festive Drapes with Tested Antique Gold Zari",
        href: "/collections/semi-silk",
      },
    ],
  },
  set2: {
    label: "Version 2 (Alternative Variation)",
    slides: [
      {
        id: 1,
        image: "/images/banners/banner-set2-1-dharmavaram-pure-silk.jpg",
        title: "Dharmavaram Silk Sarees - A Legacy Woven in Silk",
        subtitle: "Pure Mulberry Silk with Hand-Interlocked Korvai Temple Borders",
        href: "/collections/pure-silk",
      },
      {
        id: 2,
        image: "/images/banners/banner-set2-2-handloom-heritage.jpg",
        title: "Handloom Sarees - Timeless Craft. Everlasting Grace",
        subtitle: "Woven by Master Artisan Families in Dharmavaram",
        href: "/collections/handloom-bridal",
      },
      {
        id: 3,
        image: "/images/banners/banner-set2-3-semi-kanchipuram.jpg",
        title: "Semi Kanchipuram Dharmavaram Silk Sarees - Tradition with a Touch of Elegance",
        subtitle: "Royal Drapes with Rich Contrast Zari Pallus",
        href: "/collections/semi-silk",
      },
    ],
  },
  set3: {
    label: "Version 3 (Alternative Variation)",
    slides: [
      {
        id: 1,
        image: "/images/banners/banner-set3-1-dharmavaram-pure-silk.jpg",
        title: "Dharmavaram Silk Sarees - Tradition Woven in Every Thread",
        subtitle: "Traditional Pit-Loom Weaves Since 1974",
        href: "/collections/pure-silk",
      },
      {
        id: 2,
        image: "/images/banners/banner-set3-2-handloom-heritage.jpg",
        title: "Handloom Sarees - Pure Weaves. Lasting Elegance",
        subtitle: "Authentic Handloom Weaving Cluster",
        href: "/collections/handloom-bridal",
      },
      {
        id: 3,
        image: "/images/banners/banner-set3-3-semi-kanchipuram.jpg",
        title: "Semi Kanchipuram Dharmavaram Silks - Grace of Kanchipuram. Soul of Dharmavaram",
        subtitle: "Festive Heirloom Silks",
        href: "/collections/semi-silk",
      },
    ],
  },
  fullUploads: {
    label: "All 3 Full Uploaded Image Files",
    slides: [
      {
        id: 1,
        image: "/images/banners/full-upload-1.jpg",
        title: "Dharmavaram Silk Heritage - Full Showcase 1",
        subtitle: "A Heritage Woven in Silk",
        href: "/collections/pure-silk",
      },
      {
        id: 2,
        image: "/images/banners/full-upload-2.jpg",
        title: "Dharmavaram Silk Heritage - Full Showcase 2",
        subtitle: "A Legacy Woven in Silk",
        href: "/collections/handloom-bridal",
      },
      {
        id: 3,
        image: "/images/banners/full-upload-3.jpg",
        title: "Dharmavaram Silk Heritage - Full Showcase 3",
        subtitle: "Tradition Woven in Every Thread",
        href: "/collections/semi-silk",
      },
    ],
  },
};

export const DEFAULT_HERO_SLIDES = HERO_SLIDE_PRESETS.set1.slides;

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

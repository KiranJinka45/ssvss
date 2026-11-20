import React from "react";
import { notFound } from "next/navigation";
import { CATALOG, SareeCategory } from "@/data/catalog";
import { ProductCard } from "@/components/product/ProductCard";
import { Sparkles, ShieldCheck, Flame, Filter } from "lucide-react";

export function generateStaticParams() {
  return [
    { slug: "all" },
    { slug: "pure-silk" },
    { slug: "semi-silk" },
    { slug: "handloom-bridal" },
  ];
}

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

const COLLECTION_META: Record<
  string,
  {
    title: string;
    subtitle: string;
    description: string;
    badge: string;
    icon: any;
  }
> = {
  all: {
    title: "Complete Dharmavaram Loom Catalog",
    subtitle: "All 12 Handcrafted Pit-Loom Weaves",
    description:
      "Explore the complete master weaving portfolio from our artisan clusters in Dharmavaram, Sri Sathya Sai District. Filter by silk purity, zari formulation, and festive requirements.",
    badge: "12 Authentic Looms",
    icon: Sparkles,
  },
  "pure-silk": {
    title: "Pure Mulberry Silk Collection",
    subtitle: "Central Silk Board Silk Mark Certified Flagships",
    description:
      "100% pure high-denier mulberry silk pit-loom weaves. Woven with double-shuttle interlocked Korvai borders, antique gold 3G tested zari, and tamper-proof Silk Mark QR verification tags.",
    badge: "Silk Mark Certified",
    icon: ShieldCheck,
  },
  "semi-silk": {
    title: "Semi-Silk Festive Collection",
    subtitle: "High-Velocity Social Commerce SKUs",
    description:
      "High-twist blended silk designed for festive poojas, housewarmings, and wedding guest styling. 580g wrinkle-resistant drape with tested antique gold zari at direct-loom affordability.",
    badge: "Festive Favorite",
    icon: Flame,
  },
  "handloom-bridal": {
    title: "Handloom Bridal Heirloom Collection",
    subtitle: "Limited Single-Loom Masterpieces",
    description:
      "The pinnacle of Telugu and South Indian wedding heritage. Master pit-loom jacquards taking 18 to 24 continuous days to weave, featuring double-warp pure silk and royal Vijayanagara temple motifs.",
    badge: "Single-Loom Weaves",
    icon: Sparkles,
  },
};

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const meta = COLLECTION_META[slug];

  if (!meta) {
    notFound();
  }

  const sarees =
    slug === "all"
      ? CATALOG
      : CATALOG.filter((item) => item.category === (slug as SareeCategory));

  const Icon = meta.icon;

  return (
    <div className="py-10 sm:py-14 bg-canvas min-h-screen">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
        {/* Editorial Collection Header */}
        <div className="border-b border-loom-border/80 pb-8 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-100 text-gold-700 text-xs font-bold uppercase tracking-wider mb-3 border border-gold/40">
            <Icon className="w-3.5 h-3.5 text-gold" />
            <span>{meta.badge}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-maroon tracking-tight">
            {meta.title}
          </h1>

          <p className="text-xs sm:text-sm lg:text-base text-loom-bronze max-w-4xl mt-2 leading-relaxed font-light">
            {meta.description}
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-loom-border/50 text-xs text-loom-stone">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-maroon">{sarees.length} Looms Ready</span>
              <span>•</span>
              <span>All-India Insured Dispatch in 24 Hours</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-silk-emerald font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Genuine Weft Guarantee
              </span>
            </div>
          </div>
        </div>

        {/* Product Cards Grid - Full Width Expansive */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {sarees.map((saree) => (
            <ProductCard key={saree.id} saree={saree} />
          ))}
        </div>
      </div>
    </div>
  );
}

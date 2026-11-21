import React from "react";
import { CategoryRail } from "@/components/home/CategoryRail";
import { MasterCreationsRail } from "@/components/home/MasterCreationsRail";

export const metadata = {
  title: "Dharmavaram Loom Collections | Curated Handloom Silk Weaves",
  description:
    "Explore our 4 curated Dharmavaram weaving tiers: Semi-Silk Festive, Pure Mulberry Silk, Handloom Bridal Heirloom, and B2B Boutique Wholesale. Direct from artisan pit-looms.",
};

export default function CollectionsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      {/* Curated Weaving Tiers - Occupies its own dedicated full page */}
      <CategoryRail />

      {/* Featured Master Loom Weaves */}
      <MasterCreationsRail />
    </div>
  );
}

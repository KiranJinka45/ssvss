import React from "react";
import { WholesalePortal } from "@/components/b2b/WholesalePortal";

export const metadata = {
  title: "B2B Boutique Wholesale Portal | Dharmavaram Handloom Silk Looms",
  description:
    "Direct pit-loom bulk wholesale pricing for boutiques, bridal studios, and multi-designer stores. Tier discounts up to 32% for MOQs of 10, 25, and 50+ sarees with GST input tax credit.",
};

export default function WholesalePage() {
  return (
    <div className="py-12 bg-canvas min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <WholesalePortal />
      </div>
    </div>
  );
}

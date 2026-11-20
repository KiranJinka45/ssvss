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
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
        <WholesalePortal />
      </div>
    </div>
  );
}

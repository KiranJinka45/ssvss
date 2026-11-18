import React from "react";
import { QuickInventory } from "@/components/admin/QuickInventory";

export const metadata = {
  title: "Merchant Operations & Inventory Control | Dharmavaram Silk Looms",
  description:
    "Founder portal for Dharmavaram pit-loom stock status, unit economics, daily weaver payout ledger, and profit margin analysis.",
};

export default function AdminPage() {
  return (
    <div className="py-12 bg-canvas min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <QuickInventory />
      </div>
    </div>
  );
}

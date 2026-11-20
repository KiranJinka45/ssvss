"use client";

import React, { useState } from "react";
import { ArrowDown, Check, ShieldAlert, Sparkles, Building, Scissors, Store, HeartHandshake } from "lucide-react";
import { formatINR } from "@/lib/pricing";

export function LoomToWardrobe() {
  const [activeTab, setActiveTab] = useState<"pure-silk" | "bridal">("pure-silk");

  const comparisonData = {
    "pure-silk": {
      title: "Pure Mulberry Silk Pattu Saree",
      showroomTotal: 18500,
      loomTotal: 12500,
      savings: 6000,
      percentSavings: "32%",
      middlemanSteps: [
        { label: "Weaver Pit-Loom Base Price", cost: 7400, desc: "Fair compensation paid directly to Dharmavaram weaver", icon: Scissors },
        { label: "Local Master Trader Cut", cost: 1800, desc: "Intermediary commission in local market", icon: Building },
        { label: "City Wholesaler & Logistics", cost: 2600, desc: "Regional distributor warehousing & handling", icon: Store },
        { label: "Metro Showroom Rent & 45% Markup", cost: 6700, desc: "High prime street rent, sales commission, marketing", icon: ShieldAlert },
      ],
      directLoomSteps: [
        { label: "Weaver Direct Fair Wage", cost: 7400, desc: "100% paid directly to weaver family without delay", icon: HeartHandshake },
        { label: "Silk Mark & Quality Control", cost: 450, desc: "Official CSB testing & individual hologram tagging", icon: Sparkles },
        { label: "Rigid Box & Insured Shipping", cost: 300, desc: "All-India insured express transit to doorstep", icon: Building },
        { label: "Our Sustainable Operating Margin", cost: 4350, desc: "Platform operations, loom support & customer service", icon: Sparkles },
      ],
    },
    bridal: {
      title: "Handloom Bridal Heirloom (18-Day Weave)",
      showroomTotal: 25500,
      loomTotal: 16800,
      savings: 8700,
      percentSavings: "34%",
      middlemanSteps: [
        { label: "Master Pit-Loom Fair Wage", cost: 10500, desc: "Extensive 18-day double-warp jacquard craftsmanship", icon: Scissors },
        { label: "Wholesale Silk Agent Cut", cost: 2800, desc: "Local aggregator margin", icon: Building },
        { label: "Metro Bridal Boutique Markup", cost: 12200, desc: "Exorbitant wedding season showroom markup", icon: Store },
      ],
      directLoomSteps: [
        { label: "Master Pit-Loom Fair Wage", cost: 10500, desc: "Direct compensation to National Awardee master weaver", icon: HeartHandshake },
        { label: "Silk Mark Card & Gold Verification", cost: 650, desc: "Authentic purity testing and certified silk seal", icon: Sparkles },
        { label: "Bridal Presentation Box & Courier", cost: 450, desc: "Heirloom archival packaging & insured dispatch", icon: Building },
        { label: "Sustainable Platform Margin", cost: 5200, desc: "Fair trade sustainability and digital cataloging", icon: Sparkles },
      ],
    },
  };

  const current = comparisonData[activeTab];

  return (
    <section id="loom-to-wardrobe" className="py-14 sm:py-20 bg-canvas-surface border-b border-loom-border/60 overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-gold-700 block mb-2">
            Total Price Transparency
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon">
            The Loom-to-Wardrobe Economics
          </h2>
          <p className="text-sm sm:text-base text-loom-bronze mt-3">
            Why pay ₹6,000 to ₹9,000 more for the exact same Dharmavaram saree in luxury city showrooms? See exactly where your money goes.
          </p>

          {/* Tab Selector */}
          <div className="inline-flex items-center p-1 rounded-xl bg-canvas border border-loom-border/80 mt-6 shadow-sm">
            <button
              onClick={() => setActiveTab("pure-silk")}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "pure-silk"
                  ? "bg-maroon text-canvas shadow-sm"
                  : "text-loom-bronze hover:text-maroon"
              }`}
            >
              Pure Mulberry Silk ({formatINR(12500)})
            </button>
            <button
              onClick={() => setActiveTab("bridal")}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "bridal"
                  ? "bg-maroon text-canvas shadow-sm"
                  : "text-loom-bronze hover:text-maroon"
              }`}
            >
              Bridal Heirloom ({formatINR(16800)})
            </button>
          </div>
        </div>

        {/* Side-by-Side Breakdown Card - Full Width */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-10 w-full">
          {/* Traditional Showroom Route */}
          <div className="rounded-2xl bg-canvas p-6 sm:p-8 border border-red-200/60 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between pb-5 border-b border-loom-border/60">
              <div>
                <span className="text-xs uppercase tracking-wider text-red-700 font-bold block">
                  Conventional Path
                </span>
                <h3 className="font-serif font-bold text-xl text-loom-charcoal mt-0.5">
                  Metro Luxury Showrooms
                </h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-red-900 block font-serif">
                  {formatINR(current.showroomTotal)}
                </span>
                <span className="text-[11px] text-loom-stone">Inflated Middleman Retail</span>
              </div>
            </div>

            <div className="space-y-4 py-6">
              {current.middlemanSteps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="flex items-start justify-between gap-3 text-xs sm:text-sm">
                    <div className="flex items-start gap-2.5">
                      <div className="p-1.5 rounded bg-red-50 text-red-700 mt-0.5">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-semibold text-loom-charcoal block">{step.label}</span>
                        <span className="text-[11px] text-loom-stone">{step.desc}</span>
                      </div>
                    </div>
                    <span className="font-bold text-loom-charcoal shrink-0">{formatINR(step.cost)}</span>
                  </div>
                );
              })}
            </div>

            <div className="p-3.5 rounded-xl bg-red-50/60 border border-red-200/50 text-xs text-red-800 leading-relaxed">
              ⚠️ In traditional showrooms, over <strong>40% of what you pay</strong> pays for air-conditioned mall rents and distributor markups rather than the weaver.
            </div>
          </div>

          {/* Direct Loom Route */}
          <div className="rounded-2xl bg-canvas p-6 sm:p-8 border-2 border-gold/60 shadow-luxury relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gold text-maroon-900 font-bold text-[11px] px-3.5 py-1 rounded-bl-xl uppercase tracking-wider shadow-sm">
              You Save {current.percentSavings} ({formatINR(current.savings)})
            </div>

            <div className="flex items-center justify-between pb-5 border-b border-loom-border/60 pt-2">
              <div>
                <span className="text-xs uppercase tracking-wider text-silk-emerald font-bold block flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-gold" /> Direct-From-Loom
                </span>
                <h3 className="font-serif font-bold text-xl text-maroon mt-0.5">
                  Dharmavaram Looms
                </h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-silk-emerald block font-serif">
                  {formatINR(current.loomTotal)}
                </span>
                <span className="text-[11px] text-silk-emerald font-semibold">100% Fair Loom Price</span>
              </div>
            </div>

            <div className="space-y-4 py-6">
              {current.directLoomSteps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="flex items-start justify-between gap-3 text-xs sm:text-sm">
                    <div className="flex items-start gap-2.5">
                      <div className="p-1.5 rounded bg-gold/10 text-gold-700 mt-0.5">
                        <Icon className="w-3.5 h-3.5 text-gold" />
                      </div>
                      <div>
                        <span className="font-semibold text-loom-charcoal block">{step.label}</span>
                        <span className="text-[11px] text-loom-stone">{step.desc}</span>
                      </div>
                    </div>
                    <span className="font-bold text-maroon shrink-0">{formatINR(step.cost)}</span>
                  </div>
                );
              })}
            </div>

            <div className="p-3.5 rounded-xl bg-silk-emeraldBg border border-silk-emerald/30 text-xs text-silk-emerald leading-relaxed font-medium">
              ✨ <strong>Direct Weaver Benefit:</strong> Weavers receive immediate, respectful payments with zero middleman deductions. You get authentic Silk Mark certified luxury.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

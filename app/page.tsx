import React from "react";
import Link from "next/link";
import { HeroEditorial } from "@/components/home/HeroEditorial";
import { CategoryRail } from "@/components/home/CategoryRail";
import { LoomToWardrobe } from "@/components/home/LoomToWardrobe";
import { VideoCallBanner } from "@/components/home/VideoCallBanner";
import { ProductCard } from "@/components/product/ProductCard";
import { CATALOG } from "@/data/catalog";
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Star } from "lucide-react";

export default function HomePage() {
  // Select top 3 highlight sarees for home display (fits in 1 page like CategoryRail)
  const featuredSarees = [
    CATALOG[4], // Pure Silk Magenta Gandaberunda
    CATALOG[0], // Semi-Silk Kumkum Maroon
    CATALOG[8], // Handloom Bridal Vermillion Muhurtham
  ];

  const testimonials = [
    {
      name: "Radhika Kulkarni",
      city: "Jayanagar, Bangalore",
      quote:
        "I was hesitant to buy pure silk online until I had the 2-minute video call. The loom master stood in the morning sun and showed the true golden shine of the Korvai border. In Bangalore showrooms this exact saree was quoted at ₹21,000. I received it with the Silk Mark card for ₹12,500!",
      verified: true,
      sku: "DRM-PS-005",
    },
    {
      name: "Dr. Sunitha Reddy",
      city: "Banjara Hills, Hyderabad",
      quote:
        "Ordered the Bridal Vermillion Heirloom for my daughter's wedding muhurtham. The 840g pure silk weight and double-warp weave drape like royalty. Zero stiffness, authentic hand-interlocked border. Wonderful to support traditional Andhra weavers directly.",
      verified: true,
      sku: "DRM-HL-009",
    },
    {
      name: "Lakshmi Narayanan",
      city: "Mylapore, Chennai",
      quote:
        "The semi-silk festive sarees are phenomenal value. Bought 3 pieces for family Varalakshmi pooja. Everyone assumed they were ₹5,000+ each. Dispatched within 24 hours with insured courier.",
      verified: true,
      sku: "DRM-SS-001",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Editorial Section */}
      <HeroEditorial />

      {/* Category Rail (Tiers) */}
      <CategoryRail />

      {/* Featured Master Loom Weaves */}
      <section className="py-8 sm:py-10 bg-canvas-surface border-b border-loom-border/60 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-5 sm:mb-6">
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-gold-700 block mb-1">
                Loom-Fresh Arrivals
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-maroon">
                Master Weaver Creations
              </h2>
              <p className="text-xs sm:text-sm text-loom-bronze mt-1 max-w-xl">
                Individually woven over 4 to 22 days by master artisan families in Dharmavaram. Once sold, identical re-weaves require up to 3 weeks on the loom.
              </p>
            </div>

            <Link
              href="/collections/all"
              className="mt-3 md:mt-0 px-4 py-2 rounded-lg bg-maroon text-canvas hover:bg-maroon-700 text-xs font-semibold tracking-wide transition-all shadow-sm flex items-center gap-1.5 group w-fit shrink-0"
            >
              <span>View Full 12-Saree Catalog</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-gold-400" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {featuredSarees.map((saree) => (
              <ProductCard key={saree.id} saree={saree} />
            ))}
          </div>
        </div>
      </section>

      {/* Middleman vs Direct Loom Visualizer */}
      <LoomToWardrobe />

      {/* WhatsApp Video Call Banner */}
      <VideoCallBanner />

      {/* Connoisseur Testimonials */}
      <section className="py-20 bg-canvas border-b border-loom-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-gold-700 block mb-1">
              Verified Patron Stories
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon">
              Treasured by Families Across India
            </h2>
            <p className="text-sm text-loom-bronze mt-2">
              From wedding muhurthams to temple festivals, read why connoisseurs choose direct Dharmavaram pit-loom authenticity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-canvas-card border border-loom-border/80 shadow-luxury flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-gold mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="text-sm text-loom-charcoal leading-relaxed italic">
                    &ldquo;{test.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-loom-border/60 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-serif font-bold text-maroon text-sm">{test.name}</h4>
                    <span className="text-loom-stone">{test.city}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-silk-emeraldBg text-silk-emerald font-semibold flex items-center gap-1 text-[11px]">
                    <ShieldCheck className="w-3 h-3" /> Verified Buyer
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

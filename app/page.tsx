import React from "react";
import Link from "next/link";
import { HeroEditorial } from "@/components/home/HeroEditorial";
import { CategoryRail } from "@/components/home/CategoryRail";
import { MasterCreationsRail } from "@/components/home/MasterCreationsRail";
import { LoomToWardrobe } from "@/components/home/LoomToWardrobe";
import { VideoCallBanner } from "@/components/home/VideoCallBanner";
import { ShieldCheck, Star } from "lucide-react";

export default function HomePage() {
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

      {/* Featured Master Loom Weaves - Full Width Dynamic Showcase */}
      <MasterCreationsRail />

      {/* Middleman vs Direct Loom Visualizer */}
      <LoomToWardrobe />

      {/* WhatsApp Video Call Banner */}
      <VideoCallBanner />

      {/* Connoisseur Testimonials - Full Width */}
      <section className="py-14 sm:py-20 bg-canvas border-b border-loom-border/60 overflow-hidden">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-gold-700 block mb-1">
              Verified Patron Stories
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon">
              Treasured by Families Across India
            </h2>
            <p className="text-xs sm:text-sm text-loom-bronze mt-2">
              From wedding muhurthams to temple festivals, read why connoisseurs choose direct Dharmavaram pit-loom authenticity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
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

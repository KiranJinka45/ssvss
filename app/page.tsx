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
  // Select top 6 highlight sarees for home display
  const featuredSarees = [
    CATALOG[4], // Pure Silk Magenta Gandaberunda
    CATALOG[0], // Semi-Silk Kumkum Maroon
    CATALOG[8], // Handloom Bridal Vermillion Muhurtham
    CATALOG[5], // Pure Silk Peacock Teal
    CATALOG[1], // Semi-Silk Rama Green
    CATALOG[10], // Handloom Korvai Scarlet Rose
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

  const faqs = [
    {
      q: "How do I know this is 100% pure silk and not synthetic?",
      a: "Every pure silk and bridal heirloom saree from our looms carries an official Central Silk Board of India 'Silk Mark' certified tag with a unique QR code. You can scan or cross-verify this code directly on the central government portal. We also perform flame purity tests on loom yarn batches.",
    },
    {
      q: "Why are your prices ₹5,000 to ₹9,000 lower than city showrooms?",
      a: "City showrooms in Hyderabad, Bangalore, and Chennai incur prime commercial rents (often ₹3-5 Lakhs/month), distributor commissions, sales staff salaries, and 45-50% retail markups. When you order from us, your saree travels directly from the pit-loom in Dharmavaram to your doorstep. Zero middlemen, fair wages for the weaver, and honest pricing for you.",
    },
    {
      q: "Can I inspect the saree on a video call before making payment?",
      a: "Yes! Simply click 'Book Live Video Call' on any product page or use the top banner. Our loom master in Kothapeta will connect via WhatsApp video call, open the full 6.2-meter saree in natural morning sunlight, show the pallu zari, and check the pleat drape.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We support direct Current Account UPI payments (0% extra gateway fees) via WhatsApp, as well as online NetBanking, Debit/Credit Cards, and UPI Intent gateways. Official GST tax invoices are provided with every order.",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Editorial Section */}
      <HeroEditorial />

      {/* Category Rail (Tiers) */}
      <CategoryRail />

      {/* Featured Master Loom Weaves */}
      <section className="py-20 bg-canvas-surface border-b border-loom-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-gold-700 block mb-1">
                Loom-Fresh Arrivals
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon">
                Master Pit-Loom Creations
              </h2>
              <p className="text-sm text-loom-bronze mt-2 max-w-xl">
                Individually woven over 4 to 22 days by master artisan families in Dharmavaram. Once sold, identical re-weaves require up to 3 weeks on the loom.
              </p>
            </div>

            <Link
              href="/collections/all"
              className="mt-4 md:mt-0 px-5 py-2.5 rounded-lg bg-maroon text-canvas hover:bg-maroon-700 text-xs font-semibold tracking-wide transition-all shadow-sm flex items-center gap-2 group w-fit"
            >
              <span>View Full 12-Saree Catalog</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-gold-400" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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

      {/* Dharmavaram FAQ Section */}
      <section className="py-20 bg-canvas-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-gold-700 block mb-1">
              Frequently Asked Questions
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon">
              Handloom Integrity & Ordering Guide
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="p-5 sm:p-6 rounded-xl bg-canvas border border-loom-border/80 shadow-sm"
              >
                <h3 className="font-serif font-bold text-base sm:text-lg text-maroon">
                  {faq.q}
                </h3>
                <p className="text-xs sm:text-sm text-loom-bronze mt-2 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

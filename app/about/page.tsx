import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  Award,
  Video,
  Truck,
  HeartHandshake,
  Scissors,
  ArrowRight,
  Phone,
} from "lucide-react";
import { MERCHANT_CONFIG } from "@/lib/config";

export const metadata = {
  title: "About Our Heritage Looms | Dharmavaram Handloom Silk Looms",
  description:
    "Discover the 50-year legacy of Dharmavaram master pit-looms. 100% Silk Mark certified pure mulberry silk, direct from artisan weavers since 1974.",
};

export default function AboutPage() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen text-loom-charcoal">
      {/* Hero Editorial Banner */}
      <section className="relative py-16 sm:py-24 bg-[#24060E] text-[#FAF7F2] overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay">
          <Image
            src="/images/heritage-loom.jpg"
            alt="Dharmavaram pit loom heritage background"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E5B842]/15 border border-[#E5B842]/40 text-[#E5B842] text-xs font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Silk City of South India • Estd. {MERCHANT_CONFIG.ESTABLISHED_YEAR}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F5EFE6] leading-tight">
            Fifty Years of Pure Silk Heritage & Master Pit-Loom Artistry
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#D4C3A3] font-light leading-relaxed pt-2">
            Directly from the historic weaver clusters of Kothapeta in Dharmavaram, Sri Sathya Sai District.
            We bring genuine double-shuttle Korvai sarees from master pit-looms straight to your wardrobe—with zero showroom markups.
          </p>
        </div>
      </section>

      {/* Main Story & Craft Section */}
      <section className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: Authentic Loom Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white aspect-[4/5] bg-stone-200">
              <Image
                src="/images/weaving-loom.jpg"
                alt="Master artisan weaving Dharmavaram silk on pit-loom"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#24060E]/90 via-[#24060E]/50 to-transparent p-5 text-white">
                <span className="text-xs uppercase tracking-wider text-[#E5B842] font-semibold block">
                  Authentic Pit-Loom Weaving
                </span>
                <p className="text-xs text-stone-200 mt-1">
                  Each heirloom bridal saree requires 18 to 24 continuous days of synchronized manual pedal and shuttle work.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold tracking-widest uppercase text-[#8B263E]">
                The Dharmavaram Difference
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#5B1020] leading-snug">
                Where Vijayanagara Royal Motifs Meet Central Silk Board Purity
              </h2>
            </div>

            <p className="text-sm sm:text-base leading-relaxed text-loom-charcoal/85">
              Dharmavaram sarees have held a revered place in Indian bridal trousseaus for generations.
              Distinguished by their heavy, rich pallus, contrast broad borders, and signature temple motifs inspired by Lepakshi and Vijayanagara royal architecture, our sarees are crafted with pure high-denier mulberry silk yarn.
            </p>

            <p className="text-sm sm:text-base leading-relaxed text-loom-charcoal/85">
              Unlike mass-manufactured powerloom imitations, every authentic pit-loom weave maintains natural breathability, heirloom drape weight (typically 750g to 950g for bridal collections), and tested antique zari that retains its luster for decades.
            </p>

            {/* 3 Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-white border border-loom-border/80 shadow-2xs">
                <Award className="w-5 h-5 text-[#8B263E] mb-2" />
                <h3 className="font-serif font-bold text-sm text-[#5B1020]">Silk Mark Certified</h3>
                <p className="text-xs text-loom-charcoal/70 mt-1">
                  100% pure silk backed by Central Silk Board QR tags.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-loom-border/80 shadow-2xs">
                <HeartHandshake className="w-5 h-5 text-[#8B263E] mb-2" />
                <h3 className="font-serif font-bold text-sm text-[#5B1020]">Zero Showroom Cut</h3>
                <p className="text-xs text-loom-charcoal/70 mt-1">
                  Direct loom prices. 100% fair wages paid to weaver families.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-loom-border/80 shadow-2xs">
                <Video className="w-5 h-5 text-[#8B263E] mb-2" />
                <h3 className="font-serif font-bold text-sm text-[#5B1020]">Live Video Inspection</h3>
                <p className="text-xs text-loom-charcoal/70 mt-1">
                  Inspect the saree live on WhatsApp before we pack and ship.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Economics / Transparency Highlight */}
      <section className="bg-[#FAF3E8] border-y border-loom-border/70 py-16">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold tracking-widest uppercase text-[#8B263E]">
              Ethical Weaver-to-Wardrobe
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#5B1020] mt-1">
              Why Our Direct-Loom Sarees Cost 30% to 45% Less
            </h2>
            <p className="text-xs sm:text-sm text-loom-charcoal/70 mt-2">
              Metro retail showrooms carry heavy overheads: prime commercial rent, multi-tiered distributor margins, and seasonal marketing.
              By purchasing directly from our guild, you bypass all middlemen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                Traditional Metro Showroom
              </span>
              <div className="text-2xl font-serif font-bold text-stone-700">₹18,500 – ₹25,000</div>
              <ul className="text-xs space-y-2 text-stone-600">
                <li className="flex items-center gap-2">
                  <span className="text-red-500">✕</span> High prime street rental & mall maintenance
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">✕</span> 3-tier distributor and wholesale agent markups
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">✕</span> Delayed payments to the actual weaver families
                </li>
              </ul>
            </div>

            <div className="bg-[#24060E] text-white rounded-2xl p-6 border border-[#E5B842]/40 shadow-lg space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#E5B842] block">
                Direct From SSVSS Pit-Looms
              </span>
              <div className="text-2xl font-serif font-bold text-[#E5B842]">₹12,500 – ₹16,800</div>
              <ul className="text-xs space-y-2 text-[#D4C3A3]">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> 100% fair and immediate compensation to artisan
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Official Silk Mark tag & tested antique zari verification
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Free insured all-India express delivery within 2–4 days
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Actions */}
      <section className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16 py-16 text-center space-y-6">
        <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#5B1020]">
          Ready to Experience Authentic Dharmavaram Craftsmanship?
        </h2>
        <p className="text-sm text-loom-charcoal/80 max-w-xl mx-auto">
          Explore our handcrafted bridal heirlooms, festival pure silk drapes, or speak with our master artisans directly.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/collections/handloom-bridal"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#5B1020] text-[#FAF7F2] hover:bg-[#3D0A15] transition-all font-semibold text-xs tracking-wider uppercase shadow-md"
          >
            <span>Explore Bridal Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/collections/all"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#5B1020] border border-[#5B1020]/40 hover:bg-[#FAF3E8] transition-all font-semibold text-xs tracking-wider uppercase shadow-sm"
          >
            <span>View All Sarees</span>
          </Link>

          <a
            href={`https://wa.me/${MERCHANT_CONFIG.WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#128C7E] text-white hover:bg-[#075E54] transition-all font-semibold text-xs tracking-wider uppercase shadow-md"
          >
            <Phone className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </section>
    </div>
  );
}

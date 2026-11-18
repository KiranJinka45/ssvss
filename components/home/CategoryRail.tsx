import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Flame, Building2 } from "lucide-react";

export function CategoryRail() {
  const categories = [
    {
      title: "Semi-Silk Festive",
      slug: "semi-silk",
      anchorPrice: "Showroom: ₹4,800",
      loomPrice: "Direct Loom: ₹3,200",
      description: "High-velocity 580g wrinkle-resistant festive drapes with tested antique gold zari.",
      badge: "High-Velocity SKU",
      icon: Flame,
      image: "/images/sarees/semi-01.jpg",
    },
    {
      title: "Pure Mulberry Silk",
      slug: "pure-silk",
      anchorPrice: "Showroom: ₹18,500",
      loomPrice: "Direct Loom: ₹12,500",
      description: "Central Silk Board Silk Mark certified 740g pure pit-loom weaves with Korvai temple borders.",
      badge: "Silk Mark Certified",
      icon: ShieldCheck,
      image: "/images/sarees/pure-01.jpg",
    },
    {
      title: "Handloom Bridal Heirloom",
      slug: "handloom-bridal",
      anchorPrice: "Showroom: ₹25,500+",
      loomPrice: "Direct Loom: ₹16,000+",
      description: "Limited single-loom weaves (18-24 days on pit-loom) with heavy 3G pure gold zari.",
      badge: "Master Pit-Loom",
      icon: Sparkles,
      image: "/images/sarees/handloom-01.jpg",
    },
    {
      title: "B2B Boutique Wholesale",
      slug: "wholesale",
      anchorPrice: "Tier Discounts up to 32%",
      loomPrice: "MOQ: 10, 25 & 50 Sarees",
      description: "Passcode-gated portal for boutique owners with GSTIN capture & direct NEFT proforma.",
      badge: "B2B Portal",
      icon: Building2,
      isWholesale: true,
      image: "/images/sarees/pure-02.jpg",
    },
  ];

  return (
    <section className="py-20 bg-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-gold-700 block mb-1">
              Curated Weaving Tiers
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon">
              Explore Our Dharmavaram Loom Collections
            </h2>
            <p className="text-sm text-loom-bronze mt-2 max-w-xl">
              From high-velocity festive semi-silk to once-in-a-generation bridal heirloom weaves, every saree is priced transparently direct from our pit-looms.
            </p>
          </div>
          <Link
            href="/collections/all"
            className="mt-4 md:mt-0 text-sm font-semibold text-maroon hover:text-maroon-700 flex items-center gap-1.5 transition-colors group"
          >
            <span>View All 12 Looms</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const targetUrl = cat.isWholesale ? "/wholesale" : `/collections/${cat.slug}`;

            return (
              <Link
                key={cat.title}
                href={targetUrl}
                className="group relative flex flex-col rounded-2xl overflow-hidden bg-canvas-card border border-loom-border/80 shadow-luxury hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image Aspect Box */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-canvas-surface">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-maroon-900/80 via-maroon-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Badge */}
                  <div className="absolute top-3.5 left-3.5 bg-canvas/95 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider text-maroon uppercase flex items-center gap-1 shadow-sm">
                    <Icon className="w-3 h-3 text-gold" />
                    <span>{cat.badge}</span>
                  </div>

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 text-canvas">
                    <span className="block text-[11px] text-canvas/75 line-through">{cat.anchorPrice}</span>
                    <span className="block text-lg font-bold text-gold-400 font-serif">{cat.loomPrice}</span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-maroon group-hover:text-gold-700 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-loom-bronze mt-1 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-loom-border/60 flex items-center justify-between text-xs font-semibold text-maroon">
                    <span>{cat.isWholesale ? "Unlock Wholesale Tiers" : "Browse Weaves"}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

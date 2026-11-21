"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DEFAULT_CATEGORY_TIERS, DEFAULT_COLLECTION_METAS, CategoryTier } from "@/lib/collectionsStore";

export function CategoryRail() {
  const [categories, setCategories] = useState<CategoryTier[]>(DEFAULT_CATEGORY_TIERS);
  const [meta, setMeta] = useState(DEFAULT_COLLECTION_METAS.categoryRail);

  useEffect(() => {
    try {
      const savedTiers = localStorage.getItem("loom_category_tiers");
      if (savedTiers) {
        setCategories(JSON.parse(savedTiers));
      }
      const savedMeta = localStorage.getItem("loom_category_rail_meta");
      if (savedMeta) {
        setMeta(JSON.parse(savedMeta));
      }
    } catch {}
  }, []);

  return (
    <section className="pt-3 sm:pt-4 pb-6 sm:pb-8 bg-canvas overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-3 sm:mb-4">
          <div>
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold text-gold-700 block mb-0.5">
              {meta.eyebrow}
            </span>
            <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-maroon">
              {meta.title}
            </h2>
            <p className="text-xs text-loom-bronze mt-0.5 max-w-2xl line-clamp-1">
              {meta.subtitle}
            </p>
          </div>
          <Link
            href="/collections/all"
            className="mt-2 md:mt-0 text-xs font-semibold text-maroon hover:text-maroon-700 flex items-center gap-1.5 transition-colors group shrink-0"
          >
            <span>View All 12 Looms</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 xl:gap-5">
          {categories.map((cat) => {
            const targetUrl = cat.isWholesale ? "/wholesale" : `/collections/${cat.slug}`;

            return (
              <Link
                key={cat.title}
                href={targetUrl}
                className="group relative flex flex-col rounded-xl overflow-hidden bg-canvas-card border border-loom-border/80 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                {/* Image Aspect Box - streamlined aspect-[16/10] so cards fit cleanly on 1 screen */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-canvas-surface">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-maroon-900/80 via-maroon-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Discount % Badge in top of image */}
                  <div className="absolute top-2 left-2 bg-[#5B1020] text-[#FAF7F2] border border-[#C59B27]/70 shadow-xs px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
                    <span>{cat.discountBadge}</span>
                  </div>

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-2 left-2.5 right-2.5 text-canvas">
                    <span className="block text-[9px] text-canvas/75 line-through">{cat.anchorPrice}</span>
                    <span className="block text-sm sm:text-base font-bold text-gold-400 font-serif leading-tight">{cat.loomPrice}</span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-maroon group-hover:text-gold-700 transition-colors line-clamp-1">
                      {cat.title}
                    </h3>
                    <p className="text-[11px] text-loom-bronze mt-0.5 leading-snug line-clamp-1">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-2 pt-2 border-t border-loom-border/60 flex items-center justify-between text-[11px] font-semibold text-maroon">
                    <span>{cat.isWholesale ? "Unlock Wholesale Tiers" : "Browse Weaves"}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
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

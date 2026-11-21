"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { SareeSKU } from "@/data/catalog";
import {
  DEFAULT_COLLECTION_METAS,
  DEFAULT_MASTER_CREATIONS_SKUS,
  getAllMergedSarees,
} from "@/lib/collectionsStore";

export function MasterCreationsRail() {
  const [meta, setMeta] = useState(DEFAULT_COLLECTION_METAS.masterCreations);
  const [sarees, setSarees] = useState<SareeSKU[]>([]);

  useEffect(() => {
    try {
      // 1. Load custom meta if edited by admin
      const savedMeta = localStorage.getItem("loom_master_creations_meta");
      if (savedMeta) {
        setMeta(JSON.parse(savedMeta));
      }

      // 2. Load all merged sarees (CATALOG + custom products from admin)
      const allSarees = getAllMergedSarees();

      // 3. Find custom products specifically marked by admin to show in Master Creations
      const customPicks = allSarees.filter((s) => s.showInMasterCreations);

      // 4. Load configured showcase SKUs (or defaults)
      const savedSkusStr = localStorage.getItem("loom_master_creations_skus");
      const targetSkus: string[] = savedSkusStr
        ? JSON.parse(savedSkusStr)
        : DEFAULT_MASTER_CREATIONS_SKUS;

      // Map SKUs to sarees
      const catalogPicks = targetSkus
        .map((sku) => allSarees.find((s) => s.sku.toUpperCase() === sku.toUpperCase()))
        .filter((s): s is SareeSKU => Boolean(s));

      // Combine custom picks at front + catalog picks, deduplicated by SKU, slice to 6
      const combinedMap = new Map<string, SareeSKU>();
      customPicks.forEach((item) => combinedMap.set(item.sku.toUpperCase(), item));
      catalogPicks.forEach((item) => {
        if (!combinedMap.has(item.sku.toUpperCase())) {
          combinedMap.set(item.sku.toUpperCase(), item);
        }
      });

      const finalSarees = Array.from(combinedMap.values()).slice(0, 6);

      // Fallback if empty
      if (finalSarees.length > 0) {
        setSarees(finalSarees);
      } else {
        setSarees(allSarees.slice(0, 6));
      }
    } catch {
      // Fallback on SSR/error
      const all = getAllMergedSarees();
      setSarees(all.slice(0, 6));
    }
  }, []);

  return (
    <section className="py-8 sm:py-12 bg-canvas-surface border-b border-loom-border/60 overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-gold-700 block mb-1">
              {meta.eyebrow}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-maroon">
              {meta.title}
            </h2>
            <p className="text-xs sm:text-sm text-loom-bronze mt-1 max-w-2xl">
              {meta.subtitle}
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 xl:gap-5">
          {sarees.map((saree) => (
            <ProductCard key={saree.id} saree={saree} />
          ))}
        </div>
      </div>
    </section>
  );
}

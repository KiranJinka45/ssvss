"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, MessageCircle, Eye, Check } from "lucide-react";
import { SareeSKU } from "@/data/catalog";
import { formatINR } from "@/lib/pricing";
import { generateOrderWhatsAppUrl } from "@/lib/whatsapp";
import { useCartStore } from "@/store/useCartStore";

interface ProductCardProps {
  saree: SareeSKU;
}

export function ProductCard({ saree }: ProductCardProps) {
  const [mounted, setMounted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { isInWishlist, toggleWishlist, addItem } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const wishlisted = mounted ? isInWishlist(saree.sku) : false;

  const savings = Math.max(0, saree.showroomPrice - saree.price);
  const savingsPercent = Math.round((savings / saree.showroomPrice) * 100);

  const quickWhatsAppUrl = generateOrderWhatsAppUrl({
    sku: saree.sku,
    title: saree.title,
    price: saree.price,
    selectedFinish: "Standard Unstitched Blouse Piece",
  });

  const isSoldOut = saree.stockStatus === "SOLD_OUT";
  const isWeaverHold = saree.stockStatus === "WEAVER_HOLD";

  return (
    <div className="group relative flex flex-col rounded-2xl bg-canvas border border-loom-border/80 shadow-luxury hover:shadow-2xl transition-all duration-300 overflow-hidden">
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-canvas-surface">
        <Link href={`/product/${saree.sku.toLowerCase()}`} className="block w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={saree.images[0]}
            alt={saree.title}
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-108"
          />
        </Link>

        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-maroon-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Discount % Badge in Top-Left */}
        {savingsPercent > 0 && (
          <div className="absolute top-2.5 left-2.5 bg-[#5B1020] text-[#FAF7F2] border border-[#C59B27]/70 shadow-md px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase z-10">
            <span>{savingsPercent}% OFF</span>
          </div>
        )}

        {/* Stock Status Badge if not in stock */}
        {isSoldOut && (
          <div className="absolute top-3 right-12 bg-loom-charcoal/90 text-canvas px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase">
            Sold Out
          </div>
        )}
        {isWeaverHold && (
          <div className="absolute top-3 right-12 bg-gold-700/95 text-canvas px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase">
            On Loom Hold
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(saree.sku);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
            wishlisted
              ? "bg-maroon text-canvas"
              : "bg-white/80 hover:bg-white text-loom-charcoal"
          }`}
          aria-label="Wishlist Saree"
        >
          <Heart className={`w-4 h-4 ${wishlisted ? "fill-canvas" : ""}`} />
        </button>

        {/* Quick View Button on Hover */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex gap-2">
          <Link
            href={`/product/${saree.sku.toLowerCase()}`}
            className="flex-1 py-2 px-3 rounded-lg bg-canvas/95 hover:bg-canvas text-maroon font-semibold text-xs tracking-wider uppercase text-center shadow-md flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Inspect Zari</span>
          </Link>
        </div>
      </div>

      {/* Card Content & Pricing */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-loom-stone mb-1 font-medium">
            <span>{saree.categoryName}</span>
            <span className="text-gold-700 font-semibold">{saree.silkWeightGrams}g Weight</span>
          </div>

          <Link href={`/product/${saree.sku.toLowerCase()}`}>
            <h3 className="font-serif font-bold text-base text-loom-charcoal group-hover:text-maroon transition-colors line-clamp-1">
              {saree.title}
            </h3>
          </Link>

          <p className="text-xs text-loom-bronze line-clamp-1 mt-1 font-light">
            {saree.colorName} • {saree.borderType}
          </p>
        </div>

        {/* Pricing & Value Comparison */}
        <div className="mt-4 pt-3 border-t border-loom-border/60">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-lg font-bold text-maroon font-serif">
                {formatINR(saree.price)}
              </span>
              <span className="text-xs text-loom-stone line-through ml-2">
                {formatINR(saree.showroomPrice)}
              </span>
            </div>
            <span className="text-[10px] font-bold text-silk-emerald bg-silk-emeraldBg px-2 py-0.5 rounded-full border border-silk-emerald/30">
              Save {savingsPercent}%
            </span>
          </div>

          {/* Action CTAs */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                addItem(saree, "Standard Unstitched Blouse", false);
                setIsAdded(true);
                setTimeout(() => setIsAdded(false), 2000);
              }}
              disabled={isSoldOut}
              className={`w-full py-2 px-2.5 rounded-lg border transition-all text-xs font-semibold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 active:scale-98 ${
                isAdded
                  ? "bg-emerald-700 border-emerald-700 text-white"
                  : "border-maroon text-maroon hover:bg-maroon hover:text-canvas"
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Added ✓</span>
                </>
              ) : (
                <span>Add to Bag</span>
              )}
            </button>

            <a
              href={quickWhatsAppUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 px-2.5 rounded-lg bg-silk-emerald hover:bg-emerald-800 text-canvas text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              title="Order directly on WhatsApp with 0% extra gateway fees"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-canvas" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

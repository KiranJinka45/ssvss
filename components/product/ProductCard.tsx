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
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-canvas-surface">
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
          <div className="absolute top-2.5 left-2.5 bg-[#5B1020] text-[#FAF7F2] border border-[#C59B27]/70 shadow-md px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold tracking-wider uppercase z-10">
            <span>{savingsPercent}% OFF</span>
          </div>
        )}

        {/* Stock Status Badge if not in stock */}
        {isSoldOut && (
          <div className="absolute top-2.5 right-12 bg-loom-charcoal/90 text-canvas px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold tracking-wider uppercase">
            Sold Out
          </div>
        )}
        {isWeaverHold && (
          <div className="absolute top-2.5 right-12 bg-gold-700/95 text-canvas px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold tracking-wider uppercase">
            On Loom Hold
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(saree.sku);
          }}
          className={`absolute top-2.5 right-2.5 p-1.5 sm:p-2 rounded-full backdrop-blur-md transition-colors ${
            wishlisted
              ? "bg-maroon text-canvas"
              : "bg-white/80 hover:bg-white text-loom-charcoal"
          }`}
          aria-label="Wishlist Saree"
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${wishlisted ? "fill-canvas" : ""}`} />
        </button>

        {/* Quick View Eye Icon on Hover (Text removed as requested) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <Link
            href={`/product/${saree.sku.toLowerCase()}`}
            className="pointer-events-auto p-2.5 rounded-full bg-canvas/95 hover:bg-canvas text-maroon shadow-luxury hover:scale-110 transition-transform flex items-center justify-center border border-loom-border/60"
            aria-label="View Saree Details"
            title="View Details"
          >
            <Eye className="w-5 h-5 text-maroon" />
          </Link>
        </div>
      </div>

      {/* Card Content & Pricing */}
      <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[10px] text-loom-stone mb-1 font-medium">
            <span className="truncate">{saree.categoryName}</span>
            <span className="text-gold-700 font-semibold shrink-0 ml-1">{saree.silkWeightGrams}g</span>
          </div>

          <Link href={`/product/${saree.sku.toLowerCase()}`}>
            <h3 className="font-serif font-bold text-xs sm:text-sm text-loom-charcoal group-hover:text-maroon transition-colors line-clamp-1">
              {saree.title}
            </h3>
          </Link>

          <p className="text-[10px] sm:text-[11px] text-loom-bronze line-clamp-1 mt-0.5 font-light">
            {saree.colorName} • {saree.borderType}
          </p>
        </div>

        {/* Pricing & Value Comparison */}
        <div className="mt-2 pt-2 border-t border-loom-border/60">
          <div className="flex items-baseline justify-between gap-1">
            <div className="truncate">
              <span className="text-sm sm:text-base font-bold text-maroon font-serif">
                {formatINR(saree.price)}
              </span>
              <span className="text-[10px] sm:text-[11px] text-loom-stone line-through ml-1.5">
                {formatINR(saree.showroomPrice)}
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-bold text-silk-emerald bg-silk-emeraldBg px-1.5 py-0.5 rounded-full border border-silk-emerald/30 shrink-0">
              Save {savingsPercent}%
            </span>
          </div>

          {/* Action CTAs */}
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            <button
              onClick={(e) => {
                e.preventDefault();
                addItem(saree, "Standard Unstitched Blouse", false);
                setIsAdded(true);
                setTimeout(() => setIsAdded(false), 2000);
              }}
              disabled={isSoldOut}
              className={`w-full py-1.5 px-1.5 rounded-md border transition-all text-[11px] font-semibold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 active:scale-98 ${
                isAdded
                  ? "bg-emerald-700 border-emerald-700 text-white"
                  : "border-maroon text-maroon hover:bg-maroon hover:text-canvas"
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3 h-3 text-white" />
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
              className="w-full py-1.5 px-1.5 rounded-md bg-silk-emerald hover:bg-emerald-800 text-canvas text-[11px] font-semibold tracking-wide transition-colors flex items-center justify-center gap-1 shadow-sm truncate"
              title="Order directly on WhatsApp with 0% extra gateway fees"
            >
              <MessageCircle className="w-3 h-3 fill-canvas shrink-0" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

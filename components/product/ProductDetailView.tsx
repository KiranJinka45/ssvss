"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  MessageCircle,
  Check,
  Truck,
  ArrowLeft,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { SareeSKU } from "@/data/catalog";
import { useCartStore } from "@/store/useCartStore";
import { MERCHANT_CONFIG } from "@/lib/config";

interface ProductDetailViewProps {
  saree: SareeSKU;
  similarSarees: SareeSKU[];
}

export function ProductDetailView({ saree, similarSarees }: ProductDetailViewProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);
  const { addItem } = useCartStore();

  const images = saree.images && saree.images.length > 0 ? saree.images : ["/images/sarees/pure-01.jpg"];
  const activeImage = images[selectedImageIndex] || images[0];

  const savings = Math.max(0, saree.showroomPrice - saree.price);
  const savingsPercent = Math.round((savings / saree.showroomPrice) * 100);

  const incrementQty = () => setQuantity((prev) => Math.min(prev + 1, saree.stockCount || 10));
  const decrementQty = () => setQuantity((prev) => Math.max(prev - 1, 1));

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(saree, "Standard Unstitched Blouse", false);
    }
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  // WhatsApp instant order message
  const whatsappUrl = `https://wa.me/${MERCHANT_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello Dharmavaram Silk Looms, I want to order this saree:\n\n*Product:* ${saree.title}\n*SKU:* ${saree.sku}\n*Fabric:* ${saree.fabric}\n*Color:* ${saree.colorName}\n*Price:* ₹${saree.price.toLocaleString("en-IN")}\n*Quantity:* ${quantity}\n\nPlease share payment details and dispatch confirmation.`
  )}`;

  return (
    <div className="min-h-screen bg-[#0C0C0E] text-[#F5EFE6] pt-4 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href={`/collections/${saree.category}`}
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#E5B842] transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Collection</span>
          </Link>
        </div>

        {/* 2-Column Product Detail Layout (Matching Pushpalatha Silks Reference) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN: Clean Large Image Showcase + Thumbnails */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Image Card */}
            <div className="relative rounded-2xl overflow-hidden bg-[#18181B] border border-white/10 shadow-2xl flex items-center justify-center p-3 sm:p-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeImage}
                alt={saree.title}
                className="w-full h-auto max-h-[580px] object-contain rounded-xl"
              />
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      idx === selectedImageIndex
                        ? "border-[#E5B842] scale-102 shadow-md"
                        : "border-white/15 opacity-60 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`${saree.title} view ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Product Details & Buying Actions */}
          <div className="lg:col-span-6 space-y-5">
            {/* Tag & Title */}
            <div>
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#D4AF37] block mb-1">
                DHARMAVARAM
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F5EFE6] leading-snug">
                {saree.title}
              </h1>
            </div>

            {/* Price & Savings Row (Exact Pushpalatha Silks Style) */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-bold text-[#FBBF24]">
                  ₹{saree.price.toLocaleString("en-IN")}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  M.R.P: ₹{saree.showroomPrice.toLocaleString("en-IN")}
                </span>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2.5 py-0.5 rounded">
                  {savingsPercent}% OFF Special Deal
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>Save ₹{savings.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#FBBF24] pt-1">
                <Truck className="w-4 h-4" />
                <span>FREE delivery within 2–4 days</span>
              </div>
            </div>

            {/* Clean Description Box */}
            <div className="p-4 rounded-xl bg-[#18181B] border border-white/10 text-xs sm:text-sm text-gray-300 leading-relaxed font-sans">
              <p className="mb-2">{saree.description}</p>
              <p className="text-xs text-gray-400 font-mono">
                Authentic Dharmavaram Pit-Loom Weave • Tested Antique Zari • Matching Blouse Piece Included • Live Video Inspection Available on WhatsApp
              </p>
            </div>

            {/* Specification Grid (FABRIC | COLOR - Exact Pushpalatha Box) */}
            <div className="rounded-xl border border-white/15 bg-[#18181B]/80 p-3.5 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-0.5">
                  FABRIC
                </span>
                <span className="font-semibold text-[#F5EFE6] text-sm">
                  {saree.fabric}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-0.5">
                  COLOR
                </span>
                <span className="font-semibold text-[#F5EFE6] text-sm">
                  {saree.colorName}
                </span>
              </div>
            </div>

            {/* Quantity Stepper & In-Stock Indicator */}
            <div className="flex items-center gap-4 pt-1">
              <div className="inline-flex items-center rounded-lg border border-white/20 bg-[#18181B] px-3 py-1.5 text-sm text-white">
                <button
                  type="button"
                  onClick={decrementQty}
                  className="px-2 py-0.5 text-gray-400 hover:text-[#FBBF24] transition-colors text-base"
                >
                  -
                </button>
                <span className="px-4 font-semibold text-white">{quantity}</span>
                <button
                  type="button"
                  onClick={incrementQty}
                  className="px-2 py-0.5 text-gray-400 hover:text-[#FBBF24] transition-colors text-base"
                >
                  +
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <Check className="w-4 h-4" />
                <span>IN STOCK</span>
              </div>
            </div>

            {/* Action Buttons: ADD TO CART (Gold) + BUY ON WHATSAPP (Green) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-3.5 px-6 rounded-lg bg-[#E5B842] hover:bg-[#D4A732] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ADD TO CART</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-6 rounded-lg bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>BUY ON WHATSAPP</span>
              </a>
            </div>

            {/* Added to cart toast message */}
            {addedToast && (
              <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs text-center font-medium animate-fadeIn">
                ✓ Added {quantity} saree(s) to your Cart!
              </div>
            )}
          </div>
        </div>

        {/* Similar / Related Weaves Section */}
        {similarSarees.length > 0 && (
          <div className="mt-20 pt-10 border-t border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs uppercase tracking-widest font-semibold text-[#D4AF37] block">
                  More From This Loom
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#F5EFE6] mt-0.5">
                  Related Handloom Sarees
                </h3>
              </div>
              <Link
                href={`/collections/${saree.category}`}
                className="text-xs font-semibold text-[#E5B842] hover:underline flex items-center gap-1"
              >
                <span>View Collection</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {similarSarees.map((item) => (
                <Link
                  key={item.id}
                  href={`/product/${item.sku.toLowerCase()}`}
                  className="group rounded-2xl bg-[#18181B] border border-white/10 overflow-hidden hover:border-[#E5B842]/50 transition-all hover:scale-101 shadow-lg"
                >
                  <div className="aspect-[4/5] bg-black/40 overflow-hidden flex items-center justify-center p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-contain rounded-xl group-hover:scale-103 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] block">
                      DHARMAVARAM
                    </span>
                    <h4 className="font-serif text-base font-bold text-[#F5EFE6] truncate group-hover:text-[#E5B842] transition-colors">
                      {item.title}
                    </h4>
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="font-bold text-lg text-[#FBBF24]">
                        ₹{item.price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        ₹{item.showroomPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating WhatsApp Quick Action Button (Matching Reference) */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      >
        <MessageCircle className="w-7 h-7 fill-white" />
      </a>
    </div>
  );
}
"use client";

import React, { useState } from "react";
import {
  MessageCircle,
  Video,
  ShoppingBag,
  Check,
  ShieldCheck,
  Sparkles,
  Award,
} from "lucide-react";
import { SareeSKU } from "@/data/catalog";
import { formatINR } from "@/lib/pricing";
import { generateOrderWhatsAppUrl } from "@/lib/whatsapp";
import { useCartStore, CartItem } from "@/store/useCartStore";
import { LiveCallModal } from "@/components/product/LiveCallModal";
import { MERCHANT_CONFIG } from "@/lib/config";

interface ProductInteractiveActionsProps {
  saree: SareeSKU;
}

export function ProductInteractiveActions({ saree }: ProductInteractiveActionsProps) {
  const [selectedFinish, setSelectedFinish] =
    useState<CartItem["finishOption"]>("Standard Unstitched Blouse");
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const { addItem } = useCartStore();

  const finishPrices: Record<CartItem["finishOption"], number> = {
    "Standard Unstitched Blouse": 0,
    "Add Fall & Pico (+₹200)": 200,
    "Bridal Tassels & Fall-Pico (+₹450)": 450,
  };

  const currentPrice = saree.price + finishPrices[selectedFinish];

  const whatsappOrderUrl = generateOrderWhatsAppUrl({
    sku: saree.sku,
    title: saree.title,
    price: currentPrice,
    selectedFinish,
  });

  const isSoldOut = saree.stockStatus === "SOLD_OUT";

  const handleAddToCart = () => {
    addItem(saree, selectedFinish, false);
  };

  return (
    <div className="space-y-6 pt-4 border-t border-loom-border/80">
      {/* Finish Options Selector */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-loom-charcoal mb-2">
          Select Saree Edge & Blouse Finish:
        </label>
        <div className="space-y-2">
          {(
            [
              "Standard Unstitched Blouse",
              "Add Fall & Pico (+₹200)",
              "Bridal Tassels & Fall-Pico (+₹450)",
            ] as CartItem["finishOption"][]
          ).map((opt) => {
            const isSelected = selectedFinish === opt;
            const extra = finishPrices[opt];
            return (
              <button
                key={opt}
                type="button"
                onClick={() => setSelectedFinish(opt)}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                  isSelected
                    ? "border-maroon bg-maroon-50/60 font-semibold text-maroon shadow-sm"
                    : "border-loom-border bg-white text-loom-charcoal hover:border-gold"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? "border-maroon bg-maroon text-canvas"
                        : "border-loom-stone"
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5" />}
                  </div>
                  <span>{opt}</span>
                </div>
                <span className="font-mono text-loom-stone">
                  {extra === 0 ? "Free" : `+${formatINR(extra)}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Funnel Action Buttons */}
      <div className="space-y-3">
        {/* WhatsApp 0% Gateway Fee Instant Order */}
        <a
          href={isSoldOut ? undefined : whatsappOrderUrl}
          target="_blank"
          rel="noreferrer"
          className={`w-full py-4 px-6 rounded-xl bg-silk-emerald hover:bg-emerald-800 text-canvas font-bold text-sm sm:text-base tracking-wide shadow-lg transition-all flex items-center justify-center gap-2.5 group ${
            isSoldOut ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
          }`}
        >
          <MessageCircle className="w-5 h-5 fill-canvas group-hover:scale-110 transition-transform" />
          <span>Order on WhatsApp — {formatINR(currentPrice)}</span>
        </a>

        {/* 2-Minute Live Loom Video Call */}
        <button
          type="button"
          onClick={() => setIsVideoModalOpen(true)}
          className="w-full py-3.5 px-5 rounded-xl bg-canvas-surface hover:bg-gold-50 border border-gold/60 text-maroon font-semibold text-xs sm:text-sm tracking-wide transition-all flex items-center justify-center gap-2 group shadow-sm"
        >
          <Video className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
          <span>Book 2-Minute Live Loom Video Call</span>
        </button>

        {/* Add to Bag (For multi-saree orders) */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isSoldOut}
          className="w-full py-3 px-4 rounded-xl border border-maroon text-maroon hover:bg-maroon hover:text-canvas font-semibold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{isSoldOut ? "Sold Out on Loom" : "Add to Bag"}</span>
        </button>
      </div>

      {/* Official Merchant Authenticity & Compliance Trust Block */}
      <div className="p-4 rounded-2xl bg-canvas-surface border border-loom-border/80 text-xs text-loom-stone space-y-2">
        <div className="flex items-center justify-between pb-2 border-b border-loom-border/60">
          <span className="font-serif font-bold text-maroon flex items-center gap-1.5 text-xs">
            <Award className="w-4 h-4 text-gold" />
            Direct from Dharmavaram Pit-Looms
          </span>
          <span className="text-[10px] font-bold text-silk-emerald bg-silk-emeraldBg px-2 py-0.5 rounded border border-silk-emerald/30">
            0% Gateway Fee via UPI
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
          <div>
            <span className="text-loom-stone block text-[10px]">Official GSTIN:</span>
            <span className="font-mono font-semibold text-loom-charcoal">{MERCHANT_CONFIG.GSTIN}</span>
          </div>
          <div>
            <span className="text-loom-stone block text-[10px]">Silk Mark Authorized ID:</span>
            <span className="font-mono font-semibold text-loom-charcoal">{MERCHANT_CONFIG.SILK_MARK_ID}</span>
          </div>
        </div>

        <p className="text-[11px] text-loom-bronze pt-1 leading-relaxed">
          ⚡ <strong>Payment Details:</strong> Direct Business UPI ({MERCHANT_CONFIG.UPI_ID} - {MERCHANT_CONFIG.UPI_PAYEE_NAME}). Dispatched within 24 hours with tamper-proof packaging & official tax invoice.
        </p>
      </div>

      {/* Mobile Sticky Bottom Floating Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-canvas/95 backdrop-blur-md border-t border-loom-border p-3 shadow-2xl flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsVideoModalOpen(true)}
          className="flex-1 py-3 px-2 rounded-lg bg-canvas border border-gold/70 text-maroon font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Video className="w-3.5 h-3.5 text-gold" />
          <span>Live Call</span>
        </button>

        <a
          href={isSoldOut ? undefined : whatsappOrderUrl}
          target="_blank"
          rel="noreferrer"
          className={`flex-[2] py-3 px-3 rounded-lg bg-silk-emerald text-canvas font-bold text-xs flex items-center justify-center gap-1.5 shadow-md ${
            isSoldOut ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <MessageCircle className="w-4 h-4 fill-canvas" />
          <span>Order on WA • {formatINR(currentPrice)}</span>
        </a>
      </div>

      {/* Live Video Call Modal */}
      <LiveCallModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        defaultSku={saree.sku}
        defaultTitle={saree.title}
        defaultPrice={currentPrice}
      />
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  MessageCircle,
  CreditCard,
  Building2,
  Sparkles,
  ArrowRight,
  User,
} from "lucide-react";
import { useCartStore, CartItem } from "@/store/useCartStore";
import { formatINR, getB2BTier, B2B_TIERS } from "@/lib/pricing";
import { cleanPhoneNumber } from "@/lib/whatsapp";
import { MERCHANT_CONFIG } from "@/lib/config";

export function CartDrawer() {
  const pathname = usePathname();
  const [customerName, setCustomerName] = useState("");
  const [city, setCity] = useState("");

  const {
    items,
    isCartOpen,
    closeCart,
    removeItem,
    updateQuantity,
    updateFinish,
    clearCart,
    getTotalItemsCount,
    getSubtotal,
    getTotalSavings,
    getGrandTotal,
    isB2BMode,
  } = useCartStore();

  // Rules of Hooks: Do not return before hooks are initialized
  if (pathname?.startsWith("/admin") || !isCartOpen) {
    return null;
  }

  const totalCount = getTotalItemsCount();
  const subtotal = getSubtotal();
  const totalSavings = getTotalSavings();
  const grandTotal = getGrandTotal();

  // B2B Tier check
  const activeB2BTier = getB2BTier(totalCount);
  const nextTier =
    totalCount < 10
      ? B2B_TIERS[0]
      : totalCount < 25
      ? B2B_TIERS[1]
      : totalCount < 50
      ? B2B_TIERS[2]
      : null;

  const unitsNeededForNextTier = nextTier ? nextTier.minUnits - totalCount : 0;

  // Build WhatsApp Multi-Item Checkout message
  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;

    const phone = cleanPhoneNumber(MERCHANT_CONFIG.WHATSAPP_NUMBER);
    const messageLines = [
      `🙏 *Namaste ${MERCHANT_CONFIG.BRAND_NAME}!*`,
      ``,
      `I would like to place an order directly from your pit-looms:`,
    ];

    if (customerName) messageLines.push(`✦ *Customer:* ${customerName} (${city || "India"})`);
    if (isB2BMode) messageLines.push(`✦ *Mode:* B2B Boutique Wholesale Tier`);

    messageLines.push(``, `*ORDER ITEMS (${totalCount} Sarees):*`);

    items.forEach((item, idx) => {
      messageLines.push(
        `${idx + 1}. *${item.saree.title}* (${item.saree.sku})`,
        `   Qty: ${item.quantity} | Finish: ${item.finishOption}`,
        `   Price: ${formatINR((item.saree.price + item.finishCost) * item.quantity)}`
      );
    });

    messageLines.push(
      ``,
      `✦ *Subtotal:* ${formatINR(subtotal)}`,
      `✦ *Estimated Total:* ${formatINR(grandTotal)} (Includes All-India Insured Dispatch & 5% GST)`,
      ``,
      `💳 *Payment:* Direct Business UPI (*${MERCHANT_CONFIG.UPI_ID}* - ${MERCHANT_CONFIG.UPI_PAYEE_NAME}) for 0% extra gateway charges.`,
      ``,
      `Please share your official Current Account UPI QR or Bank NEFT details so I can transfer and share my delivery address. Dhanyavadagalu!`
    );

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(messageLines.join("\n"))}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-loom-charcoal/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-canvas shadow-2xl flex flex-col border-l border-loom-border/80">
          {/* Header */}
          <div className="p-5 border-b border-loom-border/80 flex items-center justify-between bg-canvas-surface">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-maroon" />
              <h2 className="font-serif font-bold text-lg text-maroon">
                Your Silk Loom Bag
              </h2>
              <span className="text-xs bg-maroon text-canvas px-2 py-0.5 rounded-full font-bold">
                {totalCount}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={closeCart}
                className="p-1.5 text-loom-stone hover:text-maroon rounded-full hover:bg-canvas transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* B2B Tier Incentive Bar */}
          <div className="bg-gold-50 px-5 py-2.5 border-b border-gold/30 text-xs text-maroon font-medium flex items-center justify-between">
            {activeB2BTier ? (
              <span className="flex items-center gap-1.5 font-bold text-gold-700">
                <Sparkles className="w-4 h-4 text-gold" />
                {activeB2BTier.name} Active ({activeB2BTier.badge})
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-loom-bronze">
                <Building2 className="w-3.5 h-3.5 text-gold-700" />
                Add {unitsNeededForNextTier} more for Boutique Wholesale
              </span>
            )}
            <Link
              href="/wholesale"
              onClick={closeCart}
              className="text-[11px] underline font-bold text-maroon hover:text-gold-700"
            >
              Wholesale Info
            </Link>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-canvas-surface border border-loom-border flex items-center justify-center text-loom-stone">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-lg text-maroon">Your bag is empty</h3>
                <p className="text-xs text-loom-bronze max-w-xs">
                  Discover authentic pit-loom silk sarees direct from Dharmavaram weavers at zero showroom markup.
                </p>
                <Link
                  href="/collections/all"
                  onClick={closeCart}
                  className="mt-3 px-5 py-2.5 rounded-lg bg-maroon text-canvas text-xs font-semibold hover:bg-maroon-700 transition-colors shadow-sm"
                >
                  Explore Sarees
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.saree.sku}-${item.finishOption}`}
                  className="p-3.5 rounded-xl bg-canvas-card border border-loom-border/80 shadow-sm flex flex-col gap-3"
                >
                  <div className="flex gap-3.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.saree.images[0]}
                      alt={item.saree.title}
                      className="w-18 h-24 object-cover object-top rounded-lg bg-canvas-surface shrink-0 border border-loom-border/60"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-serif font-bold text-sm text-loom-charcoal truncate">
                          {item.saree.title}
                        </h4>
                        <button
                          onClick={() => removeItem(item.saree.sku)}
                          className="text-loom-stone hover:text-red-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-[11px] text-loom-stone font-mono block">
                        {item.saree.sku}
                      </span>

                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="font-bold text-maroon text-sm font-serif">
                          {formatINR(item.saree.price + item.finishCost)}
                        </span>
                        <span className="text-xs text-loom-stone line-through">
                          {formatINR(item.saree.showroomPrice)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Finish Option Dropdown */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-loom-stone tracking-wider mb-1">
                      Blouse & Edge Finishing:
                    </label>
                    <select
                      value={item.finishOption}
                      onChange={(e) =>
                        updateFinish(
                          item.saree.sku,
                          e.target.value as CartItem["finishOption"]
                        )
                      }
                      className="w-full px-2.5 py-1.5 rounded-md bg-canvas border border-loom-border text-xs text-loom-charcoal focus:outline-none focus:border-maroon"
                    >
                      <option value="Standard Unstitched Blouse">
                        Standard Unstitched Blouse Piece (Included)
                      </option>
                      <option value="Add Fall & Pico (+₹200)">
                        Hand-Stitched Fall & Pico (+₹200)
                      </option>
                      <option value="Bridal Tassels & Fall-Pico (+₹450)">
                        Hand-Tied Bridal Kuchu/Tassels + Fall-Pico (+₹450)
                      </option>
                    </select>
                  </div>

                  {/* Quantity Control */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-loom-stone">Quantity:</span>
                    <div className="flex items-center border border-loom-border rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => updateQuantity(item.saree.sku, item.quantity - 1)}
                        className="p-1.5 hover:bg-canvas-surface text-loom-charcoal transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-xs font-bold text-loom-charcoal">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.saree.sku, item.quantity + 1)}
                        className="p-1.5 hover:bg-canvas-surface text-loom-charcoal transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Controls */}
          {items.length > 0 && (
            <div className="p-5 border-t border-loom-border/80 bg-canvas-surface space-y-3.5">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Your Name (Optional)"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="px-2.5 py-1.5 rounded-md bg-white border border-loom-border text-xs"
                />
                <input
                  type="text"
                  placeholder="City / State"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="px-2.5 py-1.5 rounded-md bg-white border border-loom-border text-xs"
                />
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-loom-bronze pt-1">
                <div className="flex justify-between">
                  <span>Loom Base Subtotal</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-silk-emerald font-medium">
                  <span>Showroom Savings</span>
                  <span>- {formatINR(totalSavings)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-loom-stone">
                  <span>All-India Insured Dispatch & 5% GST</span>
                  <span className="font-semibold text-silk-emerald">FREE (Included)</span>
                </div>
                <div className="flex justify-between font-bold text-base text-maroon pt-2 border-t border-loom-border font-serif">
                  <span>Grand Total</span>
                  <span>{formatINR(grandTotal)}</span>
                </div>
              </div>

              {/* Primary Zero-Fee WhatsApp Checkout */}
              <button
                onClick={handleWhatsAppCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-silk-emerald hover:bg-emerald-800 text-canvas font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 group"
              >
                <MessageCircle className="w-4 h-4 fill-canvas" />
                <span>Order via WhatsApp (0% Extra Fee)</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="text-center">
                <button
                  onClick={clearCart}
                  className="text-[11px] text-loom-stone hover:text-red-600 transition-colors underline"
                >
                  Empty Bag
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

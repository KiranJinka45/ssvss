"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  Lock,
  Unlock,
  ShieldCheck,
  Sparkles,
  Calculator,
  MessageCircle,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { CATALOG, SareeCategory } from "@/data/catalog";
import {
  formatINR,
  B2B_TIERS,
  getB2BTier,
  calculateWholesaleQuote,
  FIXED_WHOLESALE_BASE_PRICES,
  FIXED_COGS,
} from "@/lib/pricing";
import { generateWholesaleWhatsAppUrl } from "@/lib/whatsapp";
import { MERCHANT_CONFIG } from "@/lib/config";

const DEMO_PASSCODE =
  process.env.NEXT_PUBLIC_WHOLESALE_PASSCODE || "DHARMAVARAM2027";

export function WholesalePortal() {
  const [passcode, setPasscode] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcodeError, setPasscodeError] = useState(false);

  // Wholesale order configuration
  const [selectedCategory, setSelectedCategory] =
    useState<SareeCategory>("pure-silk");
  const [selectedSku, setSelectedSku] = useState(CATALOG[4].sku);
  const [quantity, setQuantity] = useState(25);
  const [boutiqueName, setBoutiqueName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [gstin, setGstin] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const cached = sessionStorage.getItem("b2b_unlocked");
    if (cached === "true") {
      setIsUnlocked(true);
    }
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim().toUpperCase() === DEMO_PASSCODE.toUpperCase()) {
      setIsUnlocked(true);
      setPasscodeError(false);
      sessionStorage.setItem("b2b_unlocked", "true");
    } else {
      setPasscodeError(true);
    }
  };

  // Find target saree
  const targetSaree =
    CATALOG.find((s) => s.sku === selectedSku) || CATALOG[4];

  // Auto-sync category when SKU changes
  const handleSkuChange = (sku: string) => {
    setSelectedSku(sku);
    const found = CATALOG.find((s) => s.sku === sku);
    if (found) {
      setSelectedCategory(found.category);
    }
  };

  const quote = calculateWholesaleQuote(selectedCategory, quantity, targetSaree.price);
  const activeTier = getB2BTier(quantity);

  const handleSendQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity < 10) {
      alert("Minimum wholesale order is 10 sarees to qualify for direct-loom bulk rates.");
      return;
    }
    if (!boutiqueName || !contactPerson || !city) {
      alert("Please provide boutique name, contact person, and delivery city.");
      return;
    }

    setIsSubmitting(true);

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadType: "b2b_inquiry",
          boutique_name: boutiqueName,
          contact_person: contactPerson,
          phone: phone || "WhatsApp Direct",
          city,
          gstin: gstin || "Unregistered / In Process",
          estimated_moq: quantity,
          selected_tier: activeTier?.name || "Boutique Starter",
          estimated_value: quote.total,
          category: selectedCategory,
          selected_sku: selectedSku,
        }),
      });
    } catch (err) {
      console.warn("Lead API error:", err);
    }

    const whatsappUrl = generateWholesaleWhatsAppUrl({
      boutiqueName,
      contactPerson,
      city,
      gstin: gstin || undefined,
      quantity,
      tierName: activeTier?.name || "Tier 1 — Boutique Starter",
      estimatedTotal: quote.total,
    });

    setIsSubmitting(false);
    window.open(whatsappUrl, "_blank");
  };

  if (!isUnlocked) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 rounded-3xl bg-canvas-card border border-loom-border shadow-2xl text-center">
        <div className="w-16 h-16 rounded-full bg-gold/15 text-maroon mx-auto flex items-center justify-center mb-5">
          <Lock className="w-8 h-8 text-gold" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-gold-700 block">
          Restricted Commercial Portal
        </span>
        <h2 className="font-serif text-3xl font-bold text-maroon mt-1">
          B2B Boutique Wholesale Desk
        </h2>
        <p className="text-sm text-loom-bronze mt-2 leading-relaxed">
          Margin-protected direct pit-loom pricing for registered boutiques, bridal studios, and regional retail showrooms across India and worldwide.
        </p>

        <form onSubmit={handleUnlock} className="mt-8 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-loom-charcoal uppercase tracking-wider mb-2">
              Enter Boutique Access Passcode:
            </label>
            <input
              type="password"
              placeholder="Enter passcode (Demo: DHARMAVARAM2027)"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-canvas border border-loom-border text-center text-sm font-mono tracking-widest text-loom-charcoal focus:border-maroon focus:outline-none"
            />
            {passcodeError && (
              <p className="text-xs text-red-600 mt-2">
                Invalid passcode. Demo code: <strong>DHARMAVARAM2027</strong>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl bg-maroon hover:bg-maroon-700 text-canvas font-semibold text-sm tracking-wide shadow-luxury transition-all flex items-center justify-center gap-2"
          >
            <Unlock className="w-4 h-4 text-gold" />
            <span>Unlock Wholesale Desk</span>
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-loom-border/60 text-xs text-loom-stone flex items-center justify-center gap-2">
          <span>Need access for your store?</span>
          <a
            href={`https://wa.me/${MERCHANT_CONFIG.WHATSAPP_NUMBER}?text=Namaste!%20We%20are%20a%20saree%20boutique%20requesting%20the%20B2B%20wholesale%20passcode.`}
            target="_blank"
            rel="noreferrer"
            className="text-maroon font-semibold underline"
          >
            Request on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-maroon via-maroon-900 to-maroon text-canvas border border-gold/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> B2B Verified Loom Access • Margin-Protected
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold mt-1 text-white">
              {MERCHANT_CONFIG.BRAND_NAME} — Wholesale Desk
            </h1>
            <p className="text-xs sm:text-sm text-canvas/80 mt-1 max-w-2xl">
              Fixed direct-loom wholesale rates: <strong>₹2,050</strong> (Semi-Silk), <strong>₹11,000</strong> (Pure Silk), <strong>₹13,500</strong> (Handloom). GSTIN: <span className="font-mono">{MERCHANT_CONFIG.GSTIN}</span>.
            </p>
          </div>

          <button
            onClick={() => {
              setIsUnlocked(false);
              sessionStorage.removeItem("b2b_unlocked");
            }}
            className="px-3.5 py-1.5 rounded-lg bg-canvas/10 hover:bg-canvas/20 text-xs font-semibold text-canvas border border-canvas/20 transition-colors"
          >
            Lock Desk
          </button>
        </div>
      </div>

      {/* 3 Tier Cards with Exact Fixed Wholesale Rates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {B2B_TIERS.map((tier) => {
          const isCurrentActive =
            quantity >= tier.minUnits &&
            (tier.maxUnits === null || quantity <= tier.maxUnits);

          const semiPrice = FIXED_WHOLESALE_BASE_PRICES["semi-silk"] - tier.discountPerSaree["semi-silk"];
          const purePrice = FIXED_WHOLESALE_BASE_PRICES["pure-silk"] - tier.discountPerSaree["pure-silk"];
          const handloomPrice = FIXED_WHOLESALE_BASE_PRICES["handloom-bridal"] - tier.discountPerSaree["handloom-bridal"];

          return (
            <div
              key={tier.id}
              className={`p-6 rounded-2xl border transition-all duration-300 relative ${
                isCurrentActive
                  ? "bg-canvas-card border-2 border-gold shadow-luxury -translate-y-1"
                  : "bg-canvas border-loom-border/80 opacity-85"
              }`}
            >
              {isCurrentActive && (
                <span className="absolute -top-3 right-6 bg-gold text-maroon-900 text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                  Active Tier ({quantity} Sarees)
                </span>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-loom-stone uppercase">
                  {tier.badge}
                </span>
                <span className="text-xs font-bold text-silk-emerald bg-silk-emeraldBg px-2 py-0.5 rounded border border-silk-emerald/30">
                  Fixed Direct Loom
                </span>
              </div>

              <h3 className="font-serif font-bold text-xl text-maroon mt-2">
                {tier.name}
              </h3>
              <p className="text-xs text-loom-bronze mt-1 leading-relaxed">
                {tier.description}
              </p>

              {/* Exact Tier Pricing Table */}
              <div className="mt-4 pt-3 border-t border-loom-border/60 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-loom-stone">Semi-Silk Festive:</span>
                  <span className="font-bold text-maroon font-serif">{formatINR(semiPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-loom-stone">Pure Silk (Silk Mark):</span>
                  <span className="font-bold text-maroon font-serif">{formatINR(purePrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-loom-stone">Handloom Bridal:</span>
                  <span className="font-bold text-maroon font-serif">{formatINR(handloomPrice)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Bulk Order Estimator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Configuration Column */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-canvas-card border border-loom-border shadow-luxury space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-loom-border">
            <Calculator className="w-5 h-5 text-gold-700" />
            <h2 className="font-serif font-bold text-xl text-maroon">
              Bulk Order Configuration
            </h2>
          </div>

          {/* Saree Design Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-loom-charcoal mb-2">
              Select Anchor Saree Design:
            </label>
            <select
              value={selectedSku}
              onChange={(e) => handleSkuChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-canvas border border-loom-border text-xs sm:text-sm text-loom-charcoal focus:border-maroon focus:outline-none"
            >
              {CATALOG.map((item) => (
                <option key={item.sku} value={item.sku}>
                  [{item.sku}] {item.title} — Retail {formatINR(item.price)} ({item.categoryName})
                </option>
              ))}
            </select>
          </div>

          {/* Quantity Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-loom-charcoal">
                Order Quantity (MOQ 10 Sarees):
              </label>
              <span className="font-serif font-bold text-xl text-maroon">
                {quantity} Sarees
              </span>
            </div>

            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full accent-maroon cursor-pointer"
            />

            <div className="flex justify-between text-[11px] text-loom-stone font-mono mt-1">
              <span>10 (Starter)</span>
              <span>25 (Partner)</span>
              <span>50+ (Showroom Bulk)</span>
              <span>100 Units</span>
            </div>
          </div>

          {/* Boutique Credentials Form */}
          <div className="pt-4 border-t border-loom-border space-y-4">
            <h3 className="font-serif font-bold text-sm text-maroon">
              Boutique Credentials (Included in WhatsApp Proforma)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-loom-stone uppercase mb-1">
                  Boutique / Store Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sringara Silk Studio"
                  value={boutiqueName}
                  onChange={(e) => setBoutiqueName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-canvas border border-loom-border text-xs text-loom-charcoal focus:outline-none focus:border-maroon"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-loom-stone uppercase mb-1">
                  Contact Person *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Sharma"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-canvas border border-loom-border text-xs text-loom-charcoal focus:outline-none focus:border-maroon"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-loom-stone uppercase mb-1">
                  City & State *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bangalore, Karnataka"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-canvas border border-loom-border text-xs text-loom-charcoal focus:outline-none focus:border-maroon"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-loom-stone uppercase mb-1">
                  Boutique GSTIN (For 5% ITC Invoice)
                </label>
                <input
                  type="text"
                  placeholder="29AAAAA0000A1Z5 (or In Process)"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-canvas border border-loom-border text-xs text-loom-charcoal font-mono focus:outline-none focus:border-maroon"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Proforma Summary Column */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-canvas-surface border-2 border-gold/70 shadow-2xl flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs font-bold text-silk-emerald uppercase tracking-widest block">
              Official Commercial Estimate
            </span>
            <h3 className="font-serif font-bold text-2xl text-maroon mt-1">
              Wholesale Proforma Breakdown
            </h3>

            <div className="mt-6 space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between text-loom-stone">
                <span>Selected Design SKU:</span>
                <span className="font-mono font-bold text-loom-charcoal">{targetSaree.sku}</span>
              </div>
              <div className="flex justify-between text-loom-stone">
                <span>Standard Single Retail:</span>
                <span className="line-through">{formatINR(targetSaree.price)}</span>
              </div>
              <div className="flex justify-between font-semibold text-maroon pt-1">
                <span>Wholesale Unit Price:</span>
                <span className="font-serif text-lg">{formatINR(quote.discountedUnitPrice)} / Saree</span>
              </div>

              <div className="pt-4 border-t border-loom-border space-y-2">
                <div className="flex justify-between text-loom-charcoal">
                  <span>Subtotal ({quantity} Sarees):</span>
                  <span className="font-bold">{formatINR(quote.subtotal)}</span>
                </div>
                <div className="flex justify-between text-loom-stone text-xs">
                  <span>Textile GST (5% Input Tax Credit):</span>
                  <span>{formatINR(quote.gstAmount)}</span>
                </div>
                <div className="flex justify-between text-silk-emerald font-bold">
                  <span>Boutique Retail Spread Saved:</span>
                  <span>+ {formatINR(quote.totalSavings)}</span>
                </div>
                <div className="flex justify-between font-bold text-xl text-maroon pt-3 border-t border-loom-border font-serif">
                  <span>Total Proforma Value:</span>
                  <span>{formatINR(quote.total)}</span>
                </div>
              </div>

              {/* Merchant Net Profit Note */}
              <div className="mt-4 p-3 rounded-xl bg-silk-emeraldBg border border-silk-emerald/30 text-xs text-silk-emerald flex items-center justify-between">
                <span className="font-medium">Direct Loom Net Margin Locked:</span>
                <span className="font-bold font-serif text-sm">
                  {formatINR(quote.netProfitPerUnit)} / Saree
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleSendQuote}
              disabled={isSubmitting || quantity < 10}
              className={`w-full py-4 px-6 rounded-xl bg-silk-emerald hover:bg-emerald-800 text-canvas font-bold text-sm tracking-wide shadow-lg transition-all flex items-center justify-center gap-2 group ${
                quantity < 10 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <MessageCircle className="w-5 h-5 fill-canvas" />
              <span>Send Wholesale Quote to WhatsApp</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="text-[11px] text-loom-stone text-center leading-relaxed">
              Official GST Tax Invoice issued by {MERCHANT_CONFIG.UPI_PAYEE_NAME} (GSTIN: {MERCHANT_CONFIG.GSTIN}) with Silk Mark Certificate ID {MERCHANT_CONFIG.SILK_MARK_ID}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import {
  Lock,
  Unlock,
  Package,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Clock,
  XCircle,
  Sliders,
  ShieldCheck,
  Building,
} from "lucide-react";
import { CATALOG, SareeSKU, StockStatus } from "@/data/catalog";
import { formatINR, calculateUnitProfit } from "@/lib/pricing";
import { MERCHANT_CONFIG } from "@/lib/config";
import { useAuthStore } from "@/store/useAuthStore";

const ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || "2027";

export function QuickInventory() {
  const [pin, setPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState(false);
  const { loginAsAdmin, logout: storeLogout } = useAuthStore();

  // Local inventory state
  const [inventory, setInventory] = useState<SareeSKU[]>(CATALOG);

  // Selected SKU for margin analysis
  const [selectedSkuForMargin, setSelectedSkuForMargin] = useState(CATALOG[4].sku);

  // Dynamic cost inputs
  const [packagingCost, setPackagingCost] = useState(180);
  const [cacCost, setCacCost] = useState(800);
  const [shippingCost, setShippingCost] = useState(350);

  useEffect(() => {
    const auth = sessionStorage.getItem("admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
      loginAsAdmin();
    }

    const savedOverrides = localStorage.getItem("loom_inventory_overrides");
    if (savedOverrides) {
      try {
        const parsed = JSON.parse(savedOverrides) as Record<string, StockStatus>;
        setInventory((prev) =>
          prev.map((item) =>
            parsed[item.sku] ? { ...item, stockStatus: parsed[item.sku] } : item
          )
        );
      } catch (err) {
        console.warn("Could not load inventory overrides:", err);
      }
    }
  }, [loginAsAdmin]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === ADMIN_PIN) {
      setIsAuthenticated(true);
      setPinError(false);
      sessionStorage.setItem("admin_auth", "true");
      loginAsAdmin();
    } else {
      setPinError(true);
    }
  };

  const handleStatusChange = (sku: string, newStatus: StockStatus) => {
    const updated = inventory.map((item) =>
      item.sku === sku ? { ...item, stockStatus: newStatus } : item
    );
    setInventory(updated);

    const overrides: Record<string, StockStatus> = {};
    updated.forEach((i) => {
      overrides[i.sku] = i.stockStatus;
    });
    localStorage.setItem("loom_inventory_overrides", JSON.stringify(overrides));
  };

  const currentMarginSaree =
    inventory.find((i) => i.sku === selectedSkuForMargin) || inventory[4];

  // Auto-calibrate default CAC & shipping when category changes
  const handleSkuSelect = (sku: string) => {
    setSelectedSkuForMargin(sku);
    const item = inventory.find((i) => i.sku === sku);
    if (item) {
      if (item.category === "semi-silk") {
        setPackagingCost(120);
        setCacCost(350);
        setShippingCost(150);
      } else if (item.category === "pure-silk") {
        setPackagingCost(180);
        setCacCost(800);
        setShippingCost(350);
      } else {
        setPackagingCost(250);
        setCacCost(950);
        setShippingCost(400);
      }
    }
  };

  const profit = calculateUnitProfit(
    currentMarginSaree.price,
    currentMarginSaree.cogs,
    {
      packaging: packagingCost,
      adSpendCAC: cacCost,
      shippingInsurance: shippingCost,
    }
  );

  const inStockCount = inventory.filter((i) => i.stockStatus === "IN_STOCK").length;
  const weaverHoldCount = inventory.filter((i) => i.stockStatus === "WEAVER_HOLD").length;
  const soldOutCount = inventory.filter((i) => i.stockStatus === "SOLD_OUT").length;

  const totalCatalogInventoryValue = inventory.reduce(
    (sum, i) => sum + (i.stockStatus !== "SOLD_OUT" ? i.price * i.stockCount : 0),
    0
  );
  const totalWeaverDisbursementLiability = inventory.reduce(
    (sum, i) => sum + (i.stockStatus !== "SOLD_OUT" ? i.cogs * i.stockCount : 0),
    0
  );

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 rounded-3xl bg-canvas-card border border-loom-border shadow-2xl text-center">
        <div className="w-16 h-16 rounded-full bg-maroon/10 text-maroon mx-auto flex items-center justify-center mb-5">
          <Lock className="w-8 h-8 text-maroon" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-gold-700 block">
          Merchant Operations Desk
        </span>
        <h2 className="font-serif text-3xl font-bold text-maroon mt-1">
          Loom Operations & Inventory
        </h2>
        <p className="text-xs text-loom-bronze mt-2 leading-relaxed">
          Daily weaver stock reconciliation, 1-click status toggles, and exact unit economics simulator.
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-loom-charcoal uppercase tracking-wider mb-2">
              Enter Operations PIN:
            </label>
            <input
              type="password"
              maxLength={6}
              placeholder="Enter PIN (Demo: 2027)"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-canvas border border-loom-border text-center text-lg font-mono tracking-[0.5em] text-loom-charcoal focus:border-maroon focus:outline-none"
            />
            {pinError && (
              <p className="text-xs text-red-600 mt-2">
                Invalid PIN. Default passcode is: <strong>2027</strong>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl bg-maroon hover:bg-maroon-700 text-canvas font-semibold text-sm tracking-wide shadow-luxury transition-all flex items-center justify-center gap-2"
          >
            <Unlock className="w-4 h-4 text-gold" />
            <span>Unlock Admin Desk</span>
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Admin Top Header & Metric Cards */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-loom-border">
        <div>
          <span className="text-xs font-bold text-gold-700 uppercase tracking-widest">
            {MERCHANT_CONFIG.BRAND_NAME} • Founder Desk
          </span>
          <h1 className="font-serif text-3xl font-bold text-maroon">
            Loom Inventory & Margin Protection Engine
          </h1>
          <p className="text-xs text-loom-stone mt-1">
            GSTIN: <span className="font-mono text-loom-charcoal font-semibold">{MERCHANT_CONFIG.GSTIN}</span> | Silk Mark: <span className="font-mono text-loom-charcoal font-semibold">{MERCHANT_CONFIG.SILK_MARK_ID}</span>
          </p>
        </div>

        <button
          onClick={() => {
            setIsAuthenticated(false);
            sessionStorage.removeItem("admin_auth");
            storeLogout();
          }}
          className="px-4 py-2 rounded-lg bg-canvas-surface hover:bg-canvas text-xs font-semibold text-loom-stone hover:text-maroon border border-loom-border transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* Target Revenue & Profit Health Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-canvas-card border border-loom-border shadow-sm">
          <div className="flex items-center justify-between text-xs text-loom-stone">
            <span>2027 Goal ARR</span>
            <TrendingUp className="w-4 h-4 text-silk-emerald" />
          </div>
          <span className="font-serif text-2xl font-bold text-maroon block mt-2">
            ₹1,00,00,000+
          </span>
          <span className="text-[11px] text-silk-emerald font-semibold">
            Target: ₹30 Lakhs+ Net Profit
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-canvas-card border border-loom-border shadow-sm">
          <div className="flex items-center justify-between text-xs text-loom-stone">
            <span>Ready Loom Stock</span>
            <CheckCircle2 className="w-4 h-4 text-silk-emerald" />
          </div>
          <span className="font-serif text-2xl font-bold text-loom-charcoal block mt-2">
            {inStockCount} / {inventory.length} SKUs Ready
          </span>
          <span className="text-[11px] text-loom-stone">
            {weaverHoldCount} on Loom Hold • {soldOutCount} Sold
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-canvas-card border border-loom-border shadow-sm">
          <div className="flex items-center justify-between text-xs text-loom-stone">
            <span>Inventory Retail Value</span>
            <DollarSign className="w-4 h-4 text-gold-700" />
          </div>
          <span className="font-serif text-2xl font-bold text-loom-charcoal block mt-2">
            {formatINR(totalCatalogInventoryValue)}
          </span>
          <span className="text-[11px] text-loom-stone">Across 12 Pit-Looms</span>
        </div>

        <div className="p-5 rounded-2xl bg-canvas-card border border-loom-border shadow-sm">
          <div className="flex items-center justify-between text-xs text-loom-stone">
            <span>Exact Buying COGS</span>
            <Package className="w-4 h-4 text-maroon" />
          </div>
          <span className="font-serif text-2xl font-bold text-maroon block mt-2">
            {formatINR(totalWeaverDisbursementLiability)}
          </span>
          <span className="text-[11px] text-silk-emerald font-semibold">
            Weaver Family Compensation
          </span>
        </div>
      </div>

      {/* SECTION 1: 1-Click Inventory Status Management */}
      <div className="p-6 sm:p-8 rounded-3xl bg-canvas-card border border-loom-border shadow-luxury">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-6 border-b border-loom-border">
          <div>
            <h2 className="font-serif font-bold text-xl text-maroon">
              Loom Stock Status Fast-Toggle
            </h2>
            <p className="text-xs text-loom-bronze mt-0.5">
              Instant reactivity across storefront, PDP, and WhatsApp checkout.
            </p>
          </div>
          <span className="text-xs font-mono bg-canvas-surface px-3 py-1.5 rounded-lg border border-loom-border text-loom-charcoal">
            Sync: Instant Local Storage
          </span>
        </div>

        <div className="divide-y divide-loom-border/60 overflow-x-auto">
          {inventory.map((item) => (
            <div
              key={item.sku}
              className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-canvas-surface/40 px-2 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-[260px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-12 h-14 object-cover object-top rounded-lg border border-loom-border shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-gold-700">
                      {item.sku}
                    </span>
                    <span className="text-[10px] text-loom-stone uppercase">
                      {item.categoryName}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-loom-charcoal line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-loom-stone">
                    Weaver: {item.weaverName} ({item.loomLocation.split(",")[0]})
                  </p>
                </div>
              </div>

              {/* Price & Real Buying COGS details */}
              <div className="flex items-center gap-6 text-xs">
                <div>
                  <span className="text-loom-stone block text-[10px] uppercase">Retail Price</span>
                  <span className="font-bold text-maroon font-serif">{formatINR(item.price)}</span>
                </div>
                <div>
                  <span className="text-loom-stone block text-[10px] uppercase">Exact COGS</span>
                  <span className="font-bold text-loom-charcoal font-serif">{formatINR(item.cogs)}</span>
                </div>
                <div>
                  <span className="text-loom-stone block text-[10px] uppercase">Gross Margin</span>
                  <span className="font-bold text-silk-emerald font-serif">{formatINR(item.price - item.cogs)}</span>
                </div>
              </div>

              {/* 1-Click Status Switcher Buttons */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-canvas border border-loom-border">
                <button
                  type="button"
                  onClick={() => handleStatusChange(item.sku, "IN_STOCK")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    item.stockStatus === "IN_STOCK"
                      ? "bg-silk-emerald text-canvas shadow-sm"
                      : "text-loom-stone hover:text-loom-charcoal"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>In Stock</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange(item.sku, "WEAVER_HOLD")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    item.stockStatus === "WEAVER_HOLD"
                      ? "bg-gold text-maroon-900 shadow-sm"
                      : "text-loom-stone hover:text-loom-charcoal"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Weaver Hold</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange(item.sku, "SOLD_OUT")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    item.stockStatus === "SOLD_OUT"
                      ? "bg-loom-charcoal text-canvas shadow-sm"
                      : "text-loom-stone hover:text-loom-charcoal"
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Sold Out</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Dynamic SKU Unit Economics & Net Profit Simulator */}
      <div className="p-6 sm:p-8 rounded-3xl bg-canvas-card border border-loom-border shadow-luxury">
        <div className="flex items-center gap-2 pb-6 border-b border-loom-border">
          <Sliders className="w-5 h-5 text-gold-700" />
          <div>
            <h2 className="font-serif font-bold text-xl text-maroon">
              Unit Economics & Net Profit Simulator
            </h2>
            <p className="text-xs text-loom-bronze">
              Simulate blended Meta/Reels CAC, packaging, and insured courier against exact sourcing COGS.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          {/* Controls */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase text-loom-charcoal mb-2">
                Select SKU to Analyze:
              </label>
              <select
                value={selectedSkuForMargin}
                onChange={(e) => handleSkuSelect(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-loom-border text-xs sm:text-sm font-medium"
              >
                {inventory.map((item) => (
                  <option key={item.sku} value={item.sku}>
                    [{item.sku}] {item.title} — Retail {formatINR(item.price)} (COGS: {formatINR(item.cogs)})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-loom-stone uppercase mb-1">
                  Packaging Box (₹):
                </label>
                <input
                  type="number"
                  value={packagingCost}
                  onChange={(e) => setPackagingCost(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-canvas border border-loom-border text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-loom-stone uppercase mb-1">
                  Meta/Reels CAC (₹):
                </label>
                <input
                  type="number"
                  value={cacCost}
                  onChange={(e) => setCacCost(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-canvas border border-loom-border text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-loom-stone uppercase mb-1">
                  Insured Transit (₹):
                </label>
                <input
                  type="number"
                  value={shippingCost}
                  onChange={(e) => setShippingCost(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-canvas border border-loom-border text-xs font-mono"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gold-50 border border-gold/40 text-xs text-maroon space-y-1">
              <p className="font-bold">💡 Direct WhatsApp UPI Advantage:</p>
              <p>
                By closing orders via WhatsApp with direct Current Account UPI ({MERCHANT_CONFIG.UPI_ID}), you bypass 2.0% - 2.5% payment gateway fees, saving <strong>₹250 to ₹400</strong> in cash profit on every pure silk saree!
              </p>
            </div>
          </div>

          {/* Profit Breakdown Output */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-canvas-surface border-2 border-gold/60 shadow-lg flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold-700 block">
                Unit Economics Breakdown
              </span>
              <h3 className="font-serif font-bold text-xl text-maroon mt-0.5">
                {currentMarginSaree.title}
              </h3>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-loom-stone">Selling Price:</span>
                  <span className="font-bold text-maroon font-serif text-sm">
                    {formatINR(profit.retailPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-loom-stone">
                  <span>- Exact Sourcing COGS:</span>
                  <span className="font-mono font-semibold text-loom-charcoal">{formatINR(profit.cogs)}</span>
                </div>
                <div className="flex justify-between text-loom-stone">
                  <span>- Luxury Presentation Box:</span>
                  <span className="font-mono">{formatINR(profit.packaging)}</span>
                </div>
                <div className="flex justify-between text-loom-stone">
                  <span>- Blended Social CAC:</span>
                  <span className="font-mono">{formatINR(profit.adSpendCAC)}</span>
                </div>
                <div className="flex justify-between text-loom-stone">
                  <span>- Insured Speed Transit:</span>
                  <span className="font-mono">{formatINR(profit.shippingInsurance)}</span>
                </div>

                <div className="pt-3 border-t border-loom-border flex justify-between font-bold text-sm text-loom-charcoal">
                  <span>Total Fulfilment Cost:</span>
                  <span>{formatINR(profit.totalCost)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-gold/40 flex items-baseline justify-between">
              <div>
                <span className="text-[11px] uppercase font-bold text-silk-emerald block">
                  Net Profit per Saree
                </span>
                <span className="text-2xl font-bold text-silk-emerald font-serif">
                  {formatINR(profit.netProfit)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-loom-stone block">Net Margin</span>
                <span className="text-xl font-bold text-maroon font-serif">
                  {profit.netMarginPercent}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

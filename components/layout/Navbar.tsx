"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Heart,
  Menu,
  X,
  PhoneCall,
  Sparkles,
  ShieldCheck,
  Truck,
  Building2,
  Lock,
  User,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

const TICKER_ITEMS = [
  "CENTRAL SILK BOARD SILK MARK CERTIFIED",
  "100% PURE MULBERRY SILK",
  "DIRECT FROM DHARMAVARAM MASTER PIT-LOOMS",
  "FREE INSURED DELIVERY ALL OVER INDIA",
  "FLAT 15% FESTIVE PRIVILEGE LIVE",
  "LIVE WHATSAPP VIDEO CALL INSPECTION AVAILABLE",
  "TRADITIONAL HANDLOOM CRAFTSMANSHIP SINCE 1974",
  "AUTHENTIC DOUBLE-SHUTTLE KORVAI WEAVES",
  "ZERO SHOWROOM MARKUP • DIRECT ARTISAN WEAVERS",
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { openCart, getTotalItemsCount, wishlistSkus } = useCartStore();
  const totalCartCount = getTotalItemsCount();

  const navLinks = [
    { label: "Pure Mulberry Silk", href: "/collections/pure-silk" },
    { label: "Semi-Silk Festive", href: "/collections/semi-silk" },
    { label: "Bridal Heirloom", href: "/collections/handloom-bridal" },
    { label: "All Sarees", href: "/collections/all" },
    { label: "B2B Wholesale", href: "/wholesale", badge: "MOQ 10+" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-canvas/95 backdrop-blur-md border-b border-loom-border/60">
      {/* Top Scrolling Luxury Marquee Banner (Pushpalatha Reference Style) */}
      <div className="w-full bg-[#24060E] border-b border-gold-500/20 text-gold-200 py-2 overflow-hidden select-none">
        <div className="animate-marquee flex items-center space-x-6 text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase">
          {/* First loop track */}
          {TICKER_ITEMS.map((item, idx) => (
            <div key={`ticker-1-${idx}`} className="flex items-center space-x-6 shrink-0">
              <span className="text-gold-400 font-bold text-xs">✦</span>
              <span className="text-[#F6EED8] hover:text-gold-300 transition-colors">{item}</span>
            </div>
          ))}

          {/* Seamless second loop duplicate for infinite continuous scroll */}
          {TICKER_ITEMS.map((item, idx) => (
            <div key={`ticker-2-${idx}`} className="flex items-center space-x-6 shrink-0">
              <span className="text-gold-400 font-bold text-xs">✦</span>
              <span className="text-[#F6EED8] hover:text-gold-300 transition-colors">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-loom-charcoal hover:text-maroon transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Editorial Logo */}
        <Link href="/" className="flex flex-col items-center text-center">
          <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-maroon hover:opacity-90 transition-opacity">
            DHARMAVARAM
          </span>
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-gold font-medium">
            Handloom Silk Looms • Estd. 1974
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center space-x-7">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-wide font-medium transition-colors relative py-1 ${
                  isActive
                    ? "text-maroon font-semibold"
                    : "text-loom-charcoal hover:text-maroon"
                }`}
              >
                {link.label}
                {link.badge && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold bg-gold-100 text-gold-700 rounded-full border border-gold-400/40">
                    {link.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-maroon rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Icons */}
        <div className="flex items-center space-x-4 sm:space-x-5">
          {/* Wishlist Indicator */}
          <Link
            href="/collections/all"
            className="relative p-2 text-loom-charcoal hover:text-maroon transition-colors"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistSkus.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-maroon text-canvas text-[10px] font-bold flex items-center justify-center">
                {wishlistSkus.length}
              </span>
            )}
          </Link>

          {/* Cart Drawer Trigger */}
          <button
            onClick={openCart}
            className="relative p-2 sm:p-2.5 bg-maroon hover:bg-maroon-700 text-canvas rounded-full shadow-luxury transition-all flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5"
            aria-label="Open Cart"
          >
            <ShoppingBag className="w-4 h-4 text-gold-400" />
            <span className="text-xs font-semibold tracking-wider">CART</span>
            {totalCartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-gold text-maroon-900 text-[11px] font-bold flex items-center justify-center shadow-sm">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Login / Sign In Button (Placed right beside Cart button - Pushpalatha Silks Reference) */}
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gold-600/80 bg-white/70 hover:bg-maroon hover:text-canvas hover:border-maroon text-maroon transition-all text-xs font-semibold tracking-wide shadow-2xs group"
            title="Sign In / Customer Login"
          >
            <User className="w-3.5 h-3.5 text-gold-600 group-hover:text-gold-300 transition-colors" />
            <span>Login</span>
          </Link>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-loom-border/80 bg-canvas px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 text-base font-medium text-loom-charcoal border-b border-loom-border/40 hover:text-maroon"
            >
              <span>{link.label}</span>
              {link.badge && (
                <span className="px-2 py-0.5 text-xs font-semibold bg-gold-100 text-gold-700 rounded-full">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 bg-maroon text-canvas font-semibold rounded-md text-sm flex items-center justify-center gap-2 shadow-sm"
            >
              <User className="w-4 h-4 text-gold-300" />
              Customer Login / Sign In
            </Link>
            <Link
              href="/wholesale"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 bg-loom-surface text-maroon font-semibold rounded-md text-sm border border-gold/40 flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4 text-gold" />
              B2B Boutique Wholesale Portal
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 text-xs text-loom-stone hover:text-maroon flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" /> Founder / Weaver Admin Desk
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

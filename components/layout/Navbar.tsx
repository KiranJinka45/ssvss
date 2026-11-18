"use client";

import React, { useState, useEffect, useRef } from "react";
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
  LogOut,
  Edit3,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";

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
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { openCart, getTotalItemsCount, wishlistSkus } = useCartStore();
  const { isLoggedIn, user, logout, updateProfile, syncFromStorage } = useAuthStore();
  const totalCartCount = getTotalItemsCount();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
        setIsEditingProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleStartEditProfile = () => {
    if (user) {
      setEditName(user.name || "");
      setEditPhone(user.phone || "");
      setEditEmail(user.email || "");
    }
    setIsEditingProfile(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName.trim() || user?.name || "Customer",
      phone: editPhone.trim(),
      email: editEmail.trim(),
    });
    setIsEditingProfile(false);
  };

  useEffect(() => {
    setMounted(true);
    syncFromStorage();
  }, [syncFromStorage]);

  const userIsLoggedIn = mounted ? isLoggedIn : false;

  // Do not render storefront navbar on admin console
  if (pathname?.startsWith("/admin")) {
    return null;
  }

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

          {/* Login Button: SHOWN ONLY WHEN USER IS NOT LOGGED IN */}
          {!userIsLoggedIn && (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gold-600/80 bg-white/70 hover:bg-maroon hover:text-canvas hover:border-maroon text-maroon transition-all text-xs font-semibold tracking-wide shadow-2xs group"
              title="Sign In / Customer Login"
            >
              <User className="w-3.5 h-3.5 text-gold-600 group-hover:text-gold-300 transition-colors" />
              <span>Login</span>
            </Link>
          )}

          {/* User Profile Icon: VISIBLE ONLY WHEN USER IS LOGGED IN */}
          {userIsLoggedIn && (
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen);
                  setIsEditingProfile(false);
                }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-gold/70 bg-[#24060E] hover:bg-maroon text-gold flex items-center justify-center transition-all shadow-md hover:scale-105 active:scale-95"
                title={`Profile: ${user?.name || "Customer"}`}
                aria-label="User Profile"
              >
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                  {user?.name ? user.name.trim().charAt(0) : <User className="w-4 h-4" />}
                </span>
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-[#121216] border border-white/15 text-[#F5EFE6] shadow-2xl p-5 z-50 animate-fadeIn space-y-4">
                  {/* Dropdown Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#E5B842]/20 border border-[#E5B842]/40 text-[#E5B842] flex items-center justify-center font-bold text-base uppercase">
                        {user?.name ? user.name.trim().charAt(0) : "U"}
                      </div>
                      <div className="max-w-[170px]">
                        <h4 className="font-serif font-bold text-sm text-[#F5EFE6] leading-tight truncate">
                          {user?.name || "Valued Customer"}
                        </h4>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#D4AF37]">
                          {user?.role === "admin" ? "Master Artisan Admin" : "Verified Customer"}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (!isEditingProfile) {
                          handleStartEditProfile();
                        } else {
                          setIsEditingProfile(false);
                        }
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-[#E5B842] hover:bg-white/5 transition-colors"
                      title={isEditingProfile ? "Cancel Editing" : "Edit Profile"}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Profile Edit Mode or Profile Details View */}
                  {isEditingProfile ? (
                    <form onSubmit={handleSaveProfile} className="space-y-3 pt-1">
                      <div>
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-[#D4AF37] mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full py-2 px-3 rounded-xl bg-[#18181F] border border-white/15 text-xs text-[#F5EFE6] focus:outline-none focus:border-[#E5B842]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-[#D4AF37] mb-1">
                          Phone Number (WhatsApp)
                        </label>
                        <input
                          type="tel"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full py-2 px-3 rounded-xl bg-[#18181F] border border-white/15 text-xs text-[#F5EFE6] focus:outline-none focus:border-[#E5B842]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-[#D4AF37] mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          placeholder="kiran@example.com"
                          className="w-full py-2 px-3 rounded-xl bg-[#18181F] border border-white/15 text-xs text-[#F5EFE6] focus:outline-none focus:border-[#E5B842]"
                        />
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          type="submit"
                          className="flex-1 py-2 rounded-xl bg-[#E5B842] hover:bg-[#D4A732] text-black font-bold text-xs uppercase tracking-wider transition-all"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(false)}
                          className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-2 text-xs">
                      {user?.phone ? (
                        <div className="flex items-center justify-between py-1 text-gray-300">
                          <span className="text-gray-400">Phone:</span>
                          <span className="font-medium text-[#E5B842]">{user.phone}</span>
                        </div>
                      ) : (
                        <p className="text-[11px] text-gray-400 italic">No phone added yet. Click ✏️ to update.</p>
                      )}

                      {user?.email && (
                        <div className="flex items-center justify-between py-1 text-gray-300">
                          <span className="text-gray-400">Email:</span>
                          <span className="font-medium text-gray-300 truncate max-w-[160px]">{user.email}</span>
                        </div>
                      )}

                      <div className="pt-2 border-t border-white/10 space-y-1">
                        <Link
                          href="/collections/all"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <Heart className="w-3.5 h-3.5 text-gold" />
                            <span>Saved Sarees</span>
                          </span>
                          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full">
                            {wishlistSkus.length}
                          </span>
                        </Link>

                        {user?.role === "admin" && (
                          <Link
                            href="/admin"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#E5B842]/10 text-[#E5B842] transition-colors font-medium"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Admin Console</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Log Out Button */}
                  <div className="pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                        setIsEditingProfile(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/30 bg-red-950/30 hover:bg-red-900/50 text-red-300 text-xs font-semibold tracking-wider uppercase transition-all"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
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
            {!userIsLoggedIn ? (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 bg-maroon text-canvas font-semibold rounded-md text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                <User className="w-4 h-4 text-gold-300" />
                Customer Login / Sign In
              </Link>
            ) : (
              <div className="p-3 rounded-xl bg-canvas-surface border border-loom-border/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-xs text-loom-charcoal">
                  <div className="w-7 h-7 rounded-full bg-maroon text-gold flex items-center justify-center text-xs font-bold uppercase">
                    {user?.name ? user.name.trim().charAt(0) : "U"}
                  </div>
                  <div>
                    <span className="font-semibold block">{user?.name || "Customer"}</span>
                    <span className="text-[10px] text-loom-stone uppercase tracking-wider">
                      {user?.role === "admin" ? "Admin" : "Customer"}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-red-600 font-semibold underline hover:text-red-700 flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
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

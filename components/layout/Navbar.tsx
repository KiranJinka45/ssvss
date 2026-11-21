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
  Check,
  Phone,
  Mail,
  ChevronRight,
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
  const [updateSuccess, setUpdateSuccess] = useState(false);
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
    setUpdateSuccess(true);
    setTimeout(() => setUpdateSuccess(false), 2500);
  };

  useEffect(() => {
    setMounted(true);
    syncFromStorage();
  }, [syncFromStorage]);

  const userIsLoggedIn = mounted ? isLoggedIn : false;

  // Do not render storefront navbar on admin console, on login page, or when user is not logged in
  if (pathname?.startsWith("/admin") || pathname === "/login" || !mounted || !isLoggedIn) {
    return null;
  }

  const navLinks: { label: string; href: string; badge?: string }[] = [
    { label: "Home", href: "/" },
    { label: "Bridal", href: "/collections/handloom-bridal" },
    { label: "Products", href: "/collections/all" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
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
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16 h-16 sm:h-18 flex items-center justify-between">
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
            {mounted && wishlistSkus.length > 0 && (
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
            {mounted && totalCartCount > 0 && (
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
                className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 transition-all flex items-center justify-center shadow-md active:scale-95 ${
                  profileDropdownOpen
                    ? "border-maroon bg-maroon text-gold-300 ring-2 ring-gold/40 shadow-lg"
                    : "border-gold/70 bg-gradient-to-br from-[#3D0A14] to-[#20040A] hover:border-gold text-gold hover:shadow-[0_4px_14px_rgba(212,175,55,0.35)]"
                }`}
                title={`Account: ${user?.name || "Patron"}`}
                aria-label="User Profile"
              >
                <span className="font-serif text-sm sm:text-base font-bold uppercase tracking-wider">
                  {user?.name ? user.name.trim().charAt(0) : "U"}
                </span>
                {/* Active indicator dot */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
              </button>

              {/* Profile Dropdown Menu - Simple, Dynamic, Silk Luxury */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-88 rounded-2xl bg-[#FCFAF6] border border-gold-600/30 text-loom-charcoal shadow-[0_20px_50px_rgba(74,14,23,0.18)] p-5 z-50 animate-fadeIn space-y-4">
                  {/* Header: Monogram, Dynamic Greeting, Role & Edit Toggle */}
                  <div className="flex items-start justify-between pb-3.5 border-b border-loom-border/60">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-maroon to-[#24060E] border border-gold/50 text-gold-300 flex items-center justify-center font-serif font-bold text-lg uppercase shadow-sm shrink-0">
                        {user?.name ? user.name.trim().charAt(0) : "U"}
                      </div>
                      <div className="max-w-[180px]">
                        <h4 className="font-serif font-bold text-base text-maroon leading-tight truncate">
                          {user?.name || "Valued Patron"}
                        </h4>
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
                      className="p-1.5 rounded-lg text-loom-stone hover:text-maroon hover:bg-gold-50/80 transition-colors border border-transparent hover:border-gold/30"
                      title={isEditingProfile ? "Cancel Editing" : "Edit Profile"}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Dynamic update feedback */}
                  {updateSuccess && (
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium animate-fadeIn">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Profile details updated successfully!</span>
                    </div>
                  )}

                  {/* Dynamic Interactive Stats (Live Wishlist & Live Cart Shortcuts) */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <Link
                      href="/collections/all"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="p-2.5 rounded-xl bg-white border border-loom-border/60 hover:border-gold hover:bg-gold-50/30 transition-all flex items-center gap-2.5 group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-maroon/5 group-hover:bg-maroon/10 text-maroon flex items-center justify-center shrink-0">
                        <Heart className="w-3.5 h-3.5 text-maroon" />
                      </div>
                      <div>
                        <span className="text-[10px] text-loom-stone block">Saved Sarees</span>
                        <span className="font-bold text-maroon font-serif text-sm">
                          {wishlistSkus.length} Items
                        </span>
                      </div>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        openCart();
                      }}
                      className="p-2.5 rounded-xl bg-white border border-loom-border/60 hover:border-gold hover:bg-gold-50/30 transition-all flex items-center gap-2.5 text-left group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-maroon/5 group-hover:bg-maroon/10 text-maroon flex items-center justify-center shrink-0">
                        <ShoppingBag className="w-3.5 h-3.5 text-maroon" />
                      </div>
                      <div>
                        <span className="text-[10px] text-loom-stone block">Shopping Bag</span>
                        <span className="font-bold text-maroon font-serif text-sm">
                          {totalCartCount} Sarees
                        </span>
                      </div>
                    </button>
                  </div>

                  {/* Profile Edit Form OR Elegant Details View */}
                  {isEditingProfile ? (
                    <form onSubmit={handleSaveProfile} className="space-y-3 pt-1">
                      <div>
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-loom-stone mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full py-2 px-3 rounded-xl bg-white border border-loom-border text-xs text-loom-charcoal focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-loom-stone mb-1">
                          WhatsApp Phone Number
                        </label>
                        <input
                          type="tel"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full py-2 px-3 rounded-xl bg-white border border-loom-border text-xs text-loom-charcoal focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-loom-stone mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          placeholder="kiran@example.com"
                          className="w-full py-2 px-3 rounded-xl bg-white border border-loom-border text-xs text-loom-charcoal focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon"
                        />
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          type="submit"
                          className="flex-1 py-2 rounded-xl bg-maroon hover:bg-maroon-700 text-canvas font-bold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-98"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(false)}
                          className="px-3 py-2 rounded-xl bg-loom-surface hover:bg-loom-border/50 text-xs text-loom-charcoal font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-2 text-xs">
                      {user?.phone ? (
                        <div className="flex items-center justify-between py-1 px-2.5 rounded-lg bg-white/70 border border-loom-border/40">
                          <span className="text-loom-stone flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-gold-700" />
                            <span>Phone:</span>
                          </span>
                          <span className="font-semibold text-maroon">{user.phone}</span>
                        </div>
                      ) : (
                        <p className="text-[11px] text-loom-stone italic px-1">
                          No phone number linked. Click ✏️ to add WhatsApp contact.
                        </p>
                      )}

                      {user?.email && (
                        <div className="flex items-center justify-between py-1 px-2.5 rounded-lg bg-white/70 border border-loom-border/40">
                          <span className="text-loom-stone flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-gold-700" />
                            <span>Email:</span>
                          </span>
                          <span className="font-medium text-loom-charcoal truncate max-w-[170px]">
                            {user.email}
                          </span>
                        </div>
                      )}

                      {user?.role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="mt-2 flex items-center justify-between p-2.5 rounded-xl bg-[#24060E] text-gold hover:bg-maroon hover:text-white transition-all shadow-sm font-semibold"
                        >
                          <span className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-gold-400" />
                            <span>Open Admin Console</span>
                          </span>
                          <ChevronRight className="w-4 h-4 text-gold-400" />
                        </Link>
                      )}
                    </div>
                  )}

                  {/* Refined Simple Log Out Button */}
                  <div className="pt-2 border-t border-loom-border/60">
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                        setIsEditingProfile(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-loom-border hover:border-red-300 hover:bg-red-50 text-loom-stone hover:text-red-700 text-xs font-semibold tracking-wider uppercase transition-all"
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
            {user?.role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-xs text-loom-stone hover:text-maroon flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" /> Founder / Weaver Admin Desk
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

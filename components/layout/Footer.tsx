"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Truck,
  Sparkles,
  Award,
  HelpCircle,
  X,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  Check,
  Lock,
} from "lucide-react";
import { MERCHANT_CONFIG } from "@/lib/config";
import { useAuthStore } from "@/store/useAuthStore";

const FOOTER_FAQS = [
  {
    q: "How do I know this is 100% pure silk and not synthetic?",
    a: "Every pure silk and bridal heirloom saree from our looms carries an official Central Silk Board of India 'Silk Mark' certified tag with a unique QR code. We also perform flame purity tests on yarn batches.",
  },
  {
    q: "Why are your prices ₹5,000 to ₹9,000 lower than city showrooms?",
    a: "City showrooms incur prime commercial rents, distributor commissions, and 45-50% markups. Ordering from us sends your saree straight from the Dharmavaram pit-loom to your wardrobe—zero middlemen, fair weaver wages.",
  },
  {
    q: "Can I inspect the saree on a video call before ordering?",
    a: "Yes! Simply tap 'Live Video Call' or message us on WhatsApp. Our loom master in Kothapeta will open the full 6.2-meter saree on video, show the pallu sheen, and inspect the drape with you.",
  },
  {
    q: "What is the dispatch and delivery timeline?",
    a: "All ready sarees are dispatched within 24 hours in rigid archival presentation boxes via insured express courier, reaching major Indian cities in 2 to 4 business days.",
  },
  {
    q: "What payment methods are supported?",
    a: "We support direct Current Account UPI payments (0% extra gateway fees) via WhatsApp, as well as online NetBanking, Debit/Credit Cards, and UPI Intent gateways with official GST invoices.",
  },
];

export function Footer() {
  const pathname = usePathname();
  const [faqOpen, setFaqOpen] = useState(false);
  const { isLoggedIn } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setTimeout(() => setNewsletterSubscribed(false), 3000);
      setNewsletterEmail("");
    }
  };

  // Do not render storefront footer on admin console, on login page, or when user is not logged in
  if (pathname?.startsWith("/admin") || pathname === "/login" || !mounted || !isLoggedIn) {
    return null;
  }

  return (
    <footer className="w-full bg-[#4A1521] text-[#FAF7F2] border-t border-[#C59B27]/30 overflow-hidden">
      {/* 4 Clean Minimal Trust Highlights - Spanning Full Width */}
      <div className="border-b border-white/10 py-6 sm:py-8 bg-[#3E101B]">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
            <div className="p-2 rounded-full bg-white/10 text-gold-400 shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#E5B842]" />
            </div>
            <div>
              <h5 className="font-serif font-bold text-sm text-white">Silk Mark Certified</h5>
              <p className="text-xs text-white/70 mt-0.5">100% Pure Mulberry Silk</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
            <div className="p-2 rounded-full bg-white/10 text-gold-400 shrink-0">
              <Award className="w-5 h-5 text-[#E5B842]" />
            </div>
            <div>
              <h5 className="font-serif font-bold text-sm text-white">Direct Pit-Loom</h5>
              <p className="text-xs text-white/70 mt-0.5">Authentic Weaver Pricing</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
            <div className="p-2 rounded-full bg-white/10 text-gold-400 shrink-0">
              <Sparkles className="w-5 h-5 text-[#E5B842]" />
            </div>
            <div>
              <h5 className="font-serif font-bold text-sm text-white">Live Loom Inspection</h5>
              <p className="text-xs text-white/70 mt-0.5">Direct WhatsApp Video Call</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
            <div className="p-2 rounded-full bg-white/10 text-gold-400 shrink-0">
              <Truck className="w-5 h-5 text-[#E5B842]" />
            </div>
            <div>
              <h5 className="font-serif font-bold text-sm text-white">Insured Delivery</h5>
              <p className="text-xs text-white/70 mt-0.5">Free All-India 24h Dispatch</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Luxury 5-Column Full-Width Footer (Directly Inspired by Image 8) */}
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16 py-12 lg:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-10">
        {/* Column 1: Brand & Origin (4 cols on lg) */}
        <div className="lg:col-span-3 space-y-4">
          <Link href="/" className="inline-block">
            <div className="bg-white px-4 py-2.5 rounded-lg shadow-sm border border-gold/40">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#5B1020] block leading-tight">
                {MERCHANT_CONFIG.BRAND_NAME}
              </span>
              <span className="text-[9px] uppercase tracking-[0.22em] text-[#C59B27] font-bold block mt-0.5">
                SILK LOOMS • ESTD. {MERCHANT_CONFIG.ESTABLISHED_YEAR}
              </span>
            </div>
          </Link>

          <p className="text-xs text-white/80 leading-relaxed max-w-sm pt-1">
            Handcrafted pure mulberry silk sarees with authentic double-shuttle Korvai temple borders, delivered directly from traditional master pit-looms to your wardrobe.
          </p>

          <div className="space-y-2.5 text-xs text-white/85 pt-1">
            <p className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#E5B842] shrink-0 mt-0.5" />
              <span>{MERCHANT_CONFIG.ORIGIN_LOCATION}</span>
            </p>
            <p className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#E5B842] shrink-0" />
              <a
                href={`https://wa.me/${MERCHANT_CONFIG.WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#E5B842] transition-colors font-medium text-white"
              >
                +{MERCHANT_CONFIG.WHATSAPP_NUMBER} (WhatsApp Direct)
              </a>
            </p>
            <p className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#E5B842] shrink-0" />
              <a href="mailto:orders@dharmavaramlooms.com" className="hover:text-[#E5B842] transition-colors">
                orders@dharmavaramlooms.com
              </a>
            </p>
          </div>
        </div>

        {/* Column 2: Our Company (2 cols on lg) */}
        <div className="lg:col-span-2 space-y-3">
          <h5 className="font-serif font-bold text-xs uppercase tracking-widest text-gold-300">
            Our Company
          </h5>
          <ul className="space-y-2 text-xs text-white/75">
            <li>
              <Link href="/about" className="hover:text-gold-300 transition-colors">
                Store Locations
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-gold-300 transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gold-300 transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={() => setFaqOpen((prev) => !prev)}
                className="hover:text-gold-300 transition-colors text-left"
                aria-expanded={faqOpen}
                aria-controls="footer-faqs-panel"
              >
                FAQ
              </button>
            </li>
            <li>
              <Link href="/wholesale" className="hover:text-gold-300 transition-colors">
                Wholesale Portal
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-gold-300 transition-colors">
                Customer Optin
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Quick Links (2 cols on lg) */}
        <div className="lg:col-span-2 space-y-3">
          <h5 className="font-serif font-bold text-xs uppercase tracking-widest text-gold-300">
            Quick Links
          </h5>
          <ul className="space-y-2 text-xs text-white/75">
            <li>
              <Link href="/about" className="hover:text-gold-300 transition-colors">
                Return & Exchange Policy
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-gold-300 transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-gold-300 transition-colors">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-gold-300 transition-colors">
                Shipping Policy
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-gold-300 transition-colors">
                Exchange and Returns
              </Link>
            </li>
            <li>
              <Link href="/collections/pure-silk" className="hover:text-gold-300 transition-colors">
                Silk Mark Verification
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Shop Categories (2 cols on lg) */}
        <div className="lg:col-span-2 space-y-3">
          <h5 className="font-serif font-bold text-xs uppercase tracking-widest text-gold-300">
            Shop Categories
          </h5>
          <ul className="space-y-2 text-xs text-white/75">
            <li>
              <Link href="/collections/pure-silk" className="hover:text-gold-300 transition-colors">
                Pure Mulberry Silk
              </Link>
            </li>
            <li>
              <Link href="/collections/semi-silk" className="hover:text-gold-300 transition-colors">
                Semi-Silk Festive
              </Link>
            </li>
            <li>
              <Link href="/collections/handloom-bridal" className="hover:text-gold-300 transition-colors">
                Bridal Handloom Heirloom
              </Link>
            </li>
            <li>
              <Link href="/collections/all" className="hover:text-gold-300 transition-colors">
                All Saree Weaves
              </Link>
            </li>
            <li>
              <Link href="/wholesale" className="hover:text-gold-300 font-semibold text-gold-400 transition-colors">
                B2B Wholesale Sarees
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 5: Sign Up to Newsletter (3 cols on lg - Matches Image 8!) */}
        <div className="lg:col-span-3 space-y-3">
          <h5 className="font-serif font-bold text-xs uppercase tracking-widest text-gold-300">
            Sign Up to Newsletter
          </h5>
          <p className="text-xs text-white/80 leading-relaxed">
            Subscribe for store updates and discounts.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="space-y-2 pt-1">
            <div className="flex items-center rounded-full bg-white/10 p-1 border border-white/20 focus-within:border-gold-400 transition-colors">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email..."
                required
                className="w-full bg-transparent px-3.5 py-1.5 text-xs text-white placeholder-white/50 focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-white hover:bg-gold-200 text-[#5B1020] text-xs font-bold shrink-0 transition-colors shadow-sm"
              >
                {newsletterSubscribed ? "Saved ✓" : "Sign Up"}
              </button>
            </div>
            <p className="text-[10px] text-white/60 leading-tight">
              By entering the e-mail you accept the terms and conditions and the privacy policy.
            </p>
          </form>

          {/* Social Icons matching Image 8 */}
          <div className="flex items-center gap-3 pt-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#5B1020] flex items-center justify-center transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#5B1020] flex items-center justify-center transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#5B1020] flex items-center justify-center transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a
              href={`https://wa.me/${MERCHANT_CONFIG.WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#5B1020] flex items-center justify-center transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Small Expandable FAQ Drawer / Panel */}
      {faqOpen && (
        <div
          id="footer-faqs-panel"
          className="border-t border-b border-white/15 bg-[#3E101B] py-8 px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16 animate-fadeIn"
        >
          <div className="w-full space-y-6">
            <div className="flex items-center justify-between border-b border-white/15 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-white/15 text-gold-300 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4 text-[#E5B842]" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-white">
                    Frequently Asked Questions (FAQs)
                  </h4>
                  <p className="text-xs text-white/70">
                    Quick guide to handloom authenticity, dispatch, and ordering.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setFaqOpen(false)}
                className="text-xs px-3 py-1.5 rounded-lg bg-white/15 border border-white/20 hover:bg-white hover:text-[#5B1020] text-white font-semibold flex items-center gap-1.5 transition-all"
                title="Close FAQs"
              >
                <X className="w-3.5 h-3.5" />
                <span>Close FAQs</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {FOOTER_FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white/10 border border-white/15 space-y-2 flex flex-col justify-between"
                >
                  <h5 className="font-serif font-bold text-sm text-[#E5B842] leading-snug">
                    {faq.q}
                  </h5>
                  <p className="text-white/80 leading-relaxed text-[11px] sm:text-xs">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center text-xs text-white/80 flex flex-wrap items-center justify-center gap-2">
              <span>Have a specific weaving question or want to inspect a pallu live?</span>
              <a
                href={`https://wa.me/${MERCHANT_CONFIG.WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="text-gold-300 font-semibold underline hover:text-white flex items-center gap-1"
              >
                <span>Chat directly with our master loom on WhatsApp</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Clean Full-Width Copyright Bar with Admin Portal Link */}
      <div className="border-t border-white/10 py-5 bg-[#340B15]">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-3">
          <p>© {new Date().getFullYear()} SSvSS Dharmavaram Handloom Silk Looms. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-white/45 hover:text-[#E5B842] transition-colors flex items-center gap-1.5 font-medium"
              title="Founder & Artisan Admin Portal (PIN: 2027)"
            >
              <Lock className="w-3.5 h-3.5 text-[#E5B842]" />
              <span>Admin Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
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

  useEffect(() => {
    setMounted(true);
  }, []);

  // Do not render storefront footer on admin console, on login page, or when user is not logged in
  if (pathname?.startsWith("/admin") || pathname === "/login" || !mounted || !isLoggedIn) {
    return null;
  }

  return (
    <footer className="bg-[#FAF7F2] border-t border-loom-border/60 text-loom-charcoal">
      {/* 4 Clean Minimal Trust Highlights */}
      <div className="border-b border-loom-border/40 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-maroon shrink-0" />
            <div>
              <h5 className="font-serif font-bold text-sm text-maroon">Silk Mark Certified</h5>
              <p className="text-xs text-loom-charcoal/70 mt-0.5">100% Pure Mulberry Silk</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
            <Award className="w-5 h-5 text-maroon shrink-0" />
            <div>
              <h5 className="font-serif font-bold text-sm text-maroon">Direct Pit-Loom</h5>
              <p className="text-xs text-loom-charcoal/70 mt-0.5">Authentic Weaver Pricing</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
            <Sparkles className="w-5 h-5 text-maroon shrink-0" />
            <div>
              <h5 className="font-serif font-bold text-sm text-maroon">Live Loom Inspection</h5>
              <p className="text-xs text-loom-charcoal/70 mt-0.5">Direct WhatsApp Video Call</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
            <Truck className="w-5 h-5 text-maroon shrink-0" />
            <div>
              <h5 className="font-serif font-bold text-sm text-maroon">Insured Delivery</h5>
              <p className="text-xs text-loom-charcoal/70 mt-0.5">Free All-India 24h Dispatch</p>
            </div>
          </div>
        </div>
      </div>

      {/* Simple, Clear 4-Column Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
        {/* Brand Summary */}
        <div className="md:col-span-5 space-y-3">
          <Link href="/" className="inline-block">
            <span className="font-serif text-2xl font-bold tracking-tight text-[#5B1020]">
              {MERCHANT_CONFIG.BRAND_NAME}
            </span>
          </Link>
          <p className="text-xs font-serif uppercase tracking-[0.2em] text-gold-700 font-semibold">
            Silk City of Andhra Pradesh • Estd. {MERCHANT_CONFIG.ESTABLISHED_YEAR}
          </p>
          <p className="text-sm text-loom-charcoal/80 leading-relaxed max-w-sm pt-1">
            Handcrafted pure mulberry silk sarees with authentic double-shuttle Korvai temple borders, delivered directly from traditional master pit-looms to your wardrobe.
          </p>
        </div>

        {/* Collections */}
        <div className="md:col-span-2 space-y-3">
          <h5 className="font-serif font-bold text-xs uppercase tracking-widest text-[#5B1020]">
            Collections
          </h5>
          <ul className="space-y-2.5 text-sm text-loom-charcoal/80">
            <li>
              <Link href="/collections/pure-silk" className="hover:text-maroon transition-colors">
                Pure Mulberry Silk
              </Link>
            </li>
            <li>
              <Link href="/collections/semi-silk" className="hover:text-maroon transition-colors">
                Semi-Silk Festive
              </Link>
            </li>
            <li>
              <Link href="/collections/handloom-bridal" className="hover:text-maroon transition-colors">
                Bridal Handloom Heirloom
              </Link>
            </li>
            <li>
              <Link href="/collections/all" className="hover:text-maroon transition-colors">
                All Saree Weaves
              </Link>
            </li>
            <li>
              <Link href="/wholesale" className="hover:text-maroon font-semibold text-gold-700 transition-colors">
                B2B Wholesale
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Links & Trust */}
        <div className="md:col-span-2 space-y-3">
          <h5 className="font-serif font-bold text-xs uppercase tracking-widest text-[#5B1020]">
            Weave & Trust
          </h5>
          <ul className="space-y-2.5 text-sm text-loom-charcoal/80">
            <li>
              <Link href="/about" className="hover:text-maroon transition-colors">
                50+ Year Heritage
              </Link>
            </li>
            <li>
              <Link href="/collections/pure-silk" className="hover:text-maroon transition-colors">
                Silk Mark Verification
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={() => setFaqOpen((prev) => !prev)}
                className="hover:text-maroon transition-colors text-left"
                aria-expanded={faqOpen}
                aria-controls="footer-faqs-panel"
              >
                FAQs
              </button>
            </li>
            <li>
              <Link href="/wholesale" className="hover:text-maroon transition-colors">
                Wholesale Catalog
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="md:col-span-3 space-y-3">
          <h5 className="font-serif font-bold text-xs uppercase tracking-widest text-[#5B1020]">
            Loom Shed Contact
          </h5>
          <div className="space-y-2.5 text-sm text-loom-charcoal/80">
            <p className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-maroon shrink-0 mt-0.5" />
              <span>{MERCHANT_CONFIG.ORIGIN_LOCATION}</span>
            </p>
            <p className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-maroon shrink-0" />
              <a
                href={`https://wa.me/${MERCHANT_CONFIG.WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-maroon font-medium text-maroon"
              >
                +{MERCHANT_CONFIG.WHATSAPP_NUMBER} (WhatsApp)
              </a>
            </p>
            <p className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-maroon shrink-0" />
              <span>orders@dharmavaramlooms.com</span>
            </p>
          </div>
        </div>
      </div>

      {/* Small Expandable FAQ Drawer / Panel */}
      {faqOpen && (
        <div
          id="footer-faqs-panel"
          className="border-t border-b border-loom-border/80 bg-[#FAF3E8] py-8 px-4 sm:px-6 lg:px-8 animate-fadeIn"
        >
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-loom-border/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#5B1020] text-gold-300 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4 text-[#E5B842]" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-[#5B1020]">
                    Frequently Asked Questions (FAQs)
                  </h4>
                  <p className="text-xs text-loom-stone">
                    Quick guide to handloom authenticity, dispatch, and ordering.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setFaqOpen(false)}
                className="text-xs px-3 py-1.5 rounded-lg bg-white border border-loom-border hover:bg-[#24060E] hover:text-white text-loom-charcoal font-semibold flex items-center gap-1.5 transition-all shadow-2xs"
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
                  className="p-4 rounded-xl bg-white border border-loom-border/70 shadow-2xs space-y-2 flex flex-col justify-between"
                >
                  <h5 className="font-serif font-bold text-sm text-[#5B1020] leading-snug">
                    {faq.q}
                  </h5>
                  <p className="text-loom-charcoal/80 leading-relaxed text-[11px] sm:text-xs">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center text-xs text-loom-stone flex flex-wrap items-center justify-center gap-2">
              <span>Have a specific weaving question or want to inspect a pallu live?</span>
              <a
                href={`https://wa.me/${MERCHANT_CONFIG.WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="text-[#5B1020] font-semibold underline hover:text-maroon flex items-center gap-1"
              >
                <span>Chat directly with our master loom on WhatsApp</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Clean Copyright Bar */}
      <div className="border-t border-loom-border/50 py-6 bg-canvas/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-loom-charcoal/65">
          <p>© {new Date().getFullYear()} SSvSS. Handcrafted in Dharmavaram, Andhra Pradesh. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
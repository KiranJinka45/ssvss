"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Phone, Mail, ShieldCheck, Truck, Sparkles, Award } from "lucide-react";
import { MERCHANT_CONFIG } from "@/lib/config";

export function Footer() {
  const pathname = usePathname();

  // Do not render storefront footer on admin console
  if (pathname?.startsWith("/admin")) {
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
              <Link href="/#heritage-story" className="hover:text-maroon transition-colors">
                50+ Year Heritage
              </Link>
            </li>
            <li>
              <Link href="/collections/pure-silk" className="hover:text-maroon transition-colors">
                Silk Mark Verification
              </Link>
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

      {/* Clean Copyright & Registry Bar */}
      <div className="border-t border-loom-border/50 py-6 bg-canvas/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-loom-charcoal/65">
          <p>© {new Date().getFullYear()} {MERCHANT_CONFIG.BRAND_NAME}. Handcrafted in Dharmavaram, Andhra Pradesh.</p>
          <p className="text-[11px] text-loom-charcoal/50">
            GSTIN: <span className="font-mono">{MERCHANT_CONFIG.GSTIN}</span> • Silk Mark: <span className="font-mono">{MERCHANT_CONFIG.SILK_MARK_ID}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
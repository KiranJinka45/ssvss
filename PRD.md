# Dharmavaram Silk Sarees — Product Requirements Document (PRD)

## Project Vision & Revenue Target
- **Brand:** Authentic Direct-from-Loom Dharmavaram Silk Sarees (Dharmavaram, Sri Sathya Sai District, Andhra Pradesh).
- **Quality Standard:** Central Silk Board Silk Mark Certified, Zero Middlemen, Pure Zari & Weave Heritage, Registered GST & Current Account.
- **Financial Goal:** Scale from December 1, 2026 launch to **₹1 Crore+ ARR** and **₹30 Lakhs+ Net Profit in 2027**.
- **Funnel Focus:** Zero-Gateway-Leakage Social Commerce (75%+ traffic from Instagram Reels, YouTube Shorts, Facebook & WhatsApp Status on mobile).

---

## 1. Feature Checklist & Implementation Status

### Core Infrastructure & Architecture
- [x] Next.js 15+ App Router with TypeScript (Strict Mode) & Tailwind CSS
- [x] Persistent Harness (`PRD.md`, `ARCHITECTURE.md`, `PROGRESS.md`, `.env.example`)
- [x] Safe local data catalog with Supabase optional sync and graceful fallback
- [x] INR Currency Formatting, 5% Textile GST calculation & Showroom Anchor Comparison Math
- [x] WhatsApp deep-link generation for instant 0% gateway fee orders, live video calls, and wholesale quotes

### Catalog & State Management
- [x] 12 Authentic Dharmavaram SKUs (4 Semi-Silk Festive, 4 Pure Silk Wedding, 4 Handloom Bridal Heirloom)
- [x] Weaver COGS, purity, weight in grams, loom location, and stock status tracking
- [x] Zustand Client State (`useCartStore.ts`) supporting Retail D2C Cart, B2B Bulk Tier Cart, and Wishlist

### Luxury Editorial Design & Front-End UI
- [x] Royal Dharmavaram Editorial visual identity (Ivory `#FAF7F2`, Kumkum Maroon `#5C1624`, Temple Gold `#C59B27`, Silk Mark Emerald `#166534`)
- [x] Announcement bar with live ticker (Silk Mark Certified, Free Insured Shipping across India, Dispatch in 24 hrs)
- [x] Editorial Hero with authentic Dharmavaram storytelling & Direct Loom CTA
- [x] Category Rail with showroom anchor comparisons (Semi-Silk @ ₹3,200 vs ₹4,800; Pure Silk @ ₹12,500 vs ₹18,500; Handloom @ ₹16,000+ vs ₹24,000+)
- [x] Interactive Loom-to-Wardrobe Middleman Cost Breakdown Visualizer
- [x] Live Loom WhatsApp Video Call Banner & Modal (2-minute instant loom inspection)
- [x] Product Card with Silk Mark badge, Zari zoom preview, and direct WhatsApp order CTA
- [x] Product Detail Page (PDP) with Zari Loupe inspection, sunlight reel preview, fabric/zari specifications, and sticky mobile action bar

### B2B Wholesale Portal (`/wholesale`)
- [x] Passcode-protected entrance (Default: `DHARMAVARAM2027`)
- [x] Bulk Tier Pricing Engine (10-24 units: 18% off; 25-49 units: 25% off; 50+ units: 32% off)
- [x] Live Wholesale Order Calculator with margin savings and GSTIN validation
- [x] Direct WhatsApp B2B Proforma Invoice generation

### Merchant Admin & Operations (`/admin`)
- [x] PIN-protected operations dashboard (Default: `2027`)
- [x] 1-Click SKU Stock Toggle (`IN_STOCK`, `WEAVER_HOLD`, `SOLD_OUT`)
- [x] Unit Economics & Profit Margin Calculator (Retail price vs Weaver COGS, packaging, ad spend, and net profit margin)
- [x] Export & quick ledger view for weaver payouts and stock reconciliation

### APIs & Verification
- [x] `/api/health` health check endpoint
- [x] `/api/leads` video call booking & B2B inquiry capture endpoint
- [x] Automated verification script for WhatsApp links, INR math, and B2B discounts (`scripts/verify-engine.js` passing 100%)
- [x] Zero TypeScript errors (`npx tsc --noEmit` code 0) and clean production build (`npm run build` code 0, 24/24 static routes generated)

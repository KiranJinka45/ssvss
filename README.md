# SSVSS — Sri Siddi Vinayaka Silk Sarees
### Authentic Dharmavaram Handloom Silk Looms • Established 1974

Luxury D2C & B2B Social Commerce Storefront for authentic **Dharmavaram Handloom Silk Sarees** direct from master pit-loom artisans in Sri Sathya Sai District, Andhra Pradesh.

---

## 🌟 Key Features

- **Kalanjali-Inspired Editorial Hero Banner**: 5-slide 3-second auto-rotating full-figure showcase highlighting pure mulberry silk and Korvai temple weaves with 15% festive privilege integration.
- **Pushpalatha Silks Luxury Marquee**: Continuous smooth scrolling marquee ticker displaying Silk Mark certification and pit-loom trust badges.
- **Pushpalatha Silks Product Detail Experience**:
  - High-res photo gallery with thumbnail switching
  - Direct pit-loom pricing, M.R.P savings, and free delivery highlights
  - 2-Column specification card (`FABRIC` | `COLOR`)
  - Interactive quantity selector with real-time stock indicator
  - **Add to Cart** and **Instant Buy on WhatsApp** with automated order summaries
  - Floating WhatsApp customer support button
- **Customer Authentication Portal (`/login`)**: Sleek sign-in & registration portal with one-tap WhatsApp login, accessible right beside the Cart button on all pages.
- **B2B Wholesale Portal (`/wholesale`)**: Tiered wholesale discount engine (MOQ 10, 25, 50 units) for bridal boutiques and retail showrooms.
- **Merchant Inventory & Margin Desk (`/admin`)**: Founder desk for managing pit-loom stock, COGS, and daily weaver payout ledgers.
- **Silk Mark Certified**: Central Silk Board authorized 100% pure mulberry silk authentication.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+ (App Router)](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand (Local Storage persistence)
- **Icons**: Lucide React
- **Commerce**: WhatsApp Social Commerce Engine + Direct Current Account UPI

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env.local` file with your configuration:
```env
NEXT_PUBLIC_BRAND_NAME="Sri Siddi Vinayaka Silk Sarees"
NEXT_PUBLIC_WHATSAPP_NUMBER="919493348129"
NEXT_PUBLIC_SILK_MARK_ID="CSB/AP/DHM/2026/894"
NEXT_PUBLIC_GSTIN="37AAJCS8921M1ZX"
NEXT_PUBLIC_UPI_ID="dharmavaramlooms@icici"
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 📦 Project Structure

```
├── app/
│   ├── collections/      # Pure silk, semi-silk, and bridal category pages
│   ├── product/[sku]/    # Luxury product detail page (Pushpalatha style)
│   ├── wholesale/        # B2B Boutique Wholesale Tier Portal
│   ├── admin/            # Merchant Inventory & Founder Desk
│   ├── login/            # Customer Login & Registration Portal
│   ├── layout.tsx        # Global Root Layout with Scrolling Ticker & Navbar
│   └── page.tsx          # Homepage with Kalanjali Hero & Collections
├── components/
│   ├── home/             # HeroEditorial, CategoryRail, VideoCallBanner
│   ├── layout/           # Navbar with Scrolling Marquee & Simplified Footer
│   ├── product/          # ProductDetailView, ProductCard
│   ├── cart/             # CartDrawer with Multi-Item WhatsApp Checkout
│   └── b2b/              # WholesalePortal with Tier Simulators
├── data/
│   └── catalog.ts        # 12 Handcrafted Dharmavaram Silk Sarees
└── public/
    └── images/           # High-resolution model and saree photography
```

---

## 📜 License & Provenance

© 2026–2027 **Sri Siddi Vinayaka Silk Sarees (Dharmavaram Handloom Silk Looms)**. All rights reserved.  
Central Silk Board Silk Mark Authorized • Handcrafted in Dharmavaram, Sri Sathya Sai District, Andhra Pradesh.

# Architecture & Technical Specifications

## 1. System Overview
Mobile-first luxury D2C + B2B Dharmavaram Silk Saree storefront with zero-gateway-leakage WhatsApp social commerce integration.

```
[Customer on Mobile (IG/YT/FB/WA)]
         │
         ├───► [Next.js 15 App Router Frontend] (Vercel)
         │           │
         │           ├──► [Zustand Cart & Wishlist Store] (localStorage persist)
         │           ├──► [Dynamic WhatsApp Deep Link Generator] (wa.me)
         │           ├──► [Zari Loupe & 9:16 Sunlight Reel Preview]
         │           └──► [Passcode Wholesale & Admin Dashboards]
         │
         ├───► [/api/leads] ──────────► [Supabase PostgreSQL / Safe Local Fallback]
         └───► [Direct Merchant WhatsApp] (UPI Current Account / Live Loom Video Call)
```

---

## 2. Database Schema (Supabase PostgreSQL / Fallback JSON)

### 2.1 `products`
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku VARCHAR(32) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(64) NOT NULL, -- 'semi-silk' | 'pure-silk' | 'handloom-bridal'
  price INTEGER NOT NULL, -- In INR (e.g. 12500)
  showroom_price INTEGER NOT NULL, -- Anchor (e.g. 18500)
  weaver_cogs INTEGER NOT NULL, -- Cost paid to weaver (e.g. 7800)
  fabric VARCHAR(128) NOT NULL, -- e.g. "Pure Mulberry Silk (Silk Mark Certified)"
  zari_type VARCHAR(128) NOT NULL, -- e.g. "3G Antique Gold Zari"
  silk_weight_grams INTEGER NOT NULL, -- e.g. 720
  weave_time_days INTEGER NOT NULL, -- e.g. 14
  weaver_name VARCHAR(128) NOT NULL,
  loom_location VARCHAR(128) NOT NULL, -- e.g. "Kothapeta Weaver Cluster, Dharmavaram"
  description TEXT NOT NULL,
  blouse_included BOOLEAN DEFAULT true,
  silk_mark_certified BOOLEAN DEFAULT true,
  stock_status VARCHAR(32) DEFAULT 'IN_STOCK', -- 'IN_STOCK' | 'WEAVER_HOLD' | 'SOLD_OUT'
  stock_count INTEGER DEFAULT 1,
  images TEXT[] NOT NULL,
  reel_video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.2 `orders`
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(64) UNIQUE NOT NULL,
  channel VARCHAR(32) NOT NULL, -- 'WHATSAPP' | 'DIRECT_UPI' | 'ONLINE_GATEWAY' | 'B2B_WHOLESALE'
  customer_name VARCHAR(128) NOT NULL,
  customer_phone VARCHAR(32) NOT NULL,
  items JSONB NOT NULL,
  subtotal INTEGER NOT NULL,
  gst_amount INTEGER NOT NULL,
  total_amount INTEGER NOT NULL,
  status VARCHAR(32) DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.3 `video_call_bookings`
```sql
CREATE TABLE video_call_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR(128) NOT NULL,
  customer_phone VARCHAR(32) NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time_slot VARCHAR(64) NOT NULL,
  interested_sku VARCHAR(32),
  source_page VARCHAR(255),
  status VARCHAR(32) DEFAULT 'CONFIRMED_VIA_WHATSAPP',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.4 `b2b_inquiries`
```sql
CREATE TABLE b2b_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  boutique_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(128) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  gstin VARCHAR(32),
  city VARCHAR(128) NOT NULL,
  estimated_moq INTEGER NOT NULL,
  selected_tier VARCHAR(32) NOT NULL,
  estimated_value INTEGER NOT NULL,
  status VARCHAR(32) DEFAULT 'NEW',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 3. WhatsApp Deep Link Specification (`wa.me`)

All WhatsApp URLs follow URL-encoded parameters with pre-structured messages to prevent cart drop-off:

1. **Instant Order Link:**
   ```
   https://wa.me/919494392027?text=Namaste%20Dharmavaram%20Weavers!%0A%0AI%20would%20like%20to%20order:%0A*Product:*%20{title}%0A*SKU:*%20{sku}%0A*Loom%20Price:*%20Rs.{price}%20(Incl.%205%%20GST)%0A*Finish:*%20{finish_option}%0A%0APlease%20share%20your%20Current%20Account%20UPI%20QR%20for%20direct%20payment%20and%20shipping%20dispatch.
   ```

2. **Live Loom Video Call Booking:**
   ```
   https://wa.me/919494392027?text=Namaste!%20I%20would%20like%20to%20book%20a%202-Minute%20Live%20Loom%20Video%20Call%20to%20inspect%20saree%20details.%0A*Interested%20SKU:*%20{sku}%0A*Name:*%20{name}%0A*Preferred%20Date%20&%20Time:*%20{slot}
   ```

3. **B2B Boutique Wholesale Proforma:**
   ```
   https://wa.me/919494392027?text=Namaste%20Dharmavaram%20Handloom%20Export!%0A%0A*B2B%20Wholesale%20Inquiry*%0A*Boutique:*%20{boutique}%0A*GSTIN:*%20{gstin}%0A*MOQ%20Tier:*%20{moq_tier}%20({units}%20Sarees)%0A*Estimated%20Total:*%20Rs.{total}%0A%0APlease%20send%20official%20catalog%20PDF%20and%20bank%20NEFT%20details.
   ```

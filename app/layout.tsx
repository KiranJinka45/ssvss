import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AuthGate } from "@/components/auth/AuthGate";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#24060E",
};

export const metadata: Metadata = {
  title: "Dharmavaram Silk Sarees | Direct from Pit-Looms | Silk Mark Certified",
  description:
    "Authentic handloom Dharmavaram Silk Sarees direct from master pit-loom weavers in Sri Sathya Sai District, Andhra Pradesh. Pure mulberry silk, 3G antique gold zari, Korvai borders. Central Silk Board Silk Mark certified at zero middleman markup.",
  keywords: [
    "Dharmavaram Silk Sarees",
    "Pure Pattu Sarees",
    "Handloom Silk Saree",
    "Silk Mark Certified Saree",
    "Wedding Silk Saree",
    "Dharmavaram Pattu",
    "Direct from Loom Saree",
    "Korvai Border Saree",
  ],
  openGraph: {
    title: "Dharmavaram Silk Sarees | Direct From Master Pit-Looms",
    description: "Save 30-40% direct from weaver pit-looms. Central Silk Board certified pure silk.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-canvas text-loom-charcoal antialiased">
        <AuthGate>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </AuthGate>
      </body>
    </html>
  );
}

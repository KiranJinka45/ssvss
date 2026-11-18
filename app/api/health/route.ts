import { NextResponse } from "next/server";
import { CATALOG } from "@/data/catalog";
import { MERCHANT_CONFIG } from "@/lib/config";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: `${MERCHANT_CONFIG.BRAND_NAME} Commerce Engine`,
    version: "1.0.0",
    environment: process.env.NODE_ENV,
    skusLoaded: CATALOG.length,
    whatsappNumber: MERCHANT_CONFIG.WHATSAPP_NUMBER,
    timestamp: new Date().toISOString(),
  });
}

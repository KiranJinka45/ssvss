"use client";

import React, { useState } from "react";
import { X, Video, ShieldCheck, Sparkles, MessageCircle, Phone, CheckCircle2 } from "lucide-react";
import { generateLiveCallWhatsAppUrl } from "@/lib/whatsapp";
import { formatINR } from "@/lib/pricing";

interface LiveCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSku?: string;
  defaultTitle?: string;
  defaultPrice?: number;
}

export function LiveCallModal({
  isOpen,
  onClose,
  defaultSku,
  defaultTitle,
  defaultPrice,
}: LiveCallModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  if (!isOpen) return null;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    // Max 10 digits
    if (raw.length <= 10) {
      setPhone(raw);
      if (raw.length === 10) {
        setPhoneError("");
      }
    }
  };

  const handleStartCall = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      alert("Please enter your name.");
      return;
    }

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      setPhoneError("Please enter a valid 10-digit Indian mobile number");
      return;
    }

    setPhoneError("");
    setIsRedirecting(true);

    // 1. Non-blocking lead capture with keepalive
    try {
      fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "INSTANT_VIDEO_CALL",
          leadType: "video_call",
          name: customerName.trim(),
          phone: `+91${cleanPhone}`,
          sku: defaultSku || "GENERAL_SHOWCASE",
          productTitle: defaultTitle || "General Dharmavaram Loom Showcase",
          price: defaultPrice || null,
          timestamp: new Date().toISOString(),
        }),
        keepalive: true,
      }).catch((err) => console.warn("Lead log warning:", err));
    } catch (err) {
      console.warn("Lead dispatch warning:", err);
    }

    // 2. Generate instant WhatsApp URL
    const whatsappUrl = generateLiveCallWhatsAppUrl({
      customerName: customerName.trim(),
      customerPhone: cleanPhone,
      sku: defaultSku,
      productTitle: defaultTitle,
      price: defaultPrice,
    });

    // 3. Brief toast & redirect
    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
      setIsRedirecting(false);
      onClose();
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-loom-charcoal/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-canvas border-2 border-gold/50 shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-loom-stone hover:text-maroon hover:bg-canvas-surface transition-colors"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-full bg-silk-emeraldBg text-silk-emerald mb-2 border border-silk-emerald/30">
            <Video className="w-6 h-6 text-silk-emerald animate-pulse" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-maroon">
            Live Loom Video Inspection
          </h3>
          <p className="text-xs text-loom-bronze mt-1 leading-relaxed">
            Connect directly with our Dharmavaram master weavers over WhatsApp Video Call to inspect zari shine & pallu weave in real daylight.
          </p>

          {/* Saree Context Header */}
          <div className="mt-3.5 p-3 rounded-xl bg-canvas-surface border border-loom-border/80 text-left">
            {defaultTitle && defaultSku ? (
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gold-700 block">
                    Target Saree on Loom:
                  </span>
                  <h4 className="font-serif font-bold text-sm text-loom-charcoal truncate">
                    {defaultTitle}
                  </h4>
                  <span className="text-[11px] font-mono text-loom-stone font-semibold">
                    {defaultSku}
                  </span>
                </div>
                {defaultPrice && (
                  <span className="font-serif font-bold text-sm text-maroon shrink-0">
                    {formatINR(defaultPrice)}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold shrink-0" />
                <div>
                  <span className="font-serif font-bold text-xs text-loom-charcoal block">
                    General Dharmavaram Loom Showcase
                  </span>
                  <span className="text-[10px] text-loom-stone">
                    Our master weaver will show available pure silk & heirloom sarees live.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 2-Field Simplified Form */}
        <form onSubmit={handleStartCall} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-loom-charcoal mb-1">
              Your Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ananya Reddy"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white border border-loom-border text-sm text-loom-charcoal focus:border-maroon focus:outline-none shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-loom-charcoal mb-1">
              WhatsApp / Phone Number *
            </label>
            <div className="relative flex rounded-xl border border-loom-border overflow-hidden bg-white focus-within:border-maroon shadow-sm">
              <span className="px-3.5 py-3 bg-canvas-surface border-r border-loom-border text-xs font-bold text-loom-charcoal flex items-center gap-1">
                🇮🇳 +91
              </span>
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="9876543210"
                value={phone}
                onChange={handlePhoneChange}
                className="w-full px-3.5 py-3 text-sm text-loom-charcoal font-mono tracking-wider focus:outline-none"
              />
            </div>
            {phoneError && (
              <p className="text-[11px] text-red-600 mt-1 font-medium">{phoneError}</p>
            )}
          </div>

          {/* Trust Guarantees */}
          <div className="p-3 rounded-xl bg-canvas-surface border border-loom-border/60 text-[11px] text-loom-bronze space-y-1">
            <p className="flex items-center gap-1.5 font-semibold text-maroon">
              <CheckCircle2 className="w-3.5 h-3.5 text-silk-emerald" />
              Instant & 100% Free Consultation
            </p>
            <p className="text-loom-stone">
              No advance payment or obligation to buy. We will hold the saree under daylight, show reverse weave & pleat drape.
            </p>
          </div>

          {/* Primary Submit CTA with Pulsing WhatsApp Video Icon */}
          <button
            type="submit"
            disabled={isRedirecting}
            className="w-full py-4 px-5 rounded-2xl bg-silk-emerald hover:bg-emerald-800 text-canvas font-bold text-sm tracking-wide shadow-lg transition-all flex items-center justify-center gap-2.5 group relative overflow-hidden"
          >
            <div className="relative flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
            </div>
            <span>
              {isRedirecting
                ? "Connecting to Dharmavaram..."
                : "Start Live WhatsApp Video Call Now"}
            </span>
          </button>
        </form>

        {/* Dynamic Transition Banner when opening WhatsApp */}
        {isRedirecting && (
          <div className="mt-4 p-3 rounded-xl bg-gold-100 border border-gold/50 text-center animate-fadeIn">
            <p className="text-xs font-bold text-maroon flex items-center justify-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-silk-emerald fill-silk-emerald" />
              Opening WhatsApp...
            </p>
            <p className="text-[11px] text-loom-charcoal mt-0.5">
              Tap the <strong>Video Call camera icon</strong> at top right to connect live with Dharmavaram!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

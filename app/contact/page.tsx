"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Video,
  ShieldCheck,
  Truck,
  MessageCircle,
  Send,
  Sparkles,
  AlertCircle,
  Check,
} from "lucide-react";
import { MERCHANT_CONFIG } from "@/lib/config";
import { validateIndianMobile } from "@/lib/phoneValidation";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [requirement, setRequirement] = useState("Bridal Handloom Saree");
  const [message, setMessage] = useState("");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (raw.length <= 10) {
      setPhone(raw);
      if (raw.length > 0) {
        if (!["6", "7", "8", "9"].includes(raw[0])) {
          setPhoneError(`Indian mobile numbers must start with 6, 7, 8, or 9 (starts with '${raw[0]}')`);
        } else if (raw.length === 10) {
          const res = validateIndianMobile(raw);
          setPhoneError(res.isValid ? "" : (res.error || "Invalid mobile number"));
        } else {
          setPhoneError("");
        }
      } else {
        setPhoneError("");
      }
    }
  };

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneRes = validateIndianMobile(phone);
    if (!phoneRes.isValid) {
      setPhoneError(phoneRes.error || "Please enter a valid 10-digit Indian mobile number");
      return;
    }
    setPhoneError("");
    const text = `Namaste SSVSS Master Looms,\n\nMy Name: ${name || "Patron"}\nPhone: +91 ${phoneRes.cleanPhone}\nRequirement: ${requirement}\nNote: ${message || "I would like to inquire about your authentic Dharmavaram silk sarees."}`;
    const url = `https://wa.me/${MERCHANT_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-loom-charcoal">
      {/* Header Banner */}
      <section className="py-14 sm:py-20 bg-[#24060E] text-[#FAF7F2] border-b border-[#E5B842]/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5B842]/15 border border-[#E5B842]/40 text-[#E5B842] text-xs font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Direct Artisan Support</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#F5EFE6]">
            Get In Touch With Our Master Looms
          </h1>

          <p className="text-sm sm:text-base text-[#D4C3A3] max-w-xl mx-auto font-light leading-relaxed">
            Have questions about silk purity, bridal customization, or want to inspect a weave live on video call?
            Our artisan team in Dharmavaram is ready to assist you.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16 py-14 sm:py-18">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Direct Contact Info & Video Call Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-loom-border/80 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8B263E] block">
                  Loom Shed Location
                </span>
                <h2 className="font-serif text-xl font-bold text-[#5B1020] mt-1">
                  Dharmavaram Weaver Guild
                </h2>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-[#FAF3E8] text-[#5B1020] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-loom-charcoal">Master Pit-Looms & Storefront</h3>
                    <p className="text-loom-charcoal/75 leading-relaxed mt-0.5">
                      {MERCHANT_CONFIG.ORIGIN_LOCATION}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-[#FAF3E8] text-[#5B1020] flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-loom-charcoal">WhatsApp & Direct Phone</h3>
                    <a
                      href={`https://wa.me/${MERCHANT_CONFIG.WHATSAPP_NUMBER}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#8B263E] font-semibold hover:underline block mt-0.5"
                    >
                      +{MERCHANT_CONFIG.WHATSAPP_NUMBER}
                    </a>
                    <span className="text-[11px] text-loom-stone">Instant WhatsApp messaging & video calls</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-[#FAF3E8] text-[#5B1020] flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-loom-charcoal">Email Inquiries</h3>
                    <p className="text-loom-charcoal/75 mt-0.5">orders@dharmavaramlooms.com</p>
                    <span className="text-[11px] text-loom-stone">For bridal trousseaus & bulk orders</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-[#FAF3E8] text-[#5B1020] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-loom-charcoal">Weaving Hours</h3>
                    <p className="text-loom-charcoal/75 mt-0.5">Monday to Sunday: 9:00 AM – 9:00 PM IST</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Live WhatsApp Video Call Promo Box */}
            <div className="rounded-2xl p-6 bg-[#24060E] text-[#FAF7F2] border border-[#E5B842]/40 shadow-lg space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E5B842]/20 flex items-center justify-center text-[#E5B842]">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#F5EFE6]">
                    Live Video Call Inspection
                  </h3>
                  <p className="text-xs text-[#E5B842]">1-on-1 Loom Demonstration</p>
                </div>
              </div>

              <p className="text-xs text-[#D4C3A3] leading-relaxed">
                Want to examine the pallu sheen, zari texture, and drape in natural daylight?
                Message us on WhatsApp to start an instant video call directly from our pit-loom shed.
              </p>

              <a
                href={`https://wa.me/${MERCHANT_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent("Namaste! I would like to book a 5-minute WhatsApp video call to inspect your silk sarees.")}`}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#128C7E] hover:bg-[#075E54] text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Start Video Call on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Column: Direct Artisan Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-loom-border/80 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8B263E] block">
                  Direct Weaver Inquiry
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#5B1020] mt-1">
                  Send a Direct Message
                </h2>
                <p className="text-xs sm:text-sm text-loom-charcoal/70 mt-1">
                  Fill out the form below. Your message will be formatted and routed directly to our master artisan WhatsApp desk.
                </p>
              </div>

              <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-loom-charcoal uppercase tracking-wider mb-1.5">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Radhika Sharma"
                    className="w-full px-4 py-2.5 rounded-xl border border-loom-border text-sm focus:outline-none focus:ring-2 focus:ring-[#5B1020] bg-[#FAF7F2]/50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-loom-charcoal uppercase tracking-wider">
                        Phone / WhatsApp Number *
                      </label>
                      {phone.length === 10 && !phoneError && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                          <Check className="w-3.5 h-3.5" /> Valid
                        </span>
                      )}
                    </div>
                    <div className="relative flex rounded-xl border border-loom-border overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#5B1020]">
                      <span className="px-3 py-2.5 bg-canvas-surface border-r border-loom-border text-xs font-bold text-loom-charcoal flex items-center shrink-0">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={phone}
                        onChange={handlePhoneChange}
                        placeholder="9876543210"
                        className="w-full px-3 py-2.5 text-sm focus:outline-none bg-transparent"
                      />
                    </div>
                    {phoneError ? (
                      <p className="text-[11px] text-red-600 mt-1 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{phoneError}</span>
                      </p>
                    ) : (
                      <p className="text-[10px] text-loom-stone mt-1">
                        Must be a valid 10-digit number starting with 6, 7, 8, or 9
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-loom-charcoal uppercase tracking-wider mb-1.5">
                      Requirement Category
                    </label>
                    <select
                      value={requirement}
                      onChange={(e) => setRequirement(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-loom-border text-sm focus:outline-none focus:ring-2 focus:ring-[#5B1020] bg-[#FAF7F2]/50"
                    >
                      <option value="Bridal Handloom Saree">Bridal Handloom Heirloom</option>
                      <option value="Pure Mulberry Silk Saree">Pure Mulberry Silk</option>
                      <option value="Semi-Silk Festive Saree">Semi-Silk Festive</option>
                      <option value="Custom Loom Order / Trousseau">Custom Wedding Trousseau</option>
                      <option value="B2B Wholesale / Bulk Purchase">B2B Wholesale (MOQ 10+)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-loom-charcoal uppercase tracking-wider mb-1.5">
                    Your Message / Specific Color or Motif
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please mention your preferred colors, wedding date, or specific weave queries..."
                    className="w-full px-4 py-2.5 rounded-xl border border-loom-border text-sm focus:outline-none focus:ring-2 focus:ring-[#5B1020] bg-[#FAF7F2]/50 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-[#5B1020] hover:bg-[#3D0A15] text-[#FAF7F2] font-semibold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 group"
                >
                  <Send className="w-4 h-4 text-[#E5B842] group-hover:translate-x-1 transition-transform" />
                  <span>Send Inquiry Directly on WhatsApp</span>
                </button>
              </form>

              {/* Trust Badges */}
              <div className="pt-4 border-t border-loom-border/60 grid grid-cols-2 gap-4 text-xs text-loom-stone">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Silk Mark Guaranteed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>Insured All-India Transit</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

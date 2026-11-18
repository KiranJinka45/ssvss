"use client";

import React, { useState } from "react";
import { Video, Sparkles, Sun, CheckCircle2, PhoneCall } from "lucide-react";
import { LiveCallModal } from "@/components/product/LiveCallModal";

export function VideoCallBanner() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section id="video-inspection" className="py-16 bg-gradient-to-r from-maroon via-maroon-700 to-maroon text-canvas relative overflow-hidden">
      {/* Decorative Gold Elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/5 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 text-gold-400 text-xs font-semibold tracking-wider uppercase border border-gold/40">
              <Sun className="w-3.5 h-3.5" />
              <span>Dharmavaram Loom-Floor Transparency</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Can&apos;t Visit Dharmavaram in Person? <br className="hidden sm:inline" />
              <span className="text-gold-400 italic font-normal">
                Inspect Any Saree on a 2-Minute Live WhatsApp Video Call.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-canvas/80 max-w-2xl leading-relaxed">
              Don&apos;t rely on edited catalog photos. Our weaving team will walk onto the loom floor, drape the saree in natural morning sunlight, flip the border to verify Korvai interlocking, and zoom into the pallu zari before you pay.
            </p>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-canvas/90 pt-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-gold-400" />
                True Sunlight Color Verification
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-gold-400" />
                Korvai Hand-Interlock Check
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-gold-400" />
                Zero Obligation to Buy
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center lg:items-end">
            <div className="w-full max-w-sm p-6 rounded-2xl bg-canvas/10 backdrop-blur-md border border-gold/30 text-center space-y-4 shadow-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-gold-400 block">
                Direct Loom Video Desk
              </span>
              <p className="text-xs text-canvas/80">
                Available daily from 10:00 AM to 06:00 PM directly from our Kothapeta weaving cluster.
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="w-full py-3.5 px-5 rounded-xl bg-gold hover:bg-gold-600 text-maroon-900 font-bold text-sm tracking-wide shadow-goldGlow transition-all flex items-center justify-center gap-2 group"
              >
                <Video className="w-4 h-4 text-maroon-900 group-hover:scale-110 transition-transform" />
                <span>Start Live Video Call Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <LiveCallModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}

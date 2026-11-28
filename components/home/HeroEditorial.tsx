"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Video } from "lucide-react";
import { DEFAULT_HERO_SLIDES, HeroSlide } from "@/lib/collectionsStore";
import { LiveCallModal } from "@/components/product/LiveCallModal";

function CornerFiligree({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={`w-8 h-8 sm:w-10 sm:h-10 text-[#C59B27]/70 pointer-events-none ${className || ""}`}
    >
      <path
        d="M4 44V16C4 9.373 9.373 4 16 4H44"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M9 36V18C9 13.029 13.029 9 18 9H36"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeOpacity="0.65"
      />
      <circle cx="14" cy="14" r="2" fill="currentColor" fillOpacity="0.7" />
      <path
        d="M4 22C7.5 22 10 19.5 10 16M22 4C22 7.5 19.5 10 16 10"
        stroke="currentColor"
        strokeWidth="0.9"
      />
    </svg>
  );
}

export function HeroEditorial() {
  const [slides, setSlides] = useState<HeroSlide[]>(DEFAULT_HERO_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);

  // Touch swipe support for mobile devices
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const minSwipeDistance = 45;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    if (distance > minSwipeDistance) {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    } else if (distance < -minSwipeDistance) {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };

  // Load custom hero slides only if genuinely customized with rich text
  useEffect(() => {
    try {
      const saved = localStorage.getItem("loom_hero_slides");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          Array.isArray(parsed) &&
          parsed.length >= 3 &&
          !parsed.some((s: HeroSlide) => s.image?.includes("banner-set1"))
        ) {
          setSlides(parsed);
        }
      }
    } catch (e) {
      console.warn("Could not load custom hero slides:", e);
    }
  }, []);

  // Auto-advance both image and text every 4.5 seconds, pause on hover
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#FAF7F2] border-b border-loom-border/60">
      <div
        className="relative w-full min-h-[680px] sm:min-h-[720px] lg:min-h-[540px] lg:h-[calc(100vh-104px)] lg:max-h-[760px] select-none overflow-hidden group touch-pan-y"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Full Split-Screen Slides (Image + Text transition together) */}
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          const highlights = slide.highlights || [
            "100% Pure Mulberry Silk",
            "Silk Mark Certified",
            "Direct from Artisan Weavers",
          ];

          return (
            <div
              key={slide.id || index}
              className={`absolute inset-0 grid grid-cols-1 lg:grid-cols-2 transition-all duration-700 ease-in-out ${
                isActive
                  ? "opacity-100 translate-x-0 z-10 pointer-events-auto"
                  : "opacity-0 translate-x-4 z-0 pointer-events-none"
              }`}
            >
              {/* Left 50%: Portrait Saree Photo */}
              <div className="relative w-full h-[360px] sm:h-[420px] lg:h-full overflow-hidden bg-[#EAE3D5]">
                <Link
                  href={slide.href}
                  className="block w-full h-full relative cursor-pointer"
                  title={slide.title}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slide.image}
                    alt={`${slide.title} ${slide.titleAccent || ""}`}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover object-top"
                  />
                </Link>
              </div>

              {/* Right 50%: Ornamental Heritage Card with Slide-Specific Copy */}
              <div className="relative flex items-center justify-center bg-[#FAF7F2] p-4 sm:p-6 lg:p-8">
                <div className="relative w-full h-full flex flex-col items-center justify-center text-center px-6 py-8 sm:px-10 sm:py-10 border border-[#C59B27]/45 bg-[#FCF9F3] shadow-xs">
                  {/* 4 Gold Corner Filigrees */}
                  <CornerFiligree className="absolute top-2 left-2" />
                  <CornerFiligree className="absolute top-2 right-2 rotate-90" />
                  <CornerFiligree className="absolute bottom-2 right-2 rotate-180" />
                  <CornerFiligree className="absolute bottom-2 left-2 -rotate-90" />

                  {/* Eyebrow */}
                  <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-[#8E6F2E] mb-3">
                    {slide.eyebrow || "HERITAGE HANDLOOM SILK LOOMS • ESTD. 1974"}
                  </p>

                  {/* Ornamental Gold Divider */}
                  <div className="flex items-center justify-center gap-2 mb-4 w-48">
                    <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C59B27]/60" />
                    <span className="text-[#C59B27] text-xs">✦</span>
                    <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C59B27]/60" />
                  </div>

                  {/* Main Display Headline */}
                  <h1 className="font-serif text-3xl sm:text-4xl xl:text-[2.75rem] font-bold text-[#5B1020] leading-[1.15] tracking-tight">
                    {slide.title}
                  </h1>
                  {slide.titleAccent && (
                    <p className="font-serif text-xl sm:text-2xl xl:text-[1.7rem] text-[#5B1020] mt-1 font-medium">
                      {slide.titleAccent}
                    </p>
                  )}

                  {/* Subtitle / Description */}
                  <p className="text-xs sm:text-sm text-[#6E563F] mt-3 max-w-md leading-relaxed">
                    {slide.subtitle}
                  </p>

                  {/* Divider */}
                  <div className="flex items-center justify-center gap-2 my-5 w-56">
                    <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C59B27]/50" />
                    <span className="text-[#C59B27] text-[10px]">❖</span>
                    <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C59B27]/50" />
                  </div>

                  {/* 3 Slide-Specific Trust Bullets */}
                  <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] sm:text-xs text-[#4A3B2C] font-medium mb-6">
                    {highlights.map((bullet, bIdx) => (
                      <span key={bIdx}>• {bullet}</span>
                    ))}
                  </div>

                  {/* Primary & Secondary CTAs */}
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <Link
                      href={slide.href || "/collections/pure-silk"}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-b from-[#7B1A2E] to-[#5B1020] hover:from-[#5B1020] hover:to-[#3D0A15] text-[#FAF7F2] text-xs sm:text-sm font-semibold shadow-md border border-[#C59B27]/40 transition-all hover:scale-[1.02] active:scale-95"
                    >
                      <span>{slide.ctaLabel || "Explore Collection"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setCallModalOpen(true)}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#5B1020] hover:text-[#8B263E] underline-offset-4 hover:underline transition-colors py-2 px-1"
                    >
                      <Video className="w-3.5 h-3.5 text-[#C59B27]" />
                      <span>Schedule Video Call Inspection</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Outer Carousel Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Slide"
              className="absolute left-3 top-[180px] sm:top-[210px] lg:top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-black/45 hover:bg-black/75 text-white backdrop-blur-xs border border-white/20 shadow-md transition-all opacity-80 lg:opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Slide"
              className="absolute right-3 top-[180px] sm:top-[210px] lg:top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-[#5B1020]/80 hover:bg-[#5B1020] text-white backdrop-blur-xs border border-[#C59B27]/40 shadow-md transition-all opacity-80 lg:opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </>
        )}

        {/* Carousel Slide Indicators at Bottom Center */}
        {slides.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-[#5B1020]/85 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-[#C59B27]/40 shadow-sm">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  index === currentSlide
                    ? "w-6 h-1.5 bg-[#E5B842]"
                    : "w-1.5 h-1.5 bg-white/50 hover:bg-white"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Live Video Call Modal */}
      <LiveCallModal
        isOpen={callModalOpen}
        onClose={() => setCallModalOpen(false)}
      />
    </section>
  );
}

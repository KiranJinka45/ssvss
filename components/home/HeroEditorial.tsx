"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Video } from "lucide-react";
import { DEFAULT_HERO_SLIDES, HeroSlide } from "@/lib/collectionsStore";
import { LiveCallModal } from "@/components/product/LiveCallModal";

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
    <section className="relative w-full overflow-hidden bg-[#FAF7F2]">
      <div
        className="relative w-full min-h-[660px] sm:min-h-[700px] lg:min-h-[540px] lg:h-[calc(100vh-104px)] lg:max-h-[760px] select-none overflow-hidden group touch-pan-y"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Seamless Full-Width Slides (Image + Text transition together, zero border/outline) */}
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
              className={`absolute inset-0 grid grid-cols-1 lg:grid-cols-12 transition-all duration-700 ease-in-out ${
                isActive
                  ? "opacity-100 translate-x-0 z-10 pointer-events-auto"
                  : "opacity-0 translate-x-4 z-0 pointer-events-none"
              }`}
            >
              {/* Left Side: Portrait Saree Photo with Seamless Right-Edge Blend */}
              <div className="relative lg:col-span-6 w-full h-[360px] sm:h-[420px] lg:h-full overflow-hidden bg-[#FAF7F2]">
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
                  {/* Soft feather blend into the right-side cream canvas */}
                  <div className="hidden lg:block absolute inset-y-0 right-0 w-36 bg-gradient-to-r from-transparent via-[#FAF7F2]/60 to-[#FAF7F2] pointer-events-none" />
                  <div className="lg:hidden absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#FAF7F2] to-transparent pointer-events-none" />
                </Link>
              </div>

              {/* Right Side: Clean Open Editorial Text Beside Image (No Outline / No Box) */}
              <div className="relative lg:col-span-6 flex items-center justify-center bg-[#FAF7F2] px-6 py-8 sm:px-10 lg:px-14">
                <div className="w-full max-w-xl flex flex-col items-center text-center">
                  {/* Eyebrow */}
                  <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-[#8E6F2E] mb-3">
                    {slide.eyebrow || "HERITAGE HANDLOOM SILK LOOMS • ESTD. 1974"}
                  </p>

                  {/* Main Display Headline */}
                  <h1 className="font-serif text-3xl sm:text-4xl xl:text-[3rem] font-bold text-[#5B1020] leading-[1.12] tracking-tight">
                    {slide.title}
                  </h1>
                  {slide.titleAccent && (
                    <p className="font-serif text-2xl sm:text-3xl xl:text-[2.1rem] text-[#5B1020] mt-1 font-medium">
                      {slide.titleAccent}
                    </p>
                  )}

                  {/* Subtle Ornamental Divider */}
                  <div className="flex items-center justify-center gap-2.5 my-4 w-52">
                    <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C59B27]/60" />
                    <span className="text-[#C59B27] text-xs">❖</span>
                    <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C59B27]/60" />
                  </div>

                  {/* Subtitle / Description */}
                  <p className="text-xs sm:text-sm lg:text-base text-[#5E4A36] max-w-md leading-relaxed">
                    {slide.subtitle}
                  </p>

                  {/* 3 Slide-Specific Highlights */}
                  <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] sm:text-xs text-[#4A3B2C] font-medium mt-4 mb-6">
                    {highlights.map((bullet, bIdx) => (
                      <span key={bIdx}>• {bullet}</span>
                    ))}
                  </div>

                  {/* Primary & Secondary CTAs */}
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <Link
                      href={slide.href || "/collections/pure-silk"}
                      className="inline-flex items-center gap-2 px-7 py-3 rounded-lg bg-[#6B1224] hover:bg-[#4D0B18] text-[#FAF7F2] text-xs sm:text-sm font-semibold shadow-md transition-all hover:scale-[1.02] active:scale-95"
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
              className="absolute left-3 top-[180px] sm:top-[210px] lg:top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-all opacity-80 lg:opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Slide"
              className="absolute right-3 top-[180px] sm:top-[210px] lg:top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-[#5B1020]/75 hover:bg-[#5B1020] text-white backdrop-blur-xs transition-all opacity-80 lg:opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </>
        )}

        {/* Carousel Slide Indicators at Bottom Center */}
        {slides.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-[#5B1020]/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full shadow-sm">
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

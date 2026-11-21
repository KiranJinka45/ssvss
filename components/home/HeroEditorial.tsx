"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { DEFAULT_HERO_SLIDES, HeroSlide } from "@/lib/collectionsStore";

export function HeroEditorial() {
  const [slides, setSlides] = useState<HeroSlide[]>(DEFAULT_HERO_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Load custom hero slides from localStorage if configured
  useEffect(() => {
    try {
      const saved = localStorage.getItem("loom_hero_slides");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSlides(parsed);
        }
      }
    } catch (e) {
      console.warn("Could not load custom hero slides:", e);
    }
  }, []);

  // Auto-advance slides every 3.5 seconds, pause on hover
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3500);
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
    <section className="relative w-full overflow-hidden bg-[#FAF7F2] border-b border-loom-border/50">
      {/* 
        Full-Page Luxury Hero Carousel:
        - Occupies 100% of the screen height below navbar (1 full page)
        - Opaque backgrounds prevent any ghosting or overlapping text between slides
        - Subtle hover-only edge navigation arrows that never block the model or temple
        - Floating down-indicator linking to Master Weaver Creations (#showcase)
      */}
      <div
        className="relative w-full h-[calc(100vh-76px)] min-h-[480px] max-h-[850px] select-none overflow-hidden group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;

          return (
            <div
              key={slide.id || index}
              className={`absolute inset-0 bg-[#FAF7F2] transition-opacity duration-400 ease-in-out ${
                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <Link
                href={slide.href || "/collections"}
                className="block w-full h-full relative cursor-pointer"
                title={slide.title}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover object-center"
                  style={{
                    imageRendering: "-webkit-optimize-contrast",
                  }}
                />
              </Link>
            </div>
          );
        })}

        {/* Navigation Arrows - Only visible on hover, hugging edges so they never block model or text */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs border border-white/20 shadow-md transition-all opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs border border-white/20 shadow-md transition-all opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Carousel Indicators at Bottom Center - Positioned right above the scroll prompt */}
        {slides.length > 1 && (
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20 shadow-xs">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  index === currentSlide
                    ? "w-7 h-2 bg-[#E5B842] shadow-xs"
                    : "w-2 h-2 bg-white/50 hover:bg-white"
                }`}
              />
            ))}
          </div>
        )}

        {/* Subtle Floating Scroll Down Indicator to next section */}
        <a
          href="#showcase"
          className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/45 hover:bg-black/75 text-white/90 hover:text-white backdrop-blur-xs border border-white/20 text-[11px] font-medium tracking-wider uppercase transition-all shadow-md group-hover:scale-105"
        >
          <span>Explore Master Weaves</span>
          <ChevronDown className="w-3.5 h-3.5 animate-bounce text-[#E5B842]" />
        </a>
      </div>
    </section>
  );
}

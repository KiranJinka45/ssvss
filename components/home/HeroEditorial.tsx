"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

  // Check if any slide is a full upload (taller aspect ratio)
  const isFullUpload = slides[currentSlide]?.image?.includes("full-upload");

  return (
    <section className="relative w-full overflow-hidden bg-[#FAF7F2] border-b border-loom-border/50">
      {/* 
        Full-Width Luxury Hero Carousel:
        - Occupies 100% of the screen width with ZERO margin on left or right
        - Displays the high-resolution, professionally styled Dharmavaram artisan banners
        - Seamless click navigation to corresponding collections
        - Responsive aspect ratio preserving all text, motifs, and model drapes
      */}
      <div
        className={`relative w-full transition-all duration-300 select-none overflow-hidden ${
          isFullUpload
            ? "aspect-[1024/682] max-h-[550px]"
            : "w-full h-[180px] sm:h-[220px] md:h-[260px] lg:h-[295px] xl:h-[325px] max-h-[335px]"
        }`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;

          return (
            <div
              key={slide.id || index}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <Link
                href={slide.href}
                className="block w-full h-full relative group cursor-pointer"
                title={slide.title}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.005]"
                  style={{
                    imageRendering: "-webkit-optimize-contrast",
                  }}
                />
              </Link>
            </div>
          );
        })}

        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Slide"
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-black/35 hover:bg-black/65 text-white backdrop-blur-xs border border-white/20 shadow-lg transition-all hover:scale-110 active:scale-95"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Slide"
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-black/35 hover:bg-black/65 text-white backdrop-blur-xs border border-white/20 shadow-lg transition-all hover:scale-110 active:scale-95"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </>
        )}

        {/* Carousel Indicators at Bottom Center */}
        {slides.length > 1 && (
          <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 shadow-md">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  index === currentSlide
                    ? "w-6 h-1.5 bg-[#E5B842] shadow-xs"
                    : "w-1.5 h-1.5 bg-white/50 hover:bg-white"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

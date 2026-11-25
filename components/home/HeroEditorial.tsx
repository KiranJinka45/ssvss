"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { DEFAULT_HERO_SLIDES, HeroSlide } from "@/lib/collectionsStore";

export function HeroEditorial() {
  const [slides, setSlides] = useState<HeroSlide[]>(DEFAULT_HERO_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    } else if (isRightSwipe) {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };

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
        Full-Page Luxury Hero Carousel (1st Page / 1st Viewport Screen):
        - Fills the screen height below navbar so the 1st page is dedicated entirely to the carousel
        - Opaque backgrounds eliminate ghosting between slides
        - Subtle hover-only edge navigation arrows that never block the model or temple
        - Floating down-arrow button to smoothly scroll down to Dharmavaram Loom Collections (2nd page)
      */}
      <div
        className="relative w-full h-[calc(100vh-96px)] min-h-[460px] max-h-[850px] select-none overflow-hidden group touch-pan-y"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
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
                href={slide.href}
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
              className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-black/45 sm:bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs border border-white/20 shadow-md transition-all opacity-70 sm:opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Slide"
              className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-black/45 sm:bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs border border-white/20 shadow-md transition-all opacity-70 sm:opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95"
            >
              <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Carousel Indicators at Bottom Center */}
        {slides.length > 1 && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20 shadow-xs">
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

        {/* Floating Scroll Down Indicator to Dharmavaram Loom Collections (2nd Page) */}
        <a
          href="#loom-collections"
          className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/45 hover:bg-black/75 text-white/90 hover:text-white backdrop-blur-xs border border-white/20 text-[10px] sm:text-[11px] font-medium tracking-wider uppercase transition-all shadow-md group-hover:scale-105"
        >
          <span>Explore Loom Collections</span>
          <ChevronDown className="w-3.5 h-3.5 animate-bounce text-[#E5B842]" />
        </a>
      </div>
    </section>
  );
}

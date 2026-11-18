"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface CarouselSlide {
  id: number;
  image: string;
  heading: string;
  subheading: string;
  discountBadge: string;
  buttonLabel: string;
  href: string;
}

const HERO_SLIDES: CarouselSlide[] = [
  {
    id: 1,
    image: "/images/models/model-saree-1.jpg",
    heading: "Crafted Through Centuries of Tradition",
    subheading: "Discover the artistry of Dharmavaram pure mulberry silk, double-shuttle Korvai borders & antique gold zari.",
    discountBadge: "FESTIVE PRIVILEGE • FLAT 15% OFF",
    buttonLabel: "Explore the Weaves",
    href: "/collections/pure-silk",
  },
  {
    id: 2,
    image: "/images/models/model-saree-2.jpg",
    heading: "The Timeless Art of Floral Meenakari",
    subheading: "Discover rich festive silks and intricate contrast temple borders curated for joyous celebrations.",
    discountBadge: "FESTIVE PRIVILEGE • FLAT 15% OFF",
    buttonLabel: "Explore the Weaves",
    href: "/collections/semi-silk",
  },
  {
    id: 3,
    image: "/images/models/model-saree-3.jpg",
    heading: "Heirloom Drapes for Her Special Day",
    subheading: "Discover rich sacred silks and authentic pit-loom weaves curated for every wedding ceremony and celebration.",
    discountBadge: "BRIDAL EXCLUSIVE • FLAT 15% OFF",
    buttonLabel: "Discover Bridal Edit",
    href: "/collections/handloom-bridal",
  },
  {
    id: 4,
    image: "/images/models/model-saree-4.jpg",
    heading: "Regal Grandeur in Antique Temple Zari",
    subheading: "Intricate floral jaal motifs and an opulent antique gold pallu crafted for royal heritage festivities.",
    discountBadge: "FESTIVE PRIVILEGE • FLAT 15% OFF",
    buttonLabel: "Explore the Weaves",
    href: "/collections/pure-silk",
  },
  {
    id: 5,
    image: "/images/models/model-saree-5.jpg",
    heading: "Woven by Masters, Direct from the Pit-Loom",
    subheading: "Preserving over 50 years of unbroken handloom lineage with Central Silk Board 100% pure silk mark certification.",
    discountBadge: "FESTIVE PRIVILEGE • FLAT 15% OFF",
    buttonLabel: "Explore All Weaves",
    href: "/collections/all",
  },
];

export function HeroEditorial() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advances every 3 seconds (3000ms), pauses when hovered
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#FAF7F2] border-b border-loom-border/50">
      {/* 
        Kalanjali-Style Editorial Banner:
        - Image is FULL (head to toe 100% visible, object-contain, fits the page without clipping)
        - Dedicated left zone for image (42%), dedicated right zone for text (58%)
        - Zero overlapping: no cut-off heads, no gradient wash covering text
        - Elegant Indian luxury styling matching Kalanjali reference
      */}
      <div
        className="relative w-full h-[480px] sm:h-[540px] lg:h-[590px] xl:h-[620px] select-none overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <div className="w-full h-full flex flex-row items-center justify-between">
                {/* 
                  LEFT SIDE: Model Photo (Full Figure, Head to Toe Visible, Fits Page)
                  Uses object-contain so head, jewelry, saree, and drape are 100% visible without clipping
                */}
                <div className="w-[42%] lg:w-[40%] xl:w-[42%] h-full flex items-end justify-center lg:justify-start pl-4 sm:pl-8 lg:pl-16 pb-0 pt-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slide.image}
                    alt={slide.heading}
                    className="max-h-full max-w-full w-auto h-auto object-contain object-bottom drop-shadow-[0_15px_30px_rgba(0,0,0,0.12)] transition-transform duration-500 ease-out"
                  />
                </div>

                {/* 
                  RIGHT SIDE: Editorial Typography (Centered, Spacious, Zero Overlap)
                  Has dedicated width with zero overlapping gradients
                */}
                <div className="w-[58%] lg:w-[60%] xl:w-[58%] h-full flex flex-col items-center justify-center text-center px-4 sm:px-10 lg:px-16 xl:px-24 py-6">
                  {/* 15% OFF Festive Privilege Badge */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#800020]/10 border border-[#800020]/25 text-[#800020] text-[11px] sm:text-xs font-semibold tracking-widest uppercase mb-3 sm:mb-4">
                    <span>✦ {slide.discountBadge} ✦</span>
                  </div>

                  {/* Kalanjali-Style Grand Serif Headline */}
                  <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#5B1020] tracking-tight leading-[1.16] max-w-xl">
                    {slide.heading}
                  </h1>

                  {/* Kalanjali-Style Ornamental Divider */}
                  <div className="flex items-center justify-center gap-3 text-gold-600/70 py-2 sm:py-3.5 w-full">
                    <span className="w-12 sm:w-16 h-px bg-gold-500/50" />
                    <span className="text-sm font-serif tracking-widest text-gold-600">❦</span>
                    <span className="w-12 sm:w-16 h-px bg-gold-500/50" />
                  </div>

                  {/* Poetic Subheading */}
                  <p className="text-xs sm:text-sm lg:text-base text-loom-charcoal/85 leading-relaxed font-light max-w-lg mb-4 sm:mb-6">
                    {slide.subheading}
                  </p>

                  {/* Kalanjali-Style Solid Maroon CTA Button */}
                  <div>
                    <Link
                      href={slide.href}
                      className="inline-flex items-center gap-2.5 px-7 sm:px-9 py-3 sm:py-3.5 rounded-md bg-[#6E1325] hover:bg-[#580E1D] text-white font-medium text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg transition-all group"
                    >
                      <span>{slide.buttonLabel}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-gold-300" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Carousel Navigation Arrows */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-white/85 hover:bg-white text-[#5B1020] shadow-md transition-all hover:scale-105"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-white/85 hover:bg-white text-[#5B1020] shadow-md transition-all hover:scale-105"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Carousel Dot Indicators at Bottom Center */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-gold/30 shadow-xs">
          {HERO_SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? "w-8 h-2.5 bg-[#6E1325] shadow-xs"
                  : "w-2.5 h-2.5 bg-loom-border hover:bg-gold-500"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
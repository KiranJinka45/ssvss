"use client";

import React, { useState, useRef } from "react";
import { Sun, Sparkles, ZoomIn, Film, ShieldCheck } from "lucide-react";

interface ZariLoupeViewerProps {
  images: string[];
  title: string;
  zariType: string;
  silkMarkCertified?: boolean;
}

export function ZariLoupeViewer({
  images,
  title,
  zariType,
  silkMarkCertified,
}: ZariLoupeViewerProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLoupeActive, setIsLoupeActive] = useState(false);
  const [loupePosition, setLoupePosition] = useState({ x: 0, y: 0, percentX: 0, percentY: 0 });
  const [isSunlightMode, setIsSunlightMode] = useState(false);
  const [isReelView, setIsReelView] = useState(false);

  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const percentX = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const percentY = Math.max(0, Math.min(100, (y / rect.height) * 100));

    setLoupePosition({ x, y, percentX, percentY });
  };

  const activeImage = images[selectedImageIndex] || images[0];

  return (
    <div className="flex flex-col gap-4">
      {/* Top Controls: Sunlight Mode & 9:16 Reel Toggle */}
      <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-canvas-surface border border-loom-border/80 text-xs">
        <button
          onClick={() => setIsSunlightMode(!isSunlightMode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
            isSunlightMode
              ? "bg-gold text-maroon-900 shadow-sm"
              : "text-loom-charcoal hover:bg-canvas"
          }`}
          title="Simulate natural morning sunlight on antique zari"
        >
          <Sun className={`w-3.5 h-3.5 ${isSunlightMode ? "animate-spin" : ""}`} />
          <span>{isSunlightMode ? "Morning Sunlight: ON" : "Indoor Light"}</span>
        </button>

        <button
          onClick={() => setIsReelView(!isReelView)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
            isReelView
              ? "bg-maroon text-canvas shadow-sm"
              : "text-loom-charcoal hover:bg-canvas"
          }`}
          title="Toggle 9:16 vertical smartphone reel mode"
        >
          <Film className="w-3.5 h-3.5 text-gold-400" />
          <span>{isReelView ? "9:16 Reel Preview" : "Standard View"}</span>
        </button>
      </div>

      {/* Main Showcase Stage */}
      <div
        ref={imageContainerRef}
        onMouseEnter={() => setIsLoupeActive(true)}
        onMouseLeave={() => setIsLoupeActive(false)}
        onMouseMove={handleMouseMove}
        className={`relative overflow-hidden rounded-2xl bg-canvas-surface border border-loom-border/90 shadow-2xl transition-all duration-300 ${
          isReelView ? "aspect-[9/16] max-w-sm mx-auto" : "aspect-[3/4] w-full"
        }`}
      >
        {/* Base Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={activeImage}
          alt={title}
          className={`w-full h-full object-cover object-top transition-filter duration-500 ${
            isSunlightMode
              ? "brightness-105 contrast-110 saturate-110"
              : "brightness-100 contrast-100"
          }`}
        />

        {/* Sunlight Shimmer Light Ray Overlay when Sunlight mode is on */}
        {isSunlightMode && (
          <div className="absolute inset-0 pointer-events-none gold-shimmer opacity-40 mix-blend-overlay" />
        )}

        {/* Interactive Magnifying Loupe Window (shows on hover) */}
        {isLoupeActive && (
          <div
            className="hidden md:block pointer-events-none absolute w-48 h-48 rounded-full border-2 border-gold shadow-2xl overflow-hidden bg-canvas z-30"
            style={{
              top: `${loupePosition.y - 96}px`,
              left: `${loupePosition.x - 96}px`,
            }}
          >
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url(${activeImage})`,
                backgroundPosition: `${loupePosition.percentX}% ${loupePosition.percentY}%`,
                backgroundSize: "400%",
                backgroundRepeat: "no-repeat",
              }}
            />
            <div className="absolute bottom-2 left-0 right-0 text-center">
              <span className="px-2 py-0.5 rounded-full bg-maroon/90 text-[9px] font-bold text-gold uppercase tracking-wider">
                4X Zari Inspection
              </span>
            </div>
          </div>
        )}

        {/* Floating Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-20 pointer-events-none">
          {silkMarkCertified && (
            <div className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-md text-[10px] font-bold text-silk-emerald uppercase tracking-wider shadow-sm border border-silk-emerald/40 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Silk Mark Certified</span>
            </div>
          )}
          <div className="bg-canvas/90 backdrop-blur-md px-3 py-1 rounded-md text-[10px] font-semibold text-maroon shadow-sm border border-gold/40 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-gold" />
            <span>{zariType}</span>
          </div>
        </div>

        {/* Desktop Loupe Hint */}
        <div className="hidden md:flex absolute bottom-3 right-3 bg-loom-charcoal/80 text-canvas px-3 py-1 rounded-full text-[10px] font-medium items-center gap-1.5 backdrop-blur-sm pointer-events-none">
          <ZoomIn className="w-3 h-3 text-gold" />
          <span>Hover anywhere to inspect weave</span>
        </div>
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto py-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImageIndex(idx)}
              className={`relative w-20 h-24 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                selectedImageIndex === idx
                  ? "border-maroon shadow-md scale-102"
                  : "border-loom-border/60 hover:border-gold opacity-70 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`${title} detail ${idx + 1}`}
                className="w-full h-full object-cover object-top"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

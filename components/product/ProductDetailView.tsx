"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  MessageCircle,
  Check,
  Truck,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Play,
  Video as VideoIcon,
} from "lucide-react";
import { SareeSKU } from "@/data/catalog";
import { useCartStore } from "@/store/useCartStore";
import { MERCHANT_CONFIG } from "@/lib/config";

interface ProductDetailViewProps {
  saree: SareeSKU;
  similarSarees: SareeSKU[];
}

interface MediaSlide {
  id: string;
  type: "image" | "video";
  url: string;
  title?: string;
}

export function ProductDetailView({ saree, similarSarees }: ProductDetailViewProps) {
  // Sync with localStorage for custom products added via Admin Console
  const [currentSaree, setCurrentSaree] = useState<SareeSKU>(saree);
  const [relatedItems, setRelatedItems] = useState<SareeSKU[]>(similarSarees);

  useEffect(() => {
    try {
      const savedCustom = localStorage.getItem("loom_custom_products");
      if (savedCustom) {
        const customProducts = JSON.parse(savedCustom) as SareeSKU[];
        const found = customProducts.find(
          (p) => p.sku.toLowerCase() === saree.sku.toLowerCase() || p.id === saree.id
        );
        if (found) {
          setCurrentSaree(found);
        }

        // Merge any custom products belonging to the same category into related items
        const extraRelated = customProducts.filter(
          (p) => p.category === saree.category && p.sku.toLowerCase() !== saree.sku.toLowerCase()
        );
        if (extraRelated.length > 0) {
          setRelatedItems((prev) => {
            const seen = new Set(prev.map((i) => i.sku.toLowerCase()));
            const toAdd = extraRelated.filter((i) => !seen.has(i.sku.toLowerCase()));
            return [...prev, ...toAdd];
          });
        }
      }
    } catch (e) {
      console.error("Failed to sync custom products from localStorage", e);
    }
  }, [saree.sku, saree.id, saree.category]);

  // Construct combined Media Carousel Items (Both Images and Videos)
  const mediaSlides: MediaSlide[] = React.useMemo(() => {
    const slides: MediaSlide[] = [];

    // 1. Saree Images
    const imgs =
      currentSaree.images && currentSaree.images.length > 0
        ? currentSaree.images
        : ["/images/sarees/pure-01.jpg"];
    imgs.forEach((img, idx) => {
      slides.push({
        id: `img-${idx}`,
        type: "image",
        url: img,
        title: `${currentSaree.title} - View ${idx + 1}`,
      });
    });

    // 2. Saree Videos (from videos[] or reelVideoPlaceholderUrl)
    const vids: string[] = [];
    if (currentSaree.videos && Array.isArray(currentSaree.videos)) {
      currentSaree.videos.forEach((v) => {
        if (v && !vids.includes(v)) vids.push(v);
      });
    }
    if (
      currentSaree.reelVideoPlaceholderUrl &&
      !vids.includes(currentSaree.reelVideoPlaceholderUrl)
    ) {
      vids.push(currentSaree.reelVideoPlaceholderUrl);
    }

    // Default sample handloom demonstration video if none added
    if (vids.length === 0) {
      vids.push("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4");
    }

    vids.forEach((vid, idx) => {
      slides.push({
        id: `vid-${idx}`,
        type: "video",
        url: vid,
        title: `${currentSaree.title} - Loom Video ${idx + 1}`,
      });
    });

    return slides;
  }, [currentSaree]);

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);
  const { addItem } = useCartStore();

  const relatedCarouselRef = useRef<HTMLDivElement>(null);

  const currentIndex = activeSlideIndex >= mediaSlides.length ? 0 : activeSlideIndex;
  const currentSlide = mediaSlides[currentIndex] || mediaSlides[0];

  const savings = Math.max(0, currentSaree.showroomPrice - currentSaree.price);
  const savingsPercent = Math.round((savings / currentSaree.showroomPrice) * 100);

  const incrementQty = () =>
    setQuantity((prev) => Math.min(prev + 1, currentSaree.stockCount || 10));
  const decrementQty = () => setQuantity((prev) => Math.max(prev - 1, 1));

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(currentSaree, "Standard Unstitched Blouse", false);
    }
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const handlePrevSlide = () => {
    setActiveSlideIndex((prev) => (prev === 0 ? mediaSlides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setActiveSlideIndex((prev) => (prev === mediaSlides.length - 1 ? 0 : prev + 1));
  };

  const scrollRelated = (direction: "left" | "right") => {
    if (relatedCarouselRef.current) {
      const scrollAmount = direction === "left" ? -180 : 180;
      relatedCarouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // WhatsApp order URL
  const whatsappUrl = `https://wa.me/${MERCHANT_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello Dharmavaram Silk Looms, I want to order this saree:\n\n*Product:* ${currentSaree.title}\n*SKU:* ${currentSaree.sku}\n*Fabric:* ${currentSaree.fabric}\n*Color:* ${currentSaree.colorName}\n*Price:* ₹${currentSaree.price.toLocaleString("en-IN")}\n*Quantity:* ${quantity}\n\nPlease share payment details and dispatch confirmation.`
  )}`;

  return (
    <div className="min-h-screen bg-[#0C0C0E] text-[#F5EFE6] pt-1.5 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-2">
          <Link
            href={`/collections/${currentSaree.category}`}
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#E5B842] transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Collection</span>
          </Link>
        </div>

        {/* 2-Column Product Detail Layout (Simple, Elegant & Fits Viewport) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* LEFT COLUMN: Clean Image + Video Interactive Media Carousel */}
          <div className="lg:col-span-6 space-y-2">
            {/* Main Carousel Frame */}
            <div className="relative rounded-2xl overflow-hidden bg-[#141417] border border-white/10 shadow-xl flex items-center justify-center p-2 sm:p-2.5 max-h-[360px] lg:max-h-[390px] group">
              {/* Slide Content: Video or Image */}
              {currentSlide?.type === "video" ? (
                <div className="relative w-full h-[330px] lg:h-[360px] bg-black/90 rounded-xl overflow-hidden flex items-center justify-center">
                  <video
                    key={currentSlide.url}
                    src={currentSlide.url}
                    controls
                    playsInline
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#E5B842]/40 text-[#E5B842] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 pointer-events-none">
                    <VideoIcon className="w-3.5 h-3.5" />
                    <span>Loom Video Reel</span>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-[330px] lg:h-[360px] flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentSlide?.url}
                    alt={currentSlide?.title || currentSaree.title}
                    className="w-full h-auto max-h-[330px] lg:max-h-[360px] object-contain rounded-xl select-none"
                  />
                </div>
              )}

              {/* Prev / Next Navigation Arrows */}
              {mediaSlides.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevSlide}
                    aria-label="Previous slide"
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all opacity-80 group-hover:opacity-100 hover:scale-105"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextSlide}
                    aria-label="Next slide"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all opacity-80 group-hover:opacity-100 hover:scale-105"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Fullscreen Expand Button (Matching Valli Silks ⛶) */}
              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                aria-label="Full screen view"
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 hover:bg-black/85 text-white/90 hover:text-white border border-white/20 backdrop-blur-sm transition-all"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>

              {/* Counter Badge */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] text-gray-300 font-mono border border-white/10 pointer-events-none">
                {currentIndex + 1} / {mediaSlides.length}{" "}
                {currentSlide?.type === "video" ? "• Video" : "• Photo"}
              </div>
            </div>

            {/* Thumbnail Row (Images + Videos) */}
            {mediaSlides.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
                {mediaSlides.map((slide, idx) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setActiveSlideIndex(idx)}
                    className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      idx === currentIndex
                        ? "border-[#E5B842] scale-102 shadow-md ring-1 ring-[#E5B842]/50"
                        : "border-white/15 opacity-60 hover:opacity-100"
                    }`}
                  >
                    {slide.type === "video" ? (
                      <div className="w-full h-full bg-[#1F1F24] flex flex-col items-center justify-center text-white">
                        <Play className="w-4 h-4 text-[#E5B842] fill-[#E5B842]" />
                        <span className="text-[8px] font-bold tracking-tight text-gray-300 mt-0.5">
                          VIDEO
                        </span>
                      </div>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={slide.url}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Product Details, Color Variations & Buying Actions */}
          <div className="lg:col-span-6 space-y-2.5">
            {/* Tag & Title */}
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#D4AF37] block">
                DHARMAVARAM
              </span>
              <h1 className="font-serif text-lg sm:text-xl lg:text-2xl font-bold text-[#F5EFE6] leading-snug">
                {currentSaree.title}
              </h1>
            </div>

            {/* Price, Savings & Free Delivery */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-[#FBBF24]">
                  ₹{currentSaree.price.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  M.R.P: ₹{currentSaree.showroomPrice.toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded">
                  {savingsPercent}% OFF Special Deal
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-xs">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                  <Check className="w-3.5 h-3.5" />
                  Save ₹{savings.toLocaleString("en-IN")}
                </span>
                <span className="text-gray-600">•</span>
                <span className="flex items-center gap-1 text-amber-300 font-medium text-[11px]">
                  <Truck className="w-3.5 h-3.5 text-[#E5B842]" />
                  FREE delivery within 2–4 days
                </span>
              </div>
            </div>

            {/* Clean, Simple Description */}
            <p className="text-xs text-gray-300 leading-relaxed font-sans line-clamp-2">
              {currentSaree.description}
            </p>

            {/* Specification Grid (FABRIC | COLOR) */}
            <div className="rounded-xl border border-white/10 bg-[#18181B] px-3.5 py-1.5 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">
                  FABRIC
                </span>
                <span className="font-medium text-[#F5EFE6] text-xs truncate block">
                  {currentSaree.fabric}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">
                  COLOR
                </span>
                <span className="font-medium text-[#F5EFE6] text-xs truncate block">
                  {currentSaree.colorName}
                </span>
              </div>
            </div>

            {/* MORE COLORS & WEAVES (Inline Carousel - Matching Reference Screenshot) */}
            {relatedItems.length > 0 && (
              <div className="pt-0.5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#E5B842]">
                    MORE COLORS & WEAVES ({relatedItems.length})
                  </span>
                  {relatedItems.length > 3 && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => scrollRelated("left")}
                        aria-label="Scroll related weaves left"
                        className="p-1 rounded bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors"
                      >
                        <ChevronLeft className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollRelated("right")}
                        aria-label="Scroll related weaves right"
                        className="p-1 rounded bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors"
                      >
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Horizontal Scrolling Color / Similar Sarees Carousel */}
                <div
                  ref={relatedCarouselRef}
                  className="flex items-center gap-2 overflow-x-auto pb-1 scroll-smooth"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {relatedItems.map((item) => (
                    <Link
                      key={item.id}
                      href={`/product/${item.sku.toLowerCase()}`}
                      className="group shrink-0 w-24 sm:w-28 rounded-xl border border-white/10 hover:border-[#E5B842] bg-[#18181B] p-1.5 transition-all hover:scale-103"
                    >
                      <div className="w-full h-14 sm:h-16 rounded-lg overflow-hidden bg-black/40 mb-1 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <p className="text-[10px] text-gray-300 font-medium truncate group-hover:text-[#E5B842]">
                        {item.colorName ? item.colorName.split(" ")[0] : item.title}
                      </p>
                      <p className="text-[10px] font-bold text-[#FBBF24]">
                        ₹{item.price.toLocaleString("en-IN")}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper & In-Stock Indicator */}
            <div className="flex items-center gap-3 pt-0.5">
              <div className="inline-flex items-center rounded-lg border border-white/20 bg-[#18181B] px-2.5 py-1 text-xs text-white">
                <button
                  type="button"
                  onClick={decrementQty}
                  className="px-2 py-0.5 text-gray-400 hover:text-[#FBBF24] transition-colors text-sm"
                >
                  -
                </button>
                <span className="px-3 font-semibold text-white">{quantity}</span>
                <button
                  type="button"
                  onClick={incrementQty}
                  className="px-2 py-0.5 text-gray-400 hover:text-[#FBBF24] transition-colors text-sm"
                >
                  +
                </button>
              </div>

              <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>IN STOCK • Ready to Dispatch</span>
              </div>
            </div>

            {/* Action Buttons: ADD TO CART (Gold) + BUY ON WHATSAPP (Green) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-3 px-4 rounded-lg bg-[#E5B842] hover:bg-[#D4A732] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ADD TO CART</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-lg bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>BUY ON WHATSAPP</span>
              </a>
            </div>

            {/* Added to cart toast message */}
            {addedToast && (
              <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs text-center font-medium animate-fadeIn">
                ✓ Added {quantity} saree(s) to your Cart!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal (Images + Videos) */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
            aria-label="Close fullscreen"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-4xl max-h-[85vh] w-full flex items-center justify-center">
            {currentSlide?.type === "video" ? (
              <video
                key={currentSlide.url}
                src={currentSlide.url}
                controls
                autoPlay
                className="max-w-full max-h-[80vh] rounded-xl shadow-2xl"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentSlide?.url}
                alt={currentSlide?.title || currentSaree.title}
                className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
              />
            )}

            {mediaSlides.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 transition-all hover:scale-110"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNextSlide}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 transition-all hover:scale-110"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          <div className="mt-3 text-xs text-gray-300 font-medium">
            {currentIndex + 1} / {mediaSlides.length}: {currentSlide?.title || currentSaree.title}
          </div>
        </div>
      )}

      {/* Floating WhatsApp Quick Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      >
        <MessageCircle className="w-7 h-7 fill-white" />
      </a>
    </div>
  );
}

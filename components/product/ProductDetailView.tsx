"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  MessageCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Maximize2,
  X,
  Play,
  Video as VideoIcon,
  Heart,
  Share2,
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

    // 2. Saree Videos
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

    // Default sample demonstration video if none added
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
  const [shareToast, setShareToast] = useState(false);

  // Accordion states (Image 3 reference)
  const [openAccordion, setOpenAccordion] = useState<string | null>("info");

  const toggleAccordion = (section: string) => {
    setOpenAccordion((prev) => (prev === section ? null : section));
  };

  const { addItem, toggleWishlist, isInWishlist } = useCartStore();
  const isWishlisted = isInWishlist(currentSaree.sku);

  const currentIndex = activeSlideIndex >= mediaSlides.length ? 0 : activeSlideIndex;
  const currentSlide = mediaSlides[currentIndex] || mediaSlides[0];

  const incrementQty = () =>
    setQuantity((prev) => Math.min(prev + 1, currentSaree.stockCount || 10));
  const decrementQty = () => setQuantity((prev) => Math.max(prev - 1, 1));

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(currentSaree, "Standard Unstitched Blouse", false);
    }
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(currentSaree.sku);
  };

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: currentSaree.title,
          text: `Check out ${currentSaree.title} at Dharmavaram Silk Looms`,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  const handlePrevSlide = () => {
    setActiveSlideIndex((prev) => (prev === 0 ? mediaSlides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setActiveSlideIndex((prev) => (prev === mediaSlides.length - 1 ? 0 : prev + 1));
  };

  // WhatsApp instant order URL
  const whatsappUrl = `https://wa.me/${MERCHANT_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello Dharmavaram Silk Looms, I want to order this saree:\n\n*Product:* ${currentSaree.title}\n*SKU:* ${currentSaree.sku}\n*Fabric:* ${currentSaree.fabric}\n*Color:* ${currentSaree.colorName}\n*Price:* ₹${currentSaree.price.toLocaleString("en-IN")}\n*Quantity:* ${quantity}\n\nPlease share payment details and dispatch confirmation.`
  )}`;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1A1A1A] font-sans pt-3 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation (Exact Valli Silks Reference) */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-5 font-sans">
          <Link href="/" className="hover:text-[#5C1624] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href={`/collections/${currentSaree.category}`}
            className="hover:text-[#5C1624] transition-colors capitalize"
          >
            {currentSaree.categoryName || currentSaree.category.replace("-", " ")}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate max-w-xs">
            {currentSaree.title}
          </span>
        </nav>

        {/* Main 2-Column Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN: Media Gallery (Vertical Thumbnails + Main Display) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-3.5 sm:gap-4 items-start">
            {/* Vertical Thumbnails List (Left Side) */}
            {mediaSlides.length > 1 && (
              <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto no-scrollbar shrink-0 w-full sm:w-20 max-h-[500px]">
                {mediaSlides.map((slide, idx) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setActiveSlideIndex(idx)}
                    className={`relative w-16 sm:w-20 aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      idx === currentIndex
                        ? "border-[#5C1624] ring-2 ring-[#5C1624]/20 shadow-sm"
                        : "border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100"
                    }`}
                  >
                    {slide.type === "video" ? (
                      <div className="w-full h-full bg-[#18181B] flex flex-col items-center justify-center text-white">
                        <Play className="w-5 h-5 text-[#C59B27] fill-[#C59B27]" />
                        <span className="text-[9px] font-bold tracking-tight text-white/90 mt-1">
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

            {/* Large Main Media Display (Right of Thumbnails) */}
            <div className="relative flex-1 w-full rounded-2xl overflow-hidden bg-white border border-gray-200/90 shadow-sm group aspect-[3/4] max-h-[500px] flex items-center justify-center">
              {currentSlide?.type === "video" ? (
                <div className="w-full h-full bg-black flex items-center justify-center">
                  <video
                    key={currentSlide.url}
                    src={currentSlide.url}
                    controls
                    playsInline
                    autoPlay
                    muted
                    loop
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-amber-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow">
                    <VideoIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span>Loom Video</span>
                  </div>
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentSlide?.url}
                  alt={currentSlide?.title || currentSaree.title}
                  className="w-full h-full object-cover select-none"
                />
              )}

              {/* Fullscreen Expand Button (Matching Valli Silks ⛶) */}
              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                aria-label="Expand image"
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 hover:bg-white text-gray-700 hover:text-black flex items-center justify-center shadow-md transition-all border border-gray-100"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Prev / Next Carousel Arrow Buttons (Shown on Hover) */}
              {mediaSlides.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevSlide}
                    aria-label="Previous slide"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-105 border border-gray-100"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextSlide}
                    aria-label="Next slide"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-105 border border-gray-100"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Clean Product Details, Colors & Buying Actions */}
          <div className="lg:col-span-5 space-y-4">
            {/* Title */}
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-medium text-gray-900 leading-snug">
                {currentSaree.title}
              </h1>
            </div>

            {/* Price & Taxes Note (Exact Reference) */}
            <div className="pt-0.5">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-gray-950">
                  ₹{currentSaree.price.toLocaleString("en-IN")}
                </span>
                {currentSaree.showroomPrice > currentSaree.price && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{currentSaree.showroomPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes.</p>
            </div>

            {/* Trust Highlights (Unique • Premium • Quality) */}
            <div className="flex items-center gap-4 text-xs text-gray-700 font-medium pt-1">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-gray-900" />
                Unique
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-gray-900" />
                Premium
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-gray-900" />
                Silk Mark Quality
              </span>
            </div>

            {/* Sku */}
            <div className="text-xs text-gray-500 pt-0.5">
              <span className="font-medium text-gray-700">Sku:</span>{" "}
              <span>{currentSaree.sku}</span>
            </div>

            {/* MORE COLORS Swatches (Exact Valli Silks Image 1 Reference) */}
            <div className="pt-2 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-900 block">
                MORE COLORS
              </span>
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                {/* Current Active Saree */}
                <div className="w-20 sm:w-24 shrink-0 rounded-lg border-2 border-[#5C1624] p-1 bg-white shadow-xs">
                  <div className="aspect-[4/5] rounded overflow-hidden bg-gray-100 mb-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentSaree.images[0]}
                      alt={currentSaree.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-[10px] text-gray-900 font-medium truncate text-center">
                    {currentSaree.colorName.split(" ")[0]}
                  </p>
                </div>

                {/* Related Colors from Loom */}
                {relatedItems.map((item) => (
                  <Link
                    key={item.id}
                    href={`/product/${item.sku.toLowerCase()}`}
                    className="w-20 sm:w-24 shrink-0 rounded-lg border border-gray-200 hover:border-gray-400 p-1 bg-white hover:shadow-xs transition-all opacity-85 hover:opacity-100"
                  >
                    <div className="aspect-[4/5] rounded overflow-hidden bg-gray-100 mb-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-[10px] text-gray-700 font-medium truncate text-center">
                      {item.colorName.split(" ")[0]}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Actions Row: Quantity Stepper + Add To Cart + Wishlist + Share */}
            <div className="pt-2 flex items-center gap-2.5 sm:gap-3">
              {/* Quantity Stepper */}
              <div className="inline-flex items-center rounded-full border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900">
                <button
                  type="button"
                  onClick={decrementQty}
                  className="px-2 text-gray-500 hover:text-black transition-colors font-medium text-base"
                >
                  -
                </button>
                <span className="px-2 font-semibold text-gray-900 min-w-[20px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={incrementQty}
                  className="px-2 text-gray-500 hover:text-black transition-colors font-medium text-base"
                >
                  +
                </button>
              </div>

              {/* Add to Cart (Clean Rounded Pill Button) */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3 px-6 rounded-full border border-gray-900 bg-white hover:bg-gray-950 hover:text-white text-gray-900 font-semibold text-sm transition-all shadow-xs flex items-center justify-center gap-2 active:scale-98"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add To Cart</span>
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={handleToggleWishlist}
                aria-label="Wishlist"
                className={`p-3 rounded-full border transition-colors flex items-center justify-center ${
                  isWishlisted
                    ? "border-red-300 bg-red-50 text-red-600"
                    : "border-gray-300 hover:border-gray-900 text-gray-700 bg-white"
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-600" : ""}`} />
              </button>

              {/* Share Button */}
              <button
                type="button"
                onClick={handleShare}
                aria-label="Share"
                className="p-3 rounded-full border border-gray-300 hover:border-gray-900 text-gray-700 bg-white transition-colors flex items-center justify-center"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* BUY NOW Button (Deep Maroon / Authentic Indian Handloom Style) */}
            <div className="pt-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-6 rounded-lg bg-[#5C1624] hover:bg-[#460F1C] text-white font-semibold text-sm tracking-wide shadow-sm flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <span>BUY NOW • ORDER ON WHATSAPP</span>
              </a>
            </div>

            {/* Notification Toasts */}
            {addedToast && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs text-center font-medium animate-fadeIn">
                ✓ Added {quantity} saree(s) to your bag!
              </div>
            )}
            {shareToast && (
              <div className="p-2.5 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 text-xs text-center font-medium animate-fadeIn">
                ✓ Link copied to clipboard!
              </div>
            )}

            {/* Got Questions? Chat with us (Image 3 Reference) */}
            <div className="pt-4 border-t border-gray-200 mt-4 flex items-center justify-between text-xs text-gray-700">
              <span className="font-medium">Got Questions?</span>
              <a
                href={`https://wa.me/${MERCHANT_CONFIG.WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-semibold text-[#166534] hover:underline"
              >
                <MessageCircle className="w-4 h-4 fill-[#166534] text-[#166534]" />
                <span>Chat with us</span>
              </a>
            </div>

            {/* Trust Badges (Image 3 Reference: Easy Payments • Easy Returns • COD) */}
            <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-200 my-3 text-center">
              <div className="flex flex-col items-center gap-1">
                <span className="text-base">💳</span>
                <span className="text-[11px] font-medium text-gray-800">Easy Payments</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-base">📦</span>
                <span className="text-[11px] font-medium text-gray-800">Easy Returns</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-base">🏷️</span>
                <span className="text-[11px] font-medium text-gray-800">Silk Mark Certified</span>
              </div>
            </div>

            {/* Clean Collapsible Accordions (Image 3 Reference) */}
            <div className="space-y-2 pt-1 font-sans text-xs">
              {/* 1. Product Information */}
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => toggleAccordion("info")}
                  className="w-full px-4 py-3 text-left font-semibold text-gray-900 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span>Product Information</span>
                  {openAccordion === "info" ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                {openAccordion === "info" && (
                  <div className="px-4 pb-3.5 pt-1 border-t border-gray-100 text-gray-600 space-y-2 text-xs">
                    <div className="grid grid-cols-2 gap-y-1.5 py-1">
                      <span className="text-gray-500 font-medium">Fabric:</span>
                      <span className="text-gray-900 font-semibold">{currentSaree.fabric}</span>

                      <span className="text-gray-500 font-medium">Weave:</span>
                      <span className="text-gray-900">Traditional Handloom Pit-Loom</span>

                      <span className="text-gray-500 font-medium">Zari / Pattern:</span>
                      <span className="text-gray-900">{currentSaree.zariType}</span>

                      <span className="text-gray-500 font-medium">Border Type:</span>
                      <span className="text-gray-900">{currentSaree.borderType}</span>

                      <span className="text-gray-500 font-medium">Blouse Fabric:</span>
                      <span className="text-gray-900">{currentSaree.blouseDetails}</span>

                      <span className="text-gray-500 font-medium">Weight:</span>
                      <span className="text-gray-900">{currentSaree.silkWeightGrams || 600}g</span>
                    </div>
                    <p className="pt-1.5 text-gray-600 border-t border-gray-100 leading-relaxed">
                      {currentSaree.description}
                    </p>
                  </div>
                )}
              </div>

              {/* 2. Product Care */}
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => toggleAccordion("care")}
                  className="w-full px-4 py-3 text-left font-semibold text-gray-900 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span>Product Care</span>
                  {openAccordion === "care" ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                {openAccordion === "care" && (
                  <div className="px-4 pb-3.5 pt-1 border-t border-gray-100 text-gray-600 space-y-1.5 text-xs">
                    <p>• Strictly Dry Clean only to protect delicate mulberry silk and real zari.</p>
                    <p>• Store in breathable cotton muslin bags, folded gently.</p>
                    <p>• Avoid spraying perfume directly on pure zari borders.</p>
                  </div>
                )}
              </div>

              {/* 3. Shipping and Delivery */}
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => toggleAccordion("shipping")}
                  className="w-full px-4 py-3 text-left font-semibold text-gray-900 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span>Shipping and Delivery</span>
                  {openAccordion === "shipping" ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                {openAccordion === "shipping" && (
                  <div className="px-4 pb-3.5 pt-1 border-t border-gray-100 text-gray-600 space-y-1 text-xs">
                    <p>• Dispatched directly from Dharmavaram within 24 hours.</p>
                    <p>• Free Insured Doorstep Delivery across India within 2–4 business days.</p>
                    <p>• Tamper-proof packaging with official CSB Silk Mark certificate.</p>
                  </div>
                )}
              </div>

              {/* 4. Return Policies */}
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => toggleAccordion("returns")}
                  className="w-full px-4 py-3 text-left font-semibold text-gray-900 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span>Return Policies</span>
                  {openAccordion === "returns" ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                {openAccordion === "returns" && (
                  <div className="px-4 pb-3.5 pt-1 border-t border-gray-100 text-gray-600 text-xs">
                    <p>• 7-day hassle-free replacement or full refund if unworn and unstitched.</p>
                  </div>
                )}
              </div>
            </div>
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
    </div>
  );
}

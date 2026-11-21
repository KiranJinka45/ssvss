"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  ListFilter,
  Plus,
  ArrowRight,
  ArrowLeft,
  Upload,
  Video,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Save,
  Lock,
  LogOut,
  Image as ImageIcon,
  Check,
  Package,
  Home,
  Sliders,
  Eye,
  Layers,
} from "lucide-react";
import { CATALOG, SareeSKU, SareeCategory, StockStatus } from "@/data/catalog";
import { useAuthStore } from "@/store/useAuthStore";
import { MERCHANT_CONFIG } from "@/lib/config";
import {
  DEFAULT_CATEGORY_TIERS,
  DEFAULT_MASTER_CREATIONS_SKUS,
  DEFAULT_COLLECTION_METAS,
  DEFAULT_HERO_SLIDES,
  HERO_SLIDE_PRESETS,
  HeroSlide,
  CategoryTier,
} from "@/lib/collectionsStore";

const ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || "2027";

export function AdminConsole() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "products" | "collections" | "categories" | "add-product" | "edit-product"
  >("dashboard");
  const [pin, setPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState(false);

  // Products state (Catalog + Custom saved in localStorage)
  const [products, setProducts] = useState<SareeSKU[]>(CATALOG);
  const [selectedProductForEdit, setSelectedProductForEdit] = useState<SareeSKU | null>(null);

  // Form states for Add/Edit Product
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formDiscountPrice, setFormDiscountPrice] = useState("");
  const [formFabric, setFormFabric] = useState("Pure Mulberry Silk");
  const [formColor, setFormColor] = useState("");
  const [formCategory, setFormCategory] = useState<SareeCategory>("pure-silk");
  const [formDescription, setFormDescription] = useState("");
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formVideos, setFormVideos] = useState<string[]>([]);
  const [formIsBestSeller, setFormIsBestSeller] = useState(false);
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formStatus, setFormStatus] = useState<StockStatus>("IN_STOCK");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [videoUrlInput, setVideoUrlInput] = useState("");

  // Storefront Placement States (User's Core Requirement)
  const [formShowInMasterCreations, setFormShowInMasterCreations] = useState(true);
  const [formSetAsTierCover, setFormSetAsTierCover] = useState(false);

  // Collections & Placements Customization State
  const [categoryTiers, setCategoryTiers] = useState<CategoryTier[]>(DEFAULT_CATEGORY_TIERS);
  const [categoryRailMeta, setCategoryRailMeta] = useState(DEFAULT_COLLECTION_METAS.categoryRail);
  const [masterCreationsMeta, setMasterCreationsMeta] = useState(DEFAULT_COLLECTION_METAS.masterCreations);
  const [masterCreationsSkus, setMasterCreationsSkus] = useState<string[]>(DEFAULT_MASTER_CREATIONS_SKUS);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(DEFAULT_HERO_SLIDES);
  const [activeHeroPreset, setActiveHeroPreset] = useState<string>("set1");
  const [collectionsSaveSuccess, setCollectionsSaveSuccess] = useState(false);

  const { isLoggedIn, user, loginAsAdmin, logout: storeLogout } = useAuthStore();

  // Categories list
  const categoriesList = [
    { id: "pure-silk", name: "Pure Mulberry Silk", slug: "pure-silk" },
    { id: "semi-silk", name: "Semi-Silk Festive", slug: "semi-silk" },
    { id: "handloom-bridal", name: "Bridal Handloom Heirloom", slug: "handloom-bridal" },
    { id: "dharmavaram-classic", name: "Dharmavaram Classic", slug: "dharmavaram-classic" },
    { id: "kanchipuram-pattu", name: "Kanchipattu Heritage", slug: "kanchipuram-pattu" },
    { id: "brocade-zari", name: "Antique Zari Brocade", slug: "brocade-zari" },
  ];

  // Sync auth state and saved products on mount
  useEffect(() => {
    const auth = sessionStorage.getItem("admin_auth");
    // Admin dashboard is strictly for authorized admins with admin credentials
    if (auth === "true" && user?.role === "admin") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    // Load custom products and overrides from localStorage
    const savedCustom = localStorage.getItem("loom_custom_products");
    const savedOverrides = localStorage.getItem("loom_inventory_overrides");

    let loadedProducts = [...CATALOG];

    if (savedCustom) {
      try {
        const parsed = JSON.parse(savedCustom) as SareeSKU[];
        loadedProducts = [...loadedProducts, ...parsed];
      } catch (err) {
        console.warn("Could not load custom products:", err);
      }
    }

    if (savedOverrides) {
      try {
        const overrides = JSON.parse(savedOverrides) as Record<string, StockStatus>;
        loadedProducts = loadedProducts.map((p) =>
          overrides[p.sku] ? { ...p, stockStatus: overrides[p.sku] } : p
        );
      } catch (err) {
        console.warn("Could not load stock overrides:", err);
      }
    }

    setProducts(loadedProducts);

    // Load collections & placements customization
    try {
      const savedTiers = localStorage.getItem("loom_category_tiers");
      if (savedTiers) setCategoryTiers(JSON.parse(savedTiers));

      const savedCatMeta = localStorage.getItem("loom_category_rail_meta");
      if (savedCatMeta) setCategoryRailMeta(JSON.parse(savedCatMeta));

      const savedMasterMeta = localStorage.getItem("loom_master_creations_meta");
      if (savedMasterMeta) setMasterCreationsMeta(JSON.parse(savedMasterMeta));

      const savedMasterSkus = localStorage.getItem("loom_master_creations_skus");
      if (savedMasterSkus) setMasterCreationsSkus(JSON.parse(savedMasterSkus));

      const savedHeroSlides = localStorage.getItem("loom_hero_slides");
      if (savedHeroSlides) setHeroSlides(JSON.parse(savedHeroSlides));

      const savedHeroPreset = localStorage.getItem("loom_hero_preset");
      if (savedHeroPreset) setActiveHeroPreset(savedHeroPreset);
    } catch (err) {
      console.warn("Could not load collections config:", err);
    }
  }, [isLoggedIn, loginAsAdmin]);

  // Handle PIN Login
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === ADMIN_PIN) {
      setIsAuthenticated(true);
      setPinError(false);
      sessionStorage.setItem("admin_auth", "true");
      loginAsAdmin();
    } else {
      setPinError(true);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin_auth");
    storeLogout();
  };

  // Auto-generate slug from product name
  const handleNameChange = (val: string) => {
    setFormName(val);
    const slug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setFormSlug(slug);
  };

  // Open Add Product Form
  const openAddProduct = () => {
    setSelectedProductForEdit(null);
    setFormName("");
    setFormSlug("");
    setFormPrice("");
    setFormDiscountPrice("");
    setFormFabric("Pure Mulberry Silk");
    setFormColor("");
    setFormCategory("pure-silk");
    setFormDescription("");
    setFormImages([]);
    setFormVideos([]);
    setFormIsBestSeller(false);
    setFormIsFeatured(false);
    setFormStatus("IN_STOCK");
    setFormShowInMasterCreations(true);
    setFormSetAsTierCover(false);
    setImageUrlInput("");
    setVideoUrlInput("");
    setActiveTab("add-product");
  };

  // Open Edit Product Form
  const openEditProduct = (product: SareeSKU) => {
    setSelectedProductForEdit(product);
    setFormName(product.title);
    setFormSlug(product.slug || product.sku.toLowerCase());
    setFormPrice(product.price.toString());
    setFormDiscountPrice(product.showroomPrice ? product.showroomPrice.toString() : "");
    setFormFabric(product.fabric);
    setFormColor(product.colorName);
    setFormCategory(product.category);
    setFormDescription(product.description);
    setFormImages(product.images || []);
    setFormVideos(
      product.videos && product.videos.length > 0
        ? product.videos
        : product.reelVideoPlaceholderUrl
        ? [product.reelVideoPlaceholderUrl]
        : []
    );
    setFormIsBestSeller(false);
    setFormIsFeatured(false);
    setFormStatus(product.stockStatus);
    setFormShowInMasterCreations(Boolean(product.showInMasterCreations ?? true));
    setFormSetAsTierCover(Boolean(product.isTierCover));
    setImageUrlInput("");
    setVideoUrlInput("");
    setActiveTab("edit-product");
  };

  // Handle Image Upload (File reader for instant preview)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Add Image via URL
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setFormImages((prev) => [...prev, imageUrlInput.trim()]);
    setImageUrlInput("");
  };

  // Remove Image
  const handleRemoveImage = (index: number) => {
    setFormImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle Video Upload (File reader or direct URL)
  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (formVideos.length >= 2) {
      alert("Maximum 2 videos allowed per product.");
      return;
    }

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormVideos((prev) => [...prev.slice(0, 1), event.target!.result as string]);
      }
    };
    reader.readAsDataURL(file);
  };

  // Add Video via URL
  const handleAddVideoUrl = () => {
    if (!videoUrlInput.trim()) return;
    if (formVideos.length >= 2) {
      alert("Maximum 2 videos allowed per product.");
      return;
    }
    setFormVideos((prev) => [...prev, videoUrlInput.trim()]);
    setVideoUrlInput("");
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim() || !formPrice.trim()) {
      alert("Please provide at least a Product Name and Price.");
      return;
    }

    const priceNum = parseInt(formPrice.replace(/[^0-9]/g, ""), 10) || 3000;
    const discountPriceNum = parseInt(formDiscountPrice.replace(/[^0-9]/g, ""), 10) || Math.round(priceNum * 1.35);

    const categoryObj = categoriesList.find((c) => c.slug === formCategory) || categoriesList[0];

    const updatedSku: SareeSKU = {
      id: selectedProductForEdit ? selectedProductForEdit.id : `sku-custom-${Date.now()}`,
      sku: selectedProductForEdit ? selectedProductForEdit.sku : `DRM-SSVSS-${Math.floor(100 + Math.random() * 900)}`,
      title: formName,
      slug: formSlug || formName.toLowerCase().replace(/\s+/g, "-"),
      category: formCategory,
      categoryName: categoryObj.name,
      price: priceNum,
      retailPrice: priceNum,
      showroomPrice: discountPriceNum,
      showroomAnchorPrice: discountPriceNum,
      cogs: Math.round(priceNum * 0.4),
      weaverCOGS: Math.round(priceNum * 0.4),
      wholesaleBasePrice: Math.round(priceNum * 0.65),
      fabric: formFabric || "Pure Silk",
      zariType: "Antique Gold Tested Zari",
      silkWeightGrams: 600,
      weaveTimeDays: 7,
      weaverName: "Dharmavaram Master Artisan Guild",
      loomLocation: "Dharmavaram Looms Cluster",
      colorName: formColor || "Auspicious Heritage Hue",
      borderType: "Korvai Contrast Temple Border",
      palluMotif: "Traditional Temple Peacock Zari",
      description: formDescription || "Handcrafted pure silk saree directly from Dharmavaram master pit-looms.",
      blouseDetails: "Includes unstitched matching blouse piece (80 cm)",
      silkMarkCertified: true,
      stockStatus: formStatus,
      stockCount: formStatus === "SOLD_OUT" ? 0 : 5,
      images: formImages.length > 0 ? formImages : ["/images/sarees/pure-01.jpg"],
      videos: formVideos.length > 0 ? formVideos : undefined,
      reelVideoPlaceholderUrl: formVideos[0] || undefined,
      highlights: [
        "100% Authentic Dharmavaram Handloom",
        "Pure Silk Mark Certified",
        "Direct Loom Savings with 0% Markup",
      ],
      showInMasterCreations: formShowInMasterCreations,
      isTierCover: formSetAsTierCover,
    };

    let updatedList: SareeSKU[];

    if (selectedProductForEdit) {
      // Update existing
      updatedList = products.map((p) => (p.id === selectedProductForEdit.id ? updatedSku : p));
    } else {
      // Add new
      updatedList = [updatedSku, ...products];

      // Save custom products list
      const existingCustom = JSON.parse(localStorage.getItem("loom_custom_products") || "[]") as SareeSKU[];
      localStorage.setItem("loom_custom_products", JSON.stringify([updatedSku, ...existingCustom]));
    }

    setProducts(updatedList);

    // Save placement into Master Weaver Creations showcase if selected
    try {
      const currentMasterSkus = JSON.parse(
        localStorage.getItem("loom_master_creations_skus") || JSON.stringify(DEFAULT_MASTER_CREATIONS_SKUS)
      ) as string[];
      let nextMasterSkus = currentMasterSkus.filter((s) => s.toUpperCase() !== updatedSku.sku.toUpperCase());
      if (formShowInMasterCreations) {
        nextMasterSkus = [updatedSku.sku, ...nextMasterSkus].slice(0, 6);
      }
      localStorage.setItem("loom_master_creations_skus", JSON.stringify(nextMasterSkus));
      setMasterCreationsSkus(nextMasterSkus);
    } catch (e) {
      console.warn("Could not update master creations placement:", e);
    }

    // Save placement as Tier Cover image/price if selected
    if (formSetAsTierCover) {
      try {
        const currentTiers = JSON.parse(
          localStorage.getItem("loom_category_tiers") || JSON.stringify(DEFAULT_CATEGORY_TIERS)
        ) as CategoryTier[];
        const updatedTiers = currentTiers.map((tier) => {
          if (tier.slug === formCategory) {
            return {
              ...tier,
              image: formImages[0] || tier.image,
              loomPrice: `Direct Loom: ₹${priceNum.toLocaleString("en-IN")}`,
            };
          }
          return tier;
        });
        localStorage.setItem("loom_category_tiers", JSON.stringify(updatedTiers));
        setCategoryTiers(updatedTiers);
      } catch (e) {
        console.warn("Could not update tier cover placement:", e);
      }
    }

    // Save stock overrides
    const overrides = JSON.parse(localStorage.getItem("loom_inventory_overrides") || "{}") as Record<string, StockStatus>;
    overrides[updatedSku.sku] = formStatus;
    localStorage.setItem("loom_inventory_overrides", JSON.stringify(overrides));

    alert(`Product "${formName}" successfully published to your live storefront!`);
    setActiveTab("products");
  };

  // Delete Product
  const handleDeleteProduct = (sku: string) => {
    if (!confirm(`Are you sure you want to delete SKU ${sku}?`)) return;

    const filtered = products.filter((p) => p.sku !== sku);
    setProducts(filtered);

    // Update custom products
    const existingCustom = JSON.parse(localStorage.getItem("loom_custom_products") || "[]") as SareeSKU[];
    const updatedCustom = existingCustom.filter((p) => p.sku !== sku);
    localStorage.setItem("loom_custom_products", JSON.stringify(updatedCustom));

    // Update overrides
    const overrides = JSON.parse(localStorage.getItem("loom_inventory_overrides") || "{}") as Record<string, StockStatus>;
    delete overrides[sku];
    localStorage.setItem("loom_inventory_overrides", JSON.stringify(overrides));
  };

  // Quick toggle status in products table
  const handleToggleStatus = (sku: string) => {
    const updated = products.map((p) => {
      if (p.sku === sku) {
        const nextStatus: StockStatus = p.stockStatus === "IN_STOCK" ? "SOLD_OUT" : "IN_STOCK";
        return { ...p, stockStatus: nextStatus };
      }
      return p;
    });

    setProducts(updated);

    const target = updated.find((p) => p.sku === sku);
    if (target) {
      const overrides = JSON.parse(localStorage.getItem("loom_inventory_overrides") || "{}") as Record<string, StockStatus>;
      overrides[sku] = target.stockStatus;
      localStorage.setItem("loom_inventory_overrides", JSON.stringify(overrides));
    }
  };

  // Save Collections & Placements Configuration
  const handleSaveCollections = () => {
    try {
      localStorage.setItem("loom_category_tiers", JSON.stringify(categoryTiers));
      localStorage.setItem("loom_category_rail_meta", JSON.stringify(categoryRailMeta));
      localStorage.setItem("loom_master_creations_meta", JSON.stringify(masterCreationsMeta));
      localStorage.setItem("loom_master_creations_skus", JSON.stringify(masterCreationsSkus));
      localStorage.setItem("loom_hero_slides", JSON.stringify(heroSlides));
      localStorage.setItem("loom_hero_preset", activeHeroPreset);
      setCollectionsSaveSuccess(true);
      setTimeout(() => setCollectionsSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save collections:", err);
      alert("Error saving collections configuration");
    }
  };

  const handleSelectHeroPreset = (presetKey: string) => {
    setActiveHeroPreset(presetKey);
    if (HERO_SLIDE_PRESETS[presetKey]) {
      setHeroSlides(HERO_SLIDE_PRESETS[presetKey].slides);
    }
  };

  const handleToggleMasterSku = (sku: string) => {
    const isSelected = masterCreationsSkus.includes(sku);
    let next: string[];
    if (isSelected) {
      next = masterCreationsSkus.filter((s) => s !== sku);
    } else {
      if (masterCreationsSkus.length >= 6) {
        alert("Maximum 6 sarees can be spotlighted in Master Weaver Creations. Please uncheck one first.");
        return;
      }
      next = [...masterCreationsSkus, sku];
    }
    setMasterCreationsSkus(next);
  };

  const handleUpdateTier = (index: number, field: keyof CategoryTier, value: string) => {
    setCategoryTiers((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Stat calculations
  const totalProductsCount = products.length;
  const availableCount = products.filter((p) => p.stockStatus === "IN_STOCK").length;
  const soldOutCount = products.filter((p) => p.stockStatus === "SOLD_OUT").length;
  const categoriesCount = categoriesList.length;

  // PIN Login Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] flex flex-col justify-center items-center px-4 py-12 text-[#F5EFE6]">
        <div className="max-w-md w-full bg-[#121216] border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#E5B842]/10 border border-[#E5B842]/30 flex items-center justify-center mx-auto text-[#E5B842]">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-[#F5EFE6]">
              Admin Console
            </h2>
            <p className="text-xs tracking-widest text-[#D4AF37] uppercase font-semibold">
              SSVSS • Dharmavaram Silk Looms
            </p>
            <p className="text-xs text-gray-400">
              Founder & Store Administrator Authentication
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-1.5">
                Enter Admin Security PIN
              </label>
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setPinError(false);
                }}
                placeholder="••••"
                className="w-full text-center text-2xl tracking-[0.5em] py-3 rounded-xl bg-[#1A1A20] border border-white/15 text-[#E5B842] focus:outline-none focus:border-[#E5B842]"
                autoFocus
              />
            </div>

            {pinError && (
              <p className="text-xs text-red-400 text-center font-medium">
                Invalid Admin Credentials. Access restricted.
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#E5B842] hover:bg-[#D4A732] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-lg active:scale-98"
            >
              Access Admin Console
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-gray-400 hover:text-[#E5B842] transition-colors">
              ← Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#F5EFE6] flex flex-col lg:flex-row">
      {/* LEFT SIDEBAR (Matching Reference 1st, 2nd, 3rd, 4th images) */}
      <aside className="w-full lg:w-64 bg-[#0E0E12] border-b lg:border-b-0 lg:border-r border-white/10 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          {/* Logo / Brand Header */}
          <div>
            <h2 className="font-serif text-xl font-bold text-[#F5EFE6]">Admin Console</h2>
            <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#D4AF37]">
              SSVSS SILKS
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <button
              type="button"
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === "dashboard"
                  ? "bg-[#18181F] border border-[#E5B842]/60 text-[#E5B842] shadow-sm"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === "products" || activeTab === "add-product" || activeTab === "edit-product"
                  ? "bg-[#18181F] border border-[#E5B842]/60 text-[#E5B842] shadow-sm"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Products</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("collections")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === "collections"
                  ? "bg-[#18181F] border border-[#E5B842]/60 text-[#E5B842] shadow-sm"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Collections & Placements</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("categories")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === "categories"
                  ? "bg-[#18181F] border border-[#E5B842]/60 text-[#E5B842] shadow-sm"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <ListFilter className="w-4 h-4" />
              <span>Categories</span>
            </button>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-white/10 space-y-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-[#E5B842] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Storefront</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-red-400 transition-colors w-full"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <main className="flex-1 p-6 sm:p-10 lg:p-12 overflow-y-auto max-w-7xl">
        {/* ======================================================== */}
        {/* 1. DASHBOARD VIEW (Matching 1st Image)                   */}
        {/* ======================================================== */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header + Go to Home & Add Product Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-3xl font-bold text-[#F5EFE6]">Overview</h1>
                <p className="text-xs text-gray-400 mt-1">Store performance and statistics</p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-[#F5EFE6] hover:text-[#E5B842] hover:border-[#E5B842]/50 font-semibold text-xs tracking-wider transition-all shadow-sm group"
                  title="Return to Customer Storefront"
                >
                  <Home className="w-4 h-4 text-[#E5B842] group-hover:scale-110 transition-transform" />
                  <span>Go to Home</span>
                </Link>

                <button
                  type="button"
                  onClick={openAddProduct}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E5B842] hover:bg-[#D4A732] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>
            </div>

            {/* 4 Stat Cards in a row (Exact 1st Image Layout) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="p-6 rounded-2xl bg-[#121216] border border-white/10 space-y-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#E5B842]">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block">
                    TOTAL PRODUCTS
                  </span>
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-[#E5B842] block mt-1">
                    {totalProductsCount}
                  </span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#121216] border border-white/10 space-y-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#E5B842]">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block">
                    AVAILABLE
                  </span>
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-[#E5B842] block mt-1">
                    {availableCount}
                  </span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#121216] border border-white/10 space-y-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#E5B842]">
                  <ListFilter className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block">
                    SOLD OUT
                  </span>
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-[#E5B842] block mt-1">
                    {soldOutCount}
                  </span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#121216] border border-white/10 space-y-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#E5B842]">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block">
                    CATEGORIES
                  </span>
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-[#E5B842] block mt-1">
                    {categoriesCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Management Section (Exact 1st Image Layout) */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#121216] border border-white/10 space-y-4">
              <h3 className="font-serif text-base font-bold text-[#E5B842]">Quick Management</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setActiveTab("products")}
                  className="p-5 rounded-xl bg-[#18181F] border border-white/10 hover:border-[#E5B842]/50 text-left transition-all flex items-center justify-between group"
                >
                  <div>
                    <h4 className="font-serif font-bold text-base text-[#F5EFE6] group-hover:text-[#E5B842] transition-colors">
                      Manage All Products
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">Edit prices, descriptions, and stock.</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#E5B842] group-hover:translate-x-1 transition-all" />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("categories")}
                  className="p-5 rounded-xl bg-[#18181F] border border-white/10 hover:border-[#E5B842]/50 text-left transition-all flex items-center justify-between group"
                >
                  <div>
                    <h4 className="font-serif font-bold text-base text-[#F5EFE6] group-hover:text-[#E5B842] transition-colors">
                      Manage Categories
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">Add or remove product categories.</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#E5B842] group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. PRODUCTS TABLE VIEW (Matching 4th Image)              */}
        {/* ======================================================== */}
        {activeTab === "products" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header + Go to Home & Add Product Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-3xl font-bold text-[#F5EFE6]">Products</h1>
                <p className="text-xs text-gray-400 mt-1">Manage your saree collection</p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-[#F5EFE6] hover:text-[#E5B842] hover:border-[#E5B842]/50 font-semibold text-xs tracking-wider transition-all shadow-sm group"
                  title="Return to Customer Storefront"
                >
                  <Home className="w-4 h-4 text-[#E5B842] group-hover:scale-110 transition-transform" />
                  <span>Go to Home</span>
                </Link>

                <button
                  type="button"
                  onClick={openAddProduct}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E5B842] hover:bg-[#D4A732] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>
            </div>

            {/* Products Table (Exact 4th Image Layout) */}
            <div className="rounded-2xl border border-white/10 bg-[#121216] overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#18181F] border-b border-white/10 text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">
                    <tr>
                      <th className="py-4 px-6">PRODUCT</th>
                      <th className="py-4 px-6">CATEGORY</th>
                      <th className="py-4 px-6">PRICE</th>
                      <th className="py-4 px-6">STATUS</th>
                      <th className="py-4 px-6 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-300">
                    {products.map((item) => {
                      const isAvailable = item.stockStatus === "IN_STOCK";
                      const thumb = item.images && item.images.length > 0 ? item.images[0] : "/images/sarees/pure-01.jpg";

                      return (
                        <tr key={item.sku} className="hover:bg-white/[0.02] transition-colors">
                          {/* Product Info with Thumbnail */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-14 rounded-lg bg-black/40 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={thumb} alt={item.title} className="w-full h-full object-cover" />
                              </div>
                              <div className="max-w-xs">
                                <h4 className="font-serif font-bold text-sm text-[#F5EFE6] leading-snug">
                                  {item.title}
                                </h4>
                                <p className="text-[11px] text-gray-400 mt-0.5">{item.fabric}</p>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-4 px-6 font-medium text-gray-300">
                            {item.categoryName || item.category}
                          </td>

                          {/* Price in Gold */}
                          <td className="py-4 px-6 font-bold text-sm text-[#E5B842]">
                            ₹{item.price.toLocaleString("en-IN")}
                          </td>

                          {/* Status Pill Badge (Clickable toggle) */}
                          <td className="py-4 px-6">
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(item.sku)}
                              title="Click to toggle status"
                              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                                isAvailable
                                  ? "bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900"
                                  : "bg-red-950/70 border border-red-500/40 text-red-300 hover:bg-red-900"
                              }`}
                            >
                              {isAvailable ? "AVAILABLE" : "SOLD OUT"}
                            </button>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2.5">
                              <button
                                type="button"
                                onClick={() => openEditProduct(item)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-[#E5B842] hover:bg-white/5 transition-all"
                                title="Edit Product"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteProduct(item.sku)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5 transition-all"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>

                              <Link
                                href={`/product/${item.sku.toLowerCase()}`}
                                target="_blank"
                                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                                title="View on Storefront"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. ADD / EDIT PRODUCT FORM (Matching 2nd & 3rd Images)   */}
        {/* ======================================================== */}
        {(activeTab === "add-product" || activeTab === "edit-product") && (
          <div className="space-y-6 animate-fadeIn">
            {/* Back link */}
            <button
              type="button"
              onClick={() => setActiveTab("products")}
              className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-[#E5B842] transition-colors uppercase tracking-wider"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Products</span>
            </button>

            {/* Header */}
            <div>
              <h1 className="font-serif text-3xl font-bold text-[#E5B842]">
                {activeTab === "edit-product" ? "Edit Saree" : "Add New Saree"}
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Enter details for the new product in your collection.
              </p>
            </div>

            {/* Main Form Container (Exact 2nd & 3rd Image Layout) */}
            <form onSubmit={handleSaveProduct} className="p-6 sm:p-10 rounded-2xl bg-[#121216] border border-white/10 shadow-2xl space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT COLUMN: Inputs */}
                <div className="lg:col-span-7 space-y-5">
                  {/* Product Name */}
                  <div>
                    <label className="block text-[11px] uppercase font-bold tracking-widest text-[#E5B842] mb-1.5">
                      PRODUCT NAME
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="e.g. Semi tissue,Saree"
                      className="w-full py-3 px-4 rounded-xl bg-[#18181F] border border-white/15 text-sm text-[#F5EFE6] focus:outline-none focus:border-[#E5B842]"
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-[11px] uppercase font-bold tracking-widest text-[#E5B842] mb-1.5">
                      SLUG (URL FRIENDLY)
                    </label>
                    <input
                      type="text"
                      required
                      value={formSlug}
                      onChange={(e) => setFormSlug(e.target.value)}
                      placeholder="semi-tissue-saree"
                      className="w-full py-3 px-4 rounded-xl bg-white text-black font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#E5B842]"
                    />
                  </div>

                  {/* Price & Discount Price */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase font-bold tracking-widest text-[#E5B842] mb-1.5">
                        PRICE (₹)
                      </label>
                      <input
                        type="number"
                        required
                        value={formPrice}
                        onChange={(e) => setFormPrice(e.target.value)}
                        placeholder="2000"
                        className="w-full py-3 px-4 rounded-xl bg-[#18181F] border border-white/15 text-sm text-[#F5EFE6] focus:outline-none focus:border-[#E5B842]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase font-bold tracking-widest text-[#E5B842] mb-1.5">
                        DISCOUNT PRICE (₹)
                      </label>
                      <input
                        type="number"
                        value={formDiscountPrice}
                        onChange={(e) => setFormDiscountPrice(e.target.value)}
                        placeholder="2300"
                        className="w-full py-3 px-4 rounded-xl bg-[#18181F] border border-white/15 text-sm text-[#F5EFE6] focus:outline-none focus:border-[#E5B842]"
                      />
                    </div>
                  </div>

                  {/* Fabric & Color */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase font-bold tracking-widest text-[#E5B842] mb-1.5">
                        FABRIC
                      </label>
                      <input
                        type="text"
                        value={formFabric}
                        onChange={(e) => setFormFabric(e.target.value)}
                        placeholder="e.g. Pure Silk / Semi Pattu"
                        className="w-full py-3 px-4 rounded-xl bg-[#18181F] border border-white/15 text-sm text-[#F5EFE6] focus:outline-none focus:border-[#E5B842]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase font-bold tracking-widest text-[#E5B842] mb-1.5">
                        COLOR
                      </label>
                      <input
                        type="text"
                        value={formColor}
                        onChange={(e) => setFormColor(e.target.value)}
                        placeholder="e.g. Green & Gold"
                        className="w-full py-3 px-4 rounded-xl bg-[#18181F] border border-white/15 text-sm text-[#F5EFE6] focus:outline-none focus:border-[#E5B842]"
                      />
                    </div>
                  </div>

                  {/* Category Dropdown */}
                  <div>
                    <label className="block text-[11px] uppercase font-bold tracking-widest text-[#E5B842] mb-1.5">
                      CATEGORY
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as SareeCategory)}
                      className="w-full py-3 px-4 rounded-xl bg-[#18181F] border border-white/15 text-sm text-[#F5EFE6] focus:outline-none focus:border-[#E5B842]"
                    >
                      {categoriesList.map((cat) => (
                        <option key={cat.id} value={cat.slug} className="bg-[#18181F] text-white">
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* STOREFRONT COLLECTION PLACEMENT (Core Requirement) */}
                  <div className="p-4 rounded-xl bg-[#18181F] border border-[#E5B842]/30 space-y-3">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-[#E5B842]" />
                      <span className="text-xs uppercase font-bold tracking-wider text-[#E5B842]">
                        Storefront Placement Controls
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      Decide where this saree should appear across the customer homepage and collection showcases:
                    </p>

                    <div className="space-y-2.5 pt-1">
                      {/* Placement 1: Master Weaver Creations */}
                      <label className="flex items-start gap-3 p-2.5 rounded-lg bg-black/40 border border-white/10 hover:border-[#E5B842]/40 cursor-pointer transition-all">
                        <input
                          type="checkbox"
                          checked={formShowInMasterCreations}
                          onChange={(e) => setFormShowInMasterCreations(e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded bg-[#18181F] border-white/20 text-[#E5B842] focus:ring-0"
                        />
                        <div className="text-xs">
                          <span className="font-semibold text-white flex items-center gap-1.5">
                            Feature in &ldquo;Loom-Fresh Arrivals: Master Weaver Creations&rdquo;
                            <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-bold bg-[#E5B842]/20 text-[#E5B842]">
                              Home Showcase
                            </span>
                          </span>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            Places this saree directly in the spotlight 6-saree section on the customer homepage.
                          </p>
                        </div>
                      </label>

                      {/* Placement 2: Curated Weaving Tiers */}
                      <label className="flex items-start gap-3 p-2.5 rounded-lg bg-black/40 border border-white/10 hover:border-[#E5B842]/40 cursor-pointer transition-all">
                        <input
                          type="checkbox"
                          checked={formSetAsTierCover}
                          onChange={(e) => setFormSetAsTierCover(e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded bg-[#18181F] border-white/20 text-[#E5B842] focus:ring-0"
                        />
                        <div className="text-xs">
                          <span className="font-semibold text-white flex items-center gap-1.5">
                            Set as Cover Photo for &ldquo;Curated Weaving Tiers&rdquo;
                            <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-bold bg-amber-500/20 text-amber-300">
                              {categoriesList.find((c) => c.slug === formCategory)?.name || formCategory}
                            </span>
                          </span>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            Updates the primary cover photo & starting price for this category card in the top collection rail.
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: Description, Images & Video Upload */}
                <div className="lg:col-span-5 space-y-5">
                  {/* Description */}
                  <div>
                    <label className="block text-[11px] uppercase font-bold tracking-widest text-[#E5B842] mb-1.5">
                      DESCRIPTION
                    </label>
                    <textarea
                      rows={4}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Enter saree weave details, zari type, border details, and styling notes..."
                      className="w-full py-3 px-4 rounded-xl bg-[#18181F] border border-white/15 text-sm text-[#F5EFE6] focus:outline-none focus:border-[#E5B842]"
                    />
                  </div>

                  {/* Product Images Upload (Image 2/3 Reference) */}
                  <div>
                    <label className="block text-[11px] uppercase font-bold tracking-widest text-[#E5B842] mb-1.5">
                      PRODUCT IMAGES
                    </label>

                    {/* Upload Drop Zone */}
                    <label className="w-full h-32 rounded-xl border-2 border-dashed border-white/20 hover:border-[#E5B842]/60 bg-[#18181F] flex flex-col items-center justify-center cursor-pointer transition-all group">
                      <Upload className="w-6 h-6 text-gray-400 group-hover:text-[#E5B842] mb-2 transition-colors" />
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-300 group-hover:text-[#E5B842]">
                        UPLOAD
                      </span>
                      <span className="text-[10px] text-gray-500 mt-1">PNG, JPG, WebP supported</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>

                    {/* Optional Image URL Input */}
                    <div className="flex gap-2 mt-2">
                      <input
                        type="url"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        placeholder="Or paste image URL (e.g. /images/sarees/pure-01.jpg)"
                        className="flex-1 py-1.5 px-3 rounded-lg bg-[#18181F] border border-white/15 text-xs text-gray-300"
                      />
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold"
                      >
                        Add URL
                      </button>
                    </div>

                    {/* Uploaded Images Thumbnails */}
                    {formImages.length > 0 && (
                      <div className="flex flex-wrap gap-2.5 mt-3">
                        {formImages.map((img, idx) => (
                          <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/20 group">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img} alt="Product view" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Product Videos Upload (Max 2) (Image 2/3 Reference) */}
                  <div>
                    <label className="block text-[11px] uppercase font-bold tracking-widest text-[#E5B842] mb-1.5">
                      PRODUCT VIDEOS (MAX 2)
                    </label>

                    {/* Video Upload Drop Zone */}
                    <label className="w-full h-28 rounded-xl border-2 border-dashed border-white/20 hover:border-[#E5B842]/60 bg-[#18181F] flex flex-col items-center justify-center cursor-pointer transition-all group">
                      <Video className="w-6 h-6 text-gray-400 group-hover:text-[#E5B842] mb-2 transition-colors" />
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-300 group-hover:text-[#E5B842]">
                        UPLOAD VIDEO
                      </span>
                      <span className="text-[10px] text-gray-500 mt-1">MP4, WebM (Up to 2 reels/videos)</span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoFileUpload}
                        className="hidden"
                      />
                    </label>

                    {/* Video URL Fallback */}
                    <div className="flex gap-2 mt-2">
                      <input
                        type="url"
                        value={videoUrlInput}
                        onChange={(e) => setVideoUrlInput(e.target.value)}
                        placeholder="Or paste video link (MP4, Reel, Loom video)"
                        className="flex-1 py-1.5 px-3 rounded-lg bg-[#18181F] border border-white/15 text-xs text-gray-300"
                      />
                      <button
                        type="button"
                        onClick={handleAddVideoUrl}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold"
                      >
                        Add URL
                      </button>
                    </div>

                    {formVideos.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {formVideos.map((vid, i) => (
                          <div key={i} className="flex items-center justify-between text-xs p-2 rounded bg-black/40 border border-white/10">
                            <span className="truncate max-w-[200px] text-emerald-400">📹 Video {i + 1} Attached</span>
                            <button
                              type="button"
                              onClick={() => setFormVideos((prev) => prev.filter((_, idx) => idx !== i))}
                              className="text-red-400 hover:underline text-[11px]"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Best Sellers, Featured & Status (Image 3 Reference) */}
                  <div className="pt-2 space-y-3">
                    <div className="flex flex-wrap items-center gap-6 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formIsBestSeller}
                          onChange={(e) => setFormIsBestSeller(e.target.checked)}
                          className="w-4 h-4 rounded bg-[#18181F] border-white/20 text-[#E5B842] focus:ring-0"
                        />
                        <span className="text-gray-300">Add to Best Sellers</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formIsFeatured}
                          onChange={(e) => setFormIsFeatured(e.target.checked)}
                          className="w-4 h-4 rounded bg-[#18181F] border-white/20 text-[#E5B842] focus:ring-0"
                        />
                        <span className="text-gray-300">Add to Featured Collections</span>
                      </label>
                    </div>

                    {/* Status Dropdown */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 font-bold uppercase">Status:</span>
                      <select
                        value={formStatus}
                        onChange={(e) => setFormStatus(e.target.value as StockStatus)}
                        className="py-1.5 px-3 rounded-lg bg-[#18181F] border border-white/20 text-xs font-semibold text-emerald-400 focus:outline-none"
                      >
                        <option value="IN_STOCK" className="text-emerald-400">Available</option>
                        <option value="SOLD_OUT" className="text-red-400">Sold Out</option>
                        <option value="WEAVER_HOLD" className="text-yellow-400">Weaver Hold</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* PUBLISH MASTERPIECE BUTTON (Exact 3rd Image Layout) */}
              <div className="pt-6 border-t border-white/10 flex justify-end">
                <button
                  type="submit"
                  className="py-3.5 px-8 rounded-xl bg-[#E5B842] hover:bg-[#D4A732] text-black font-bold text-xs uppercase tracking-widest flex items-center gap-2.5 shadow-xl transition-all active:scale-98"
                >
                  <Save className="w-4 h-4" />
                  <span>PUBLISH MASTERPIECE</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* 4. CATEGORIES VIEW                                       */}
        {/* ======================================================== */}
        {activeTab === "categories" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-3xl font-bold text-[#F5EFE6]">Categories</h1>
                <p className="text-xs text-gray-400 mt-1">Manage saree weave categories and collections</p>
              </div>

              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-[#F5EFE6] hover:text-[#E5B842] hover:border-[#E5B842]/50 font-semibold text-xs tracking-wider transition-all shadow-sm group w-fit"
                title="Return to Customer Storefront"
              >
                <Home className="w-4 h-4 text-[#E5B842] group-hover:scale-110 transition-transform" />
                <span>Go to Home</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {categoriesList.map((cat) => {
                const count = products.filter((p) => p.category === cat.slug || p.categoryName === cat.name).length;

                return (
                  <div key={cat.id} className="p-6 rounded-2xl bg-[#121216] border border-white/10 space-y-3">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] block">
                      HANDLOOM COLLECTION
                    </span>
                    <h3 className="font-serif text-xl font-bold text-[#F5EFE6]">{cat.name}</h3>
                    <p className="text-xs text-gray-400">Slug: <code className="text-[#E5B842]">{cat.slug}</code></p>
                    <div className="pt-2 flex items-center justify-between border-t border-white/10 text-xs">
                      <span className="text-gray-400">Available Sarees:</span>
                      <span className="font-bold text-[#E5B842]">{count} Sarees</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 5. COLLECTIONS & PLACEMENTS VIEW                         */}
        {/* ======================================================== */}
        {activeTab === "collections" && (
          <div className="space-y-8 animate-fadeIn pb-16">
            {/* Header & Global Save */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#121216] border border-white/10">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#E5B842] block">
                  STOREFRONT DESIGN & CURATION
                </span>
                <h1 className="font-serif text-3xl font-bold text-[#F5EFE6] mt-1">
                  Collections & Placements
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                  Customize both homepage showcase sections, headings, discount badges, and featured sarees in real time.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-[#F5EFE6] hover:text-[#E5B842] hover:border-[#E5B842]/50 font-semibold text-xs tracking-wider transition-all"
                  title="Preview Customer Storefront"
                >
                  <Home className="w-4 h-4 text-[#E5B842]" />
                  <span>Preview Home</span>
                </Link>

                <button
                  type="button"
                  onClick={handleSaveCollections}
                  className="py-2.5 px-6 rounded-xl bg-[#E5B842] hover:bg-[#D4A732] text-black font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl transition-all active:scale-98"
                >
                  {collectionsSaveSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-black" />
                      <span>Saved Live!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save All Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Success toast banner */}
            {collectionsSaveSuccess && (
              <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  <strong>Success!</strong> All changes to both collections have been saved and applied to your live customer storefront.
                </span>
              </div>
            )}

            {/* HERO BANNER CAROUSEL MANAGEMENT (Home Page Top Carousel) */}
            <div className="p-6 rounded-2xl bg-[#121216] border border-white/10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#E5B842] block">
                    HOMEPAGE HERO BANNER CAROUSEL
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#F5EFE6] mt-0.5">
                    Live Hero Carousel Banners
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Full-width luxury edge-to-edge banners. Rotates automatically every 3.5 seconds on the customer storefront.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#E5B842] font-semibold">
                    {heroSlides.length} Active Slides
                  </span>
                </div>
              </div>

              {/* Preset Selector */}
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">
                  CHOOSE BANNER SET PRESET
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {Object.entries(HERO_SLIDE_PRESETS).map(([key, preset]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleSelectHeroPreset(key)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        activeHeroPreset === key
                          ? "bg-[#E5B842]/10 border-[#E5B842] text-white shadow-sm ring-1 ring-[#E5B842]"
                          : "bg-[#18181F] border-white/10 text-gray-400 hover:text-white hover:border-white/30"
                      }`}
                    >
                      <div className="text-xs font-bold text-[#F5EFE6]">{preset.label}</div>
                      <div className="text-[10px] text-gray-400 mt-1">
                        {preset.slides.length} Luxury Banners
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Hero Slides Preview */}
              <div>
                <h3 className="text-xs uppercase font-bold tracking-wider text-gray-300 mb-3">
                  Active Banner Slides (Preview & Destination Links)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {heroSlides.map((slide, idx) => (
                    <div
                      key={slide.id || idx}
                      className="p-3 rounded-xl bg-[#18181F] border border-white/10 space-y-2.5 flex flex-col justify-between"
                    >
                      <div className="relative aspect-[1024/227] rounded-lg overflow-hidden bg-black/60 border border-white/10 group">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-[9px] font-bold bg-[#E5B842] text-black">
                          Slide #{idx + 1}
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div>
                          <label className="block text-[9px] uppercase font-bold tracking-wider text-gray-400 mb-0.5">
                            Slide Title
                          </label>
                          <input
                            type="text"
                            value={slide.title}
                            onChange={(e) => {
                              const updated = [...heroSlides];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              setHeroSlides(updated);
                            }}
                            className="w-full py-1.5 px-2 rounded bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#E5B842]"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] uppercase font-bold tracking-wider text-[#E5B842] mb-0.5">
                            Click Destination Link
                          </label>
                          <input
                            type="text"
                            value={slide.href}
                            onChange={(e) => {
                              const updated = [...heroSlides];
                              updated[idx] = { ...updated[idx], href: e.target.value };
                              setHeroSlides(updated);
                            }}
                            className="w-full py-1.5 px-2 rounded bg-black/40 border border-white/10 text-xs text-[#E5B842] focus:outline-none focus:border-[#E5B842]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* COLLECTION 1: CURATED WEAVING TIERS */}
            <div className="p-6 rounded-2xl bg-[#121216] border border-white/10 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#E5B842] block">
                    COLLECTION SECTION 1 (TOP RAIL)
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#F5EFE6] mt-0.5">
                    Curated Weaving Tiers
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Controls the 4-column tier collection cards on the homepage (Semi-Silk, Pure Silk, Handloom Bridal, B2B Wholesale).
                  </p>
                </div>
              </div>

              {/* Section Header Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-[#18181F] border border-white/10">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-[#E5B842] mb-1">
                    Section Eyebrow Tag
                  </label>
                  <input
                    type="text"
                    value={categoryRailMeta.eyebrow}
                    onChange={(e) =>
                      setCategoryRailMeta((prev) => ({ ...prev, eyebrow: e.target.value }))
                    }
                    className="w-full py-2 px-3 rounded-lg bg-black/40 border border-white/15 text-xs text-[#F5EFE6] focus:outline-none focus:border-[#E5B842]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-[#E5B842] mb-1">
                    Section Main Heading
                  </label>
                  <input
                    type="text"
                    value={categoryRailMeta.title}
                    onChange={(e) =>
                      setCategoryRailMeta((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="w-full py-2 px-3 rounded-lg bg-black/40 border border-white/15 text-xs text-[#F5EFE6] focus:outline-none focus:border-[#E5B842]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-[#E5B842] mb-1">
                    Section Subtitle
                  </label>
                  <input
                    type="text"
                    value={categoryRailMeta.subtitle}
                    onChange={(e) =>
                      setCategoryRailMeta((prev) => ({ ...prev, subtitle: e.target.value }))
                    }
                    className="w-full py-2 px-3 rounded-lg bg-black/40 border border-white/15 text-xs text-[#F5EFE6] focus:outline-none focus:border-[#E5B842]"
                  />
                </div>
              </div>

              {/* 4 Tier Cards Editor */}
              <div>
                <h3 className="text-xs uppercase font-bold tracking-wider text-gray-300 mb-3">
                  Tier Cards Configuration (4 Tiers)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {categoryTiers.map((tier, index) => (
                    <div
                      key={tier.id}
                      className="p-4 rounded-xl bg-[#18181F] border border-white/10 space-y-3 flex flex-col justify-between"
                    >
                      {/* Image Thumbnail & Badge Preview */}
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-black/60 border border-white/10 group">
                        <img
                          src={tier.image}
                          alt={tier.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[#5B1020]/90 text-white shadow-md border border-[#E5B842]/40">
                          {tier.discountBadge}
                        </div>
                      </div>

                      <div className="space-y-2 pt-1 text-xs">
                        <div>
                          <label className="block text-[9px] uppercase font-bold tracking-wider text-gray-400 mb-0.5">
                            Tier Title
                          </label>
                          <input
                            type="text"
                            value={tier.title}
                            onChange={(e) => handleUpdateTier(index, "title", e.target.value)}
                            className="w-full py-1.5 px-2 rounded bg-black/40 border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-[#E5B842]"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] uppercase font-bold tracking-wider text-amber-400 mb-0.5">
                            Badge (e.g. 33% OFF / SILK MARK)
                          </label>
                          <input
                            type="text"
                            value={tier.discountBadge}
                            onChange={(e) => handleUpdateTier(index, "discountBadge", e.target.value)}
                            className="w-full py-1.5 px-2 rounded bg-black/40 border border-white/10 text-xs text-[#E5B842] focus:outline-none focus:border-[#E5B842]"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] uppercase font-bold tracking-wider text-gray-400 mb-0.5">
                            Showroom Anchor Price
                          </label>
                          <input
                            type="text"
                            value={tier.anchorPrice}
                            onChange={(e) => handleUpdateTier(index, "anchorPrice", e.target.value)}
                            className="w-full py-1.5 px-2 rounded bg-black/40 border border-white/10 text-xs text-gray-300 focus:outline-none focus:border-[#E5B842]"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] uppercase font-bold tracking-wider text-emerald-400 mb-0.5">
                            Direct Loom Price
                          </label>
                          <input
                            type="text"
                            value={tier.loomPrice}
                            onChange={(e) => handleUpdateTier(index, "loomPrice", e.target.value)}
                            className="w-full py-1.5 px-2 rounded bg-black/40 border border-white/10 text-xs font-semibold text-emerald-300 focus:outline-none focus:border-[#E5B842]"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] uppercase font-bold tracking-wider text-gray-400 mb-0.5">
                            Card Subtitle / Spec
                          </label>
                          <input
                            type="text"
                            value={tier.description}
                            onChange={(e) => handleUpdateTier(index, "description", e.target.value)}
                            className="w-full py-1.5 px-2 rounded bg-black/40 border border-white/10 text-[11px] text-gray-400 focus:outline-none focus:border-[#E5B842]"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] uppercase font-bold tracking-wider text-gray-400 mb-0.5">
                            Cover Image URL / Path
                          </label>
                          <input
                            type="text"
                            value={tier.image}
                            onChange={(e) => handleUpdateTier(index, "image", e.target.value)}
                            className="w-full py-1.5 px-2 rounded bg-black/40 border border-white/10 text-[11px] text-gray-400 font-mono truncate focus:outline-none focus:border-[#E5B842]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* COLLECTION 2: MASTER WEAVER CREATIONS */}
            <div className="p-6 rounded-2xl bg-[#121216] border border-white/10 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#E5B842] block">
                    COLLECTION SECTION 2 (SPOTLIGHT SHOWCASE)
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#F5EFE6] mt-0.5">
                    Loom-Fresh Arrivals: Master Weaver Creations
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Select exactly which sarees appear in the 6-slot spotlight section on the homepage.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#E5B842]">
                    {masterCreationsSkus.length} of 6 Sarees Active
                  </span>
                </div>
              </div>

              {/* Section Header Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-[#18181F] border border-white/10">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-[#E5B842] mb-1">
                    Section Eyebrow Tag
                  </label>
                  <input
                    type="text"
                    value={masterCreationsMeta.eyebrow}
                    onChange={(e) =>
                      setMasterCreationsMeta((prev) => ({ ...prev, eyebrow: e.target.value }))
                    }
                    className="w-full py-2 px-3 rounded-lg bg-black/40 border border-white/15 text-xs text-[#F5EFE6] focus:outline-none focus:border-[#E5B842]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-[#E5B842] mb-1">
                    Section Main Heading
                  </label>
                  <input
                    type="text"
                    value={masterCreationsMeta.title}
                    onChange={(e) =>
                      setMasterCreationsMeta((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="w-full py-2 px-3 rounded-lg bg-black/40 border border-white/15 text-xs text-[#F5EFE6] focus:outline-none focus:border-[#E5B842]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-[#E5B842] mb-1">
                    Section Subtitle
                  </label>
                  <input
                    type="text"
                    value={masterCreationsMeta.subtitle}
                    onChange={(e) =>
                      setMasterCreationsMeta((prev) => ({ ...prev, subtitle: e.target.value }))
                    }
                    className="w-full py-2 px-3 rounded-lg bg-black/40 border border-white/15 text-xs text-[#F5EFE6] focus:outline-none focus:border-[#E5B842]"
                  />
                </div>
              </div>

              {/* Saree Showcase Selector (Choose which 6 sarees are featured) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs uppercase font-bold tracking-wider text-gray-300">
                    Assign Sarees to the 6 Showcase Slots
                  </h3>
                  <span className="text-[11px] text-gray-400">
                    Click any saree card to toggle its placement on the homepage showcase.
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {products.map((product) => {
                    const isSelected = masterCreationsSkus.includes(product.sku);
                    const slotIndex = masterCreationsSkus.indexOf(product.sku);
                    const discountPct =
                      product.showroomPrice > product.price
                        ? Math.round(((product.showroomPrice - product.price) / product.showroomPrice) * 100)
                        : null;

                    return (
                      <div
                        key={product.sku}
                        onClick={() => handleToggleMasterSku(product.sku)}
                        className={`relative rounded-xl border p-2 cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? "bg-[#18181F] border-[#E5B842] shadow-lg shadow-[#E5B842]/10 ring-1 ring-[#E5B842]"
                            : "bg-[#121216] border-white/10 hover:border-white/30 opacity-70 hover:opacity-100"
                        }`}
                      >
                        {/* Slot Badge */}
                        {isSelected && (
                          <div className="absolute top-3 right-3 z-10 w-6 h-6 rounded-full bg-[#E5B842] text-black font-bold text-[10px] flex items-center justify-center shadow-md">
                            #{slotIndex + 1}
                          </div>
                        )}

                        <div className="relative aspect-square rounded-lg overflow-hidden bg-black/60 mb-2">
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                          {discountPct && (
                            <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#5B1020] text-white">
                              {discountPct}% OFF
                            </div>
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="text-[10px] font-mono text-[#E5B842] truncate">
                            {product.sku}
                          </div>
                          <div className="text-[11px] font-semibold text-white line-clamp-1">
                            {product.title}
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-bold text-emerald-400">
                              ₹{product.price.toLocaleString("en-IN")}
                            </span>
                            <span className="text-gray-400 text-[9px] capitalize">
                              {product.category}
                            </span>
                          </div>
                        </div>

                        <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                          <span
                            className={`font-semibold ${
                              isSelected ? "text-[#E5B842]" : "text-gray-400"
                            }`}
                          >
                            {isSelected ? "Featured ✓" : "Not Featured"}
                          </span>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="w-3.5 h-3.5 rounded bg-black/40 border-white/20 text-[#E5B842] focus:ring-0"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Save Action */}
              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveCollections}
                  className="py-3 px-8 rounded-xl bg-[#E5B842] hover:bg-[#D4A732] text-black font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl transition-all active:scale-98"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Collections Configuration</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
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
} from "lucide-react";
import { CATALOG, SareeSKU, SareeCategory, StockStatus } from "@/data/catalog";
import { useAuthStore } from "@/store/useAuthStore";
import { MERCHANT_CONFIG } from "@/lib/config";

const ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || "2027";

export function AdminConsole() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "categories" | "add-product" | "edit-product">("dashboard");
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

  const { isLoggedIn, loginAsAdmin, logout: storeLogout } = useAuthStore();

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
    if (auth === "true" || isLoggedIn) {
      setIsAuthenticated(true);
      loginAsAdmin();
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
    setFormVideos(product.reelVideoPlaceholderUrl ? [product.reelVideoPlaceholderUrl] : []);
    setFormIsBestSeller(false);
    setFormIsFeatured(false);
    setFormStatus(product.stockStatus);
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
      reelVideoPlaceholderUrl: formVideos[0] || undefined,
      highlights: [
        "100% Authentic Dharmavaram Handloom",
        "Pure Silk Mark Certified",
        "Direct Loom Savings with 0% Markup",
      ],
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
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-1.5">
                Enter Security PIN
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
                Invalid Admin PIN. (Default: 2027)
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
            {/* Header + Add Product Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-3xl font-bold text-[#F5EFE6]">Overview</h1>
                <p className="text-xs text-gray-400 mt-1">Store performance and statistics</p>
              </div>

              <button
                type="button"
                onClick={openAddProduct}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E5B842] hover:bg-[#D4A732] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
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
            {/* Header + Add Product Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-3xl font-bold text-[#F5EFE6]">Products</h1>
                <p className="text-xs text-gray-400 mt-1">Manage your saree collection</p>
              </div>

              <button
                type="button"
                onClick={openAddProduct}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E5B842] hover:bg-[#D4A732] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-serif text-3xl font-bold text-[#F5EFE6]">Categories</h1>
                <p className="text-xs text-gray-400 mt-1">Manage saree weave categories and collections</p>
              </div>
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
      </main>
    </div>
  );
}
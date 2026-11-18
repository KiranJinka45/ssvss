/**
 * Dharmavaram Silk Sarees — Unified Zustand Cart & Wishlist Store
 * Supports both D2C Single-Loom Checkout and B2B Bulk Tier MOQ
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { SareeSKU } from "@/data/catalog";
import { getB2BTier, FIXED_WHOLESALE_BASE_PRICES } from "@/lib/pricing";

export interface CartItem {
  saree: SareeSKU;
  quantity: number;
  finishOption: "Standard Unstitched Blouse" | "Add Fall & Pico (+₹200)" | "Bridal Tassels & Fall-Pico (+₹450)";
  finishCost: number;
}

interface CartStore {
  // Retail Cart
  items: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (saree: SareeSKU, finishOption?: CartItem["finishOption"]) => void;
  removeItem: (sku: string) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  updateFinish: (sku: string, finishOption: CartItem["finishOption"]) => void;
  clearCart: () => void;

  // B2B Mode
  isB2BMode: boolean;
  setB2BMode: (enabled: boolean) => void;

  // Wishlist
  wishlistSkus: string[];
  toggleWishlist: (sku: string) => void;
  isInWishlist: (sku: string) => boolean;

  // Calculations
  getTotalItemsCount: () => number;
  getSubtotal: () => number;
  getTotalSavings: () => number;
  getGrandTotal: () => number;
}

const FINISH_COSTS: Record<CartItem["finishOption"], number> = {
  "Standard Unstitched Blouse": 0,
  "Add Fall & Pico (+₹200)": 200,
  "Bridal Tassels & Fall-Pico (+₹450)": 450,
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      isB2BMode: false,
      wishlistSkus: [],

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      setB2BMode: (enabled) => set({ isB2BMode: enabled }),

      addItem: (saree, finishOption = "Standard Unstitched Blouse") => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.saree.sku === saree.sku && i.finishOption === finishOption
          );

          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex].quantity += 1;
            return { items: updated, isCartOpen: true };
          }

          return {
            items: [
              ...state.items,
              {
                saree,
                quantity: 1,
                finishOption,
                finishCost: FINISH_COSTS[finishOption],
              },
            ],
            isCartOpen: true,
          };
        });
      },

      removeItem: (sku) => {
        set((state) => ({
          items: state.items.filter((i) => i.saree.sku !== sku),
        }));
      },

      updateQuantity: (sku, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((i) => i.saree.sku !== sku),
            };
          }
          return {
            items: state.items.map((i) =>
              i.saree.sku === sku ? { ...i, quantity } : i
            ),
          };
        });
      },

      updateFinish: (sku, finishOption) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.saree.sku === sku
              ? {
                  ...i,
                  finishOption,
                  finishCost: FINISH_COSTS[finishOption],
                }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      toggleWishlist: (sku) => {
        set((state) => {
          const exists = state.wishlistSkus.includes(sku);
          return {
            wishlistSkus: exists
              ? state.wishlistSkus.filter((id) => id !== sku)
              : [...state.wishlistSkus, sku],
          };
        });
      },

      isInWishlist: (sku) => {
        return get().wishlistSkus.includes(sku);
      },

      getTotalItemsCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          const itemBase = (item.saree.price + item.finishCost) * item.quantity;
          return total + itemBase;
        }, 0);
      },

      getTotalSavings: () => {
        return get().items.reduce((total, item) => {
          const diff = Math.max(0, item.saree.showroomPrice - item.saree.price);
          return total + diff * item.quantity;
        }, 0);
      },

      getGrandTotal: () => {
        const subtotal = get().getSubtotal();
        const { isB2BMode, items } = get();

        if (isB2BMode) {
          const totalUnits = get().getTotalItemsCount();
          const tier = getB2BTier(totalUnits);
          if (tier) {
            // Apply category-specific fixed wholesale pricing
            return items.reduce((sum, item) => {
              const baseWholesale = FIXED_WHOLESALE_BASE_PRICES[item.saree.category] || item.saree.price;
              const concession = tier.discountPerSaree[item.saree.category] || 0;
              const unitPrice = baseWholesale - concession + item.finishCost;
              return sum + unitPrice * item.quantity;
            }, 0);
          }
        }

        return subtotal;
      },
    }),
    {
      name: "dharmavaram_cart_storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        wishlistSkus: state.wishlistSkus,
        isB2BMode: state.isB2BMode,
      }),
    }
  )
);

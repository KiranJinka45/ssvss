"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface UserProfile {
  name: string;
  email?: string;
  phone?: string;
  role: "admin" | "customer";
}

interface AuthStore {
  isLoggedIn: boolean;
  user: UserProfile | null;
  loginAsAdmin: () => void;
  loginAsCustomer: (data: { name: string; email?: string; phone?: string }) => void;
  logout: () => void;
  syncFromStorage: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,

      loginAsAdmin: () => {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("admin_auth", "true");
        }
        set({
          isLoggedIn: true,
          user: {
            name: "Loom Admin",
            role: "admin",
          },
        });
      },

      loginAsCustomer: (data) => {
        set({
          isLoggedIn: true,
          user: {
            name: data.name || "Valued Customer",
            email: data.email,
            phone: data.phone,
            role: "customer",
          },
        });
      },

      logout: () => {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("admin_auth");
          localStorage.removeItem("customer_auth");
        }
        set({
          isLoggedIn: false,
          user: null,
        });
      },

      syncFromStorage: () => {
        if (typeof window !== "undefined") {
          const adminAuth = sessionStorage.getItem("admin_auth") === "true";
          if (adminAuth && (!get().isLoggedIn || get().user?.role !== "admin")) {
            set({
              isLoggedIn: true,
              user: {
                name: "Loom Admin",
                role: "admin",
              },
            });
          }
        }
      },
    }),
    {
      name: "dharmavaram_auth_state",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

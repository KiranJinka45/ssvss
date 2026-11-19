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
  loginWithUser: (user: UserProfile) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
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

      loginWithUser: (user: UserProfile) => {
        if (typeof window !== "undefined") {
          if (user.role === "admin") {
            sessionStorage.setItem("admin_auth", "true");
          } else {
            sessionStorage.removeItem("admin_auth");
          }
        }
        set({
          isLoggedIn: true,
          user,
        });
      },

      loginAsCustomer: (data) => {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("admin_auth");
        }
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

      updateProfile: (data) => {
        const currentUser = get().user;
        if (!currentUser) return;
        set({
          user: {
            ...currentUser,
            ...data,
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
          const currentUser = get().user;
          // Only sync admin role if explicit admin session exists and user is not a customer
          if (adminAuth && currentUser?.role === "admin") {
            set({
              isLoggedIn: true,
              user: {
                name: currentUser.name || "Loom Admin",
                role: "admin",
              },
            });
          } else if (currentUser?.role === "customer") {
            sessionStorage.removeItem("admin_auth");
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

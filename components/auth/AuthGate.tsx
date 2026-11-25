"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoginRoute =
    pathname === "/login" || pathname === "/signup" || pathname === "/register";
  const isAdminRoute = pathname?.startsWith("/admin");
  const isAuthBypassed = isLoginRoute || isAdminRoute;

  useEffect(() => {
    if (mounted && !isLoggedIn && !isAuthBypassed) {
      router.replace("/login");
    }
  }, [mounted, isLoggedIn, isAuthBypassed, router]);

  // If on login or admin route, render without app auth gate
  if (isAuthBypassed) {
    return <>{children}</>;
  }

  // Before hydration, show a branded silk splash screen so unauthenticated users cannot glimpse the app
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center text-loom-charcoal">
        <div className="text-center space-y-3 animate-fadeIn">
          <span className="font-serif text-3xl font-bold tracking-tight text-[#5B1020]">
            DHARMAVARAM
          </span>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#C59B27] font-semibold">
            Handloom Silk Looms
          </p>
          <div className="pt-4 flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-[#5B1020] animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  // If mounted and not logged in, show redirecting indicator while route changes to /login
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center text-loom-charcoal">
        <div className="text-center space-y-3 animate-fadeIn">
          <span className="font-serif text-3xl font-bold tracking-tight text-[#5B1020]">
            DHARMAVARAM
          </span>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#C59B27] font-semibold">
            Handloom Silk Looms
          </p>
          <div className="pt-4 flex items-center justify-center gap-2 text-xs text-loom-stone">
            <Loader2 className="w-4 h-4 text-[#5B1020] animate-spin" />
            <span>Redirecting to Customer Sign In...</span>
          </div>
        </div>
      </div>
    );
  }

  // Only when user is logged in: render the full app!
  return <>{children}</>;
}

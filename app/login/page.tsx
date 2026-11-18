"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Phone,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { MERCHANT_CONFIG } from "@/lib/config";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginPage() {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { loginAsCustomer } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsCustomer({
      name: name || (email ? email.split("@")[0] : "Valued Customer"),
      email,
      phone,
    });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block group">
            <span className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-maroon group-hover:opacity-90 transition-opacity">
              DHARMAVARAM
            </span>
          </Link>
          <p className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold">
            Handloom Silk Looms • Customer Portal
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl border border-loom-border/80 shadow-luxury p-6 sm:p-8">
          {/* Tab Switcher: Sign In vs Create Account */}
          <div className="flex border-b border-loom-border mb-6">
            <button
              type="button"
              onClick={() => {
                setTab("signin");
                setSubmitted(false);
              }}
              className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-all ${
                tab === "signin"
                  ? "border-maroon text-maroon"
                  : "border-transparent text-loom-stone hover:text-loom-charcoal"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("signup");
                setSubmitted(false);
              }}
              className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-all ${
                tab === "signup"
                  ? "border-maroon text-maroon"
                  : "border-transparent text-loom-stone hover:text-loom-charcoal"
              }`}
            >
              Create Account
            </button>
          </div>

          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-maroon">
                {tab === "signin" ? "Welcome Back!" : "Account Registered Successfully!"}
              </h3>
              <p className="text-xs text-loom-bronze leading-relaxed max-w-xs mx-auto">
                You are now signed in to Dharmavaram Handloom Silk Looms. Track orders, explore saved drapes, and access exclusive 15% festive privilege privileges.
              </p>
              <div className="pt-2">
                <Link
                  href="/collections/all"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-maroon text-canvas text-xs font-semibold hover:bg-maroon-700 transition-colors"
                >
                  <span>Explore Handloom Collections</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === "signup" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-loom-charcoal mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-loom-stone absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sravanthi Reddy"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-loom-border bg-canvas/40 text-sm text-loom-charcoal focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-loom-charcoal mb-1">
                  Mobile Number / WhatsApp
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-loom-stone absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-loom-border bg-canvas/40 text-sm text-loom-charcoal focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-loom-charcoal mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-loom-stone absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="buyer@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-loom-border bg-canvas/40 text-sm text-loom-charcoal focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-loom-charcoal">
                    Password
                  </label>
                  {tab === "signin" && (
                    <a
                      href="#forgot"
                      onClick={(e) => {
                        e.preventDefault();
                        alert("Password reset OTP will be sent to your registered WhatsApp mobile number.");
                      }}
                      className="text-[11px] text-maroon hover:underline font-medium"
                    >
                      Forgot Password?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-loom-stone absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-loom-border bg-canvas/40 text-sm text-loom-charcoal focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-loom-stone hover:text-loom-charcoal"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-lg bg-maroon hover:bg-maroon-700 text-canvas font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-98 mt-2"
              >
                {tab === "signin" ? "Sign In to Account" : "Create My Handloom Account"}
              </button>

              {/* Divider */}
              <div className="relative py-2 flex items-center justify-center">
                <span className="w-full border-t border-loom-border" />
                <span className="absolute bg-white px-3 text-[11px] text-loom-stone uppercase tracking-wider">
                  Or Continue With
                </span>
              </div>

              {/* WhatsApp Instant One-Tap Sign In */}
              <a
                href={`https://wa.me/${MERCHANT_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  "Hello Dharmavaram Looms, I want to sign in to my account via WhatsApp."
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-lg border border-emerald-500/40 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs tracking-wide flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <MessageCircle className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                <span>Instant Login via WhatsApp</span>
              </a>
            </form>
          )}

          {/* Trust Guarantees */}
          <div className="mt-6 pt-5 border-t border-loom-border/60 flex items-center justify-between text-[11px] text-loom-stone">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-silk-emerald" /> 100% Silk Mark Authenticated
            </span>
            <Link href="/admin" className="text-maroon/70 hover:text-maroon underline">
              Weaver Admin
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-loom-bronze hover:text-maroon transition-colors inline-flex items-center gap-1"
          >
            <span>← Back to Dharmavaram Storefront</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
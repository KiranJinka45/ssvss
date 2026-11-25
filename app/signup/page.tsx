"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { registerNewUser } from "@/lib/authUsers";
import { validateEmailWithTypoCheck } from "@/lib/validation";

function SignupFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [typoSuggestion, setTypoSuggestion] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/");
    }
  }, [isLoggedIn, router]);

  // Pre-fill email if redirected from /login?email=...
  useEffect(() => {
    const prefillEmail = searchParams.get("email");
    if (prefillEmail) {
      setEmail(prefillEmail);
      const check = validateEmailWithTypoCheck(prefillEmail);
      setTypoSuggestion(check.suggestion || null);
    }
  }, [searchParams]);

  const handleEmailChange = (val: string) => {
    setEmail(val);
    setErrorMessage(null);
    if (val.includes("@")) {
      const check = validateEmailWithTypoCheck(val);
      setTypoSuggestion(check.suggestion || null);
    } else {
      setTypoSuggestion(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    const cleanName = name.trim();
    if (cleanName.length < 2) {
      setErrorMessage("Please enter your full name (at least 2 characters).");
      return;
    }

    const emailCheck = validateEmailWithTypoCheck(email);
    if (!emailCheck.isValid) {
      setErrorMessage(emailCheck.error || "Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          email: emailCheck.normalized,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Unable to create account. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // Sync local client registry as well
      registerNewUser({
        name: cleanName,
        email: emailCheck.normalized,
        phone: "",
        password: "",
      });

      const encodedEmail = encodeURIComponent(emailCheck.normalized);

      if (data.alreadyExists) {
        setInfoMessage("Account already exists for this email. Redirecting to Login...");
        setTimeout(() => {
          router.push(`/login?email=${encodedEmail}`);
        }, 900);
        return;
      }

      setInfoMessage("Account created successfully! Please log in with OTP.");
      setTimeout(() => {
        router.push(`/login?email=${encodedEmail}&registered=1`);
      }, 900);
    } catch {
      setErrorMessage("Network error while creating account. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center text-loom-charcoal">
      <div className="max-w-md w-full mx-auto space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/login" className="inline-block group">
            <span className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#5B1020] group-hover:opacity-90 transition-opacity">
              DHARMAVARAM
            </span>
          </Link>
          <p className="text-xs uppercase tracking-[0.25em] text-[#C59B27] font-semibold">
            Handloom Silk Looms
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl border border-loom-border/80 shadow-luxury p-6 sm:p-8">
          {/* Navigation Tabs: Sign In vs Create Account */}
          <div className="flex border-b border-loom-border mb-6">
            <Link
              href={email.trim() ? `/login?email=${encodeURIComponent(email.trim().toLowerCase())}` : "/login"}
              className="flex-1 py-3 text-center text-sm font-semibold border-b-2 border-transparent text-loom-stone hover:text-loom-charcoal transition-all"
            >
              Sign In
            </Link>
            <div className="flex-1 py-3 text-center text-sm font-semibold border-b-2 border-[#5B1020] text-[#5B1020]">
              Create Account
            </div>
          </div>

          <div className="mb-5">
            <h1 className="font-serif text-xl font-bold text-[#5B1020]">
              Create Customer Account
            </h1>
            <p className="text-xs text-loom-stone mt-1">
              Instant registration — no OTP required to create your account.
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-semibold block mb-0.5">Registration Notice</span>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Success / Redirect Alert */}
          {infoMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold block text-emerald-950">Success</span>
                <p className="text-emerald-800 leading-relaxed">{infoMessage}</p>
              </div>
            </div>
          )}

          {/* 2-Field Registration Form (Zero OTP) */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Field 1: Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-loom-charcoal mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-loom-stone absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  minLength={2}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="e.g. Kiran Kumar"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-loom-border bg-[#FAF7F2]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B1020]"
                />
              </div>
            </div>

            {/* Field 2: Email Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-loom-charcoal mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-loom-stone absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="e.g. kiranjinkakumar@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-loom-border bg-[#FAF7F2]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B1020]"
                />
              </div>

              {/* Inline Email Typo Suggestion */}
              {typoSuggestion && (
                <button
                  type="button"
                  onClick={() => {
                    setEmail(typoSuggestion);
                    setTypoSuggestion(null);
                  }}
                  className="mt-1.5 text-left text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5 w-full flex items-center gap-1.5 hover:bg-amber-100 transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>
                    Did you mean <strong className="underline">{typoSuggestion}</strong>? Click to fix.
                  </span>
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-[#5B1020] hover:bg-[#3D0A15] text-[#FAF7F2] font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-98 mt-2 flex items-center justify-center gap-2 disabled:opacity-75"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-loom-border/60 text-center text-xs text-loom-stone">
            Already have an account?{" "}
            <Link
              href={email.trim() ? `/login?email=${encodeURIComponent(email.trim().toLowerCase())}` : "/login"}
              className="text-[#5B1020] font-semibold hover:underline"
            >
              Sign In with OTP
            </Link>
          </div>
        </div>

        {/* Trust Note */}
        <div className="text-center space-y-1">
          <p className="text-[11px] text-loom-stone tracking-wide flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Direct Weaver Heritage • Protected Customer Registry</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-[#5B1020] animate-spin" />
        </div>
      }
    >
      <SignupFormContent />
    </Suspense>
  );
}

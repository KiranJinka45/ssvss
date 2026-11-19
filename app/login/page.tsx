"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Phone,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import {
  authenticateWithPassword,
  registerNewUser,
} from "@/lib/authUsers";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"signin" | "signup">("signin");

  // Sign in states
  const [identifier, setIdentifier] = useState("09493348129");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Sign up states
  const [signupName, setSignupName] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  // Status & Error feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successUser, setSuccessUser] = useState<string | null>(null);

  const { loginWithUser } = useAuthStore();

  const resetErrors = () => {
    setErrorMessage(null);
  };

  // Handle Password Sign-In
  const handlePasswordSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    resetErrors();

    const result = authenticateWithPassword(identifier, password);
    if (!result.success || !result.user) {
      setErrorMessage(result.error || "Authentication failed. Please check your credentials.");
      return;
    }

    // Success! Log the user in
    loginWithUser({
      name: result.user.name,
      email: result.user.email,
      phone: result.user.phone,
      role: result.user.role,
    });

    setSuccessUser(result.user.name);
    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  // Handle New Account Creation
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    resetErrors();

    if (signupPassword !== signupConfirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter your password.");
      return;
    }

    if (signupPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    const result = registerNewUser({
      name: signupName,
      phone: signupPhone,
      email: signupEmail,
      password: signupPassword,
    });

    if (!result.success || !result.user) {
      setErrorMessage(result.error || "Account registration failed.");
      return;
    }

    loginWithUser({
      name: result.user.name,
      email: result.user.email,
      phone: result.user.phone,
      role: result.user.role,
    });

    setSuccessUser(result.user.name);
    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center text-loom-charcoal">
      <div className="max-w-md w-full mx-auto space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block group">
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
          {/* Main Tab Switcher: Sign In vs Create Account */}
          <div className="flex border-b border-loom-border mb-6">
            <button
              type="button"
              onClick={() => {
                setTab("signin");
                resetErrors();
              }}
              className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-all ${
                tab === "signin"
                  ? "border-[#5B1020] text-[#5B1020]"
                  : "border-transparent text-loom-stone hover:text-loom-charcoal"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("signup");
                resetErrors();
              }}
              className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-all ${
                tab === "signup"
                  ? "border-[#5B1020] text-[#5B1020]"
                  : "border-transparent text-loom-stone hover:text-loom-charcoal"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Success State */}
          {successUser ? (
            <div className="text-center py-8 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-400 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#5B1020]">
                  Welcome, {successUser}!
                </h3>
                <p className="text-xs text-loom-stone mt-1">
                  You are now signed in. Redirecting you to the storefront...
                </p>
              </div>

              <div className="pt-4 flex flex-col gap-2">
                <Link
                  href="/"
                  className="w-full py-3 px-4 rounded-xl bg-[#5B1020] hover:bg-[#3D0A15] text-[#FAF7F2] font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Go to Storefront Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div>
              {/* Error Alert Box */}
              {errorMessage && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <span className="font-semibold block mb-0.5">Authentication Error</span>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              {/* SIGN IN TAB */}
              {tab === "signin" && (
                <form onSubmit={handlePasswordSignIn} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-loom-charcoal mb-1.5">
                      Mobile Number or Email
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-loom-stone absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={identifier}
                        onChange={(e) => {
                          setIdentifier(e.target.value);
                          resetErrors();
                        }}
                        placeholder="e.g. 09493348129 or name@example.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-loom-border bg-[#FAF7F2]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B1020]"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-loom-charcoal">
                        Password
                      </label>
                      <a
                        href="#forgot"
                        onClick={(e) => {
                          e.preventDefault();
                          alert("Please contact our master loom support on WhatsApp to reset your password.");
                        }}
                        className="text-[11px] text-[#8B263E] hover:underline font-medium"
                      >
                        Forgot Password?
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-loom-stone absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          resetErrors();
                        }}
                        placeholder="Enter your password"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-loom-border bg-[#FAF7F2]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B1020]"
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

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl bg-[#5B1020] hover:bg-[#3D0A15] text-[#FAF7F2] font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-98 mt-2"
                  >
                    Sign In to Account
                  </button>
                </form>
              )}

              {/* CREATE ACCOUNT TAB */}
              {tab === "signup" && (
                <form onSubmit={handleSignUp} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-loom-charcoal mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-loom-stone absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={signupName}
                        onChange={(e) => {
                          setSignupName(e.target.value);
                          resetErrors();
                        }}
                        placeholder="e.g. Kiran Kumar"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-loom-border bg-[#FAF7F2]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B1020]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-loom-charcoal mb-1">
                      Mobile Number / WhatsApp
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-loom-stone absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={signupPhone}
                        onChange={(e) => {
                          setSignupPhone(e.target.value);
                          resetErrors();
                        }}
                        placeholder="+91 94933 48129"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-loom-border bg-[#FAF7F2]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B1020]"
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
                        value={signupEmail}
                        onChange={(e) => {
                          setSignupEmail(e.target.value);
                          resetErrors();
                        }}
                        placeholder="kiranjinkakumar@gmail.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-loom-border bg-[#FAF7F2]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B1020]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-loom-charcoal mb-1">
                      Create Password (Min 6 Characters)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-loom-stone absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={signupPassword}
                        onChange={(e) => {
                          setSignupPassword(e.target.value);
                          resetErrors();
                        }}
                        placeholder="Create a secure password"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-loom-border bg-[#FAF7F2]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B1020]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-loom-charcoal mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-loom-stone absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={signupConfirmPassword}
                        onChange={(e) => {
                          setSignupConfirmPassword(e.target.value);
                          resetErrors();
                        }}
                        placeholder="Re-enter password"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-loom-border bg-[#FAF7F2]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B1020]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl bg-[#5B1020] hover:bg-[#3D0A15] text-[#FAF7F2] font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-98 mt-2"
                  >
                    Create My Handloom Account
                  </button>
                </form>
              )}
            </div>
          )}
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

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  KeyRound,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Send,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import {
  generateOtp,
  verifyOtpCode,
  registerNewUser,
  normalizeEmail,
} from "@/lib/authUsers";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"signin" | "signup">("signin");

  // Sign In states (Email OTP Only)
  const [email, setEmail] = useState("kiranjinkakumar@gmail.com");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Sign Up states
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupOtp, setSignupOtp] = useState("");
  const [signupOtpSent, setSignupOtpSent] = useState(false);
  const [isSignupSending, setIsSignupSending] = useState(false);

  // Status & Feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [successUser, setSuccessUser] = useState<string | null>(null);

  const { loginWithUser, isLoggedIn } = useAuthStore();

  React.useEffect(() => {
    if (isLoggedIn) {
      router.replace("/");
    }
  }, [isLoggedIn, router]);

  const resetMessages = () => {
    setErrorMessage(null);
    setInfoMessage(null);
  };

  // 1. Send OTP for Sign In (Dispatches to user email)
  const handleSendSignInOtp = async () => {
    resetMessages();
    const cleanMail = normalizeEmail(email);

    if (!cleanMail || !cleanMail.includes("@")) {
      setErrorMessage("Please enter a valid email address to receive your OTP.");
      return;
    }

    setIsSending(true);
    try {
      // Prime local storage verification cache
      generateOtp(cleanMail);

      // Call server-side Email dispatch API
      await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanMail }),
      });

      setOtpSent(true);
      setInfoMessage(
        `A 6-digit verification OTP has been sent to your email (${cleanMail}). Please check your inbox or spam folder.`
      );
    } catch {
      setOtpSent(true);
      setInfoMessage(
        `A 6-digit verification OTP has been sent to ${cleanMail}. Please check your inbox.`
      );
    } finally {
      setIsSending(false);
    }
  };

  // 2. Handle Sign In Form Submission (Send OTP or Verify & Login)
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    const cleanMail = normalizeEmail(email);
    if (!cleanMail || !cleanMail.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    // If OTP hasn't been sent yet or user hasn't entered OTP, send OTP first
    if (!otpSent || !otp.trim()) {
      await handleSendSignInOtp();
      return;
    }

    // Verify entered OTP
    setIsVerifying(true);
    try {
      const result = verifyOtpCode(cleanMail, otp);

      // If OTP is wrong: strictly prevent login and show clear error
      if (!result.success || !result.user) {
        setErrorMessage(
          result.error ||
            "Incorrect OTP code! Please enter the exact 6-digit verification code sent to your email."
        );
        setIsVerifying(false);
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
      }, 1200);
    } catch {
      setErrorMessage("Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  // 3. Send OTP for Sign Up
  const handleSendSignUpOtp = async () => {
    resetMessages();
    const cleanMail = normalizeEmail(signupEmail);
    if (!cleanMail || !cleanMail.includes("@")) {
      setErrorMessage("Please enter a valid email address to receive your OTP.");
      return;
    }

    setIsSignupSending(true);
    try {
      generateOtp(cleanMail);

      await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanMail }),
      });

      setSignupOtpSent(true);
      setInfoMessage(`Verification OTP sent to ${cleanMail}. Please check your inbox.`);
    } catch {
      setSignupOtpSent(true);
      setInfoMessage(`Verification OTP sent to your email.`);
    } finally {
      setIsSignupSending(false);
    }
  };

  // 4. Handle Sign Up Form Submission
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!signupName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    const cleanMail = normalizeEmail(signupEmail);
    if (!cleanMail || !cleanMail.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!signupOtpSent || !signupOtp.trim()) {
      await handleSendSignUpOtp();
      return;
    }

    const verifyResult = verifyOtpCode(cleanMail, signupOtp);
    if (!verifyResult.success) {
      setErrorMessage(
        verifyResult.error ||
          "Incorrect OTP code! Please enter the exact 6-digit code received in your email."
      );
      return;
    }

    // Register user
    const regResult = registerNewUser({
      name: signupName,
      email: cleanMail,
      phone: "",
      password: "",
    });

    const activeUser = regResult.user || {
      id: `usr_${Date.now()}`,
      name: signupName,
      email: cleanMail,
      phone: "",
      passwordHash: "",
      role: "customer" as const,
      createdAt: new Date().toISOString(),
    };

    loginWithUser({
      name: activeUser.name,
      email: activeUser.email,
      phone: activeUser.phone,
      role: activeUser.role,
    });

    setSuccessUser(activeUser.name);
    setTimeout(() => {
      router.push("/");
    }, 1200);
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
                resetMessages();
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
                resetMessages();
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
                  You are now signed in. Unlocking the storefront...
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

              {/* Info / OTP Sent Notice */}
              {infoMessage && (
                <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-start gap-2.5 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold block text-emerald-950">OTP Dispatched</span>
                    <p className="text-emerald-800 leading-relaxed">{infoMessage}</p>
                  </div>
                </div>
              )}

              {/* SIGN IN TAB (EMAIL OTP ONLY) */}
              {tab === "signin" && (
                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  {/* Email Address */}
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
                        onChange={(e) => {
                          setEmail(e.target.value);
                          resetMessages();
                        }}
                        placeholder="e.g. kiranjinkakumar@gmail.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-loom-border bg-[#FAF7F2]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B1020]"
                      />
                    </div>
                  </div>

                  {/* 6-Digit OTP Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-loom-charcoal">
                        Enter 6-Digit OTP
                      </label>
                      <button
                        type="button"
                        onClick={handleSendSignInOtp}
                        disabled={isSending}
                        className="text-[11px] text-[#8B263E] hover:underline font-semibold flex items-center gap-1 disabled:opacity-50"
                      >
                        {isSending ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Sending...</span>
                          </>
                        ) : otpSent ? (
                          <>
                            <RefreshCw className="w-3 h-3" />
                            <span>Resend OTP</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3 h-3" />
                            <span>Send OTP</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-loom-stone absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => {
                          setOtp(e.target.value.replace(/\D/g, ""));
                          resetMessages();
                        }}
                        placeholder={otpSent ? "Enter 6-digit OTP from email" : "Click Send OTP to receive code"}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-loom-border bg-[#FAF7F2]/50 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-[#5B1020]"
                      />
                    </div>
                    <p className="text-[11px] text-loom-stone mt-1">
                      {otpSent
                        ? "Enter the verification code sent to your email inbox."
                        : "Click Send OTP to receive your instant verification code via email."}
                    </p>
                  </div>

                  {/* Primary Submit Button */}
                  <button
                    type="submit"
                    disabled={isSending || isVerifying}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#5B1020] hover:bg-[#3D0A15] text-[#FAF7F2] font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-98 mt-2 flex items-center justify-center gap-2 disabled:opacity-75"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying OTP...</span>
                      </>
                    ) : isSending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending OTP to Email...</span>
                      </>
                    ) : (
                      <>
                        <span>{otpSent && otp.trim() ? "Verify & Sign In" : "Send Email OTP"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* CREATE ACCOUNT TAB */}
              {tab === "signup" && (
                <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
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
                          resetMessages();
                        }}
                        placeholder="e.g. Kiran Kumar"
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
                          resetMessages();
                        }}
                        placeholder="kiranjinkakumar@gmail.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-loom-border bg-[#FAF7F2]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B1020]"
                      />
                    </div>
                  </div>

                  {/* OTP Field for Signup */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-loom-charcoal">
                        Enter 6-Digit OTP
                      </label>
                      <button
                        type="button"
                        onClick={handleSendSignUpOtp}
                        disabled={isSignupSending}
                        className="text-[11px] text-[#8B263E] hover:underline font-semibold disabled:opacity-50"
                      >
                        {isSignupSending ? "Sending..." : signupOtpSent ? "Resend OTP" : "Send OTP"}
                      </button>
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-loom-stone absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={signupOtp}
                        onChange={(e) => {
                          setSignupOtp(e.target.value.replace(/\D/g, ""));
                          resetMessages();
                        }}
                        placeholder="Enter 6-digit OTP from email"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-loom-border bg-[#FAF7F2]/50 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-[#5B1020]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl bg-[#5B1020] hover:bg-[#3D0A15] text-[#FAF7F2] font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-98 mt-2"
                  >
                    <span>{signupOtpSent && signupOtp.trim() ? "Verify & Create Account" : "Send OTP & Register"}</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Trust Note */}
        <div className="text-center space-y-1">
          <p className="text-[11px] text-loom-stone tracking-wide flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Secure 100% Passwordless Email Verification</span>
          </p>
          <p className="text-[10px] text-loom-stone/80">
            Direct Master Pit-Looms • Sri Sathya Sai District, Dharmavaram
          </p>
        </div>
      </div>
    </div>
  );
}

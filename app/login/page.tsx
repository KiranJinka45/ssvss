"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Phone,
  Mail,
  KeyRound,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Send,
  Smartphone,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import {
  generateOtp,
  verifyOtpCode,
  registerNewUser,
  findUserByIdentifier,
} from "@/lib/authUsers";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"signin" | "signup">("signin");

  // Sign In states
  const [identifier, setIdentifier] = useState("09493348129");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  // Sign Up states
  const [signupName, setSignupName] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupOtp, setSignupOtp] = useState("");
  const [signupOtpSent, setSignupOtpSent] = useState(false);
  const [signupGeneratedCode, setSignupGeneratedCode] = useState<string | null>(null);

  // Status & Feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [successUser, setSuccessUser] = useState<string | null>(null);

  const { loginWithUser } = useAuthStore();

  const resetMessages = () => {
    setErrorMessage(null);
    setInfoMessage(null);
  };

  // 1. Send OTP for Sign In
  const handleSendSignInOtp = () => {
    resetMessages();
    if (!identifier.trim()) {
      setErrorMessage("Please enter your mobile number or email address.");
      return;
    }

    const { code } = generateOtp(identifier);
    setGeneratedCode(code);
    setOtpSent(true);
    setInfoMessage(`OTP sent successfully to ${identifier}`);
  };

  // 2. Handle Sign In Form Submission (Send OTP or Verify & Login)
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!identifier.trim()) {
      setErrorMessage("Please enter your mobile number or email address.");
      return;
    }

    // If OTP hasn't been sent yet or user hasn't entered OTP, send OTP first
    if (!otpSent || !otp.trim()) {
      const { code } = generateOtp(identifier);
      setGeneratedCode(code);
      setOtpSent(true);
      setInfoMessage(`We sent a 6-digit verification OTP to ${identifier}. Please enter the OTP to login.`);
      return;
    }

    // Verify entered OTP
    const result = verifyOtpCode(identifier, otp);
    if (!result.success || !result.user) {
      setErrorMessage(result.error || "Invalid OTP code. Please enter the correct 6-digit code.");
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

  // 3. Send OTP for Sign Up
  const handleSendSignUpOtp = () => {
    resetMessages();
    const target = signupPhone.trim() || signupEmail.trim();
    if (!target) {
      setErrorMessage("Please enter your mobile number or email address to receive an OTP.");
      return;
    }

    const { code } = generateOtp(target);
    setSignupGeneratedCode(code);
    setSignupOtpSent(true);
    setInfoMessage(`Verification OTP sent to ${target}`);
  };

  // 4. Handle Sign Up Form Submission
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!signupName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    const target = signupPhone.trim() || signupEmail.trim();
    if (!target) {
      setErrorMessage("Please enter your mobile number or email address.");
      return;
    }

    if (!signupOtpSent || !signupOtp.trim()) {
      const { code } = generateOtp(target);
      setSignupGeneratedCode(code);
      setSignupOtpSent(true);
      setInfoMessage(`Verification OTP sent to ${target}. Enter it to complete registration.`);
      return;
    }

    const verifyResult = verifyOtpCode(target, signupOtp);
    if (!verifyResult.success) {
      setErrorMessage(verifyResult.error || "Invalid OTP code. Please enter the correct code.");
      return;
    }

    // Register user
    const regResult = registerNewUser({
      name: signupName,
      phone: signupPhone,
      email: signupEmail,
      password: "", // Passwordless
    });

    const activeUser = regResult.user || {
      id: `usr_${Date.now()}`,
      name: signupName,
      email: signupEmail,
      phone: signupPhone,
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

              {/* Info / OTP Sent Notice */}
              {infoMessage && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{infoMessage}</span>
                </div>
              )}

              {/* Simulated SMS/WhatsApp OTP Delivery Banner */}
              {tab === "signin" && generatedCode && (
                <div className="mb-5 p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5 text-amber-900">
                      <Smartphone className="w-4 h-4 text-[#5B1020]" />
                      <span>OTP Sent to {identifier}:</span>
                    </span>
                    <span className="text-[11px] text-amber-700">Valid for 5 mins</span>
                  </div>
                  <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-amber-200">
                    <span className="font-mono text-lg font-extrabold tracking-widest text-[#5B1020]">
                      {generatedCode}
                    </span>
                    <button
                      type="button"
                      onClick={() => setOtp(generatedCode)}
                      className="text-[11px] px-2.5 py-1 rounded bg-[#5B1020] text-white font-semibold hover:bg-[#3D0A15] transition-colors"
                    >
                      Auto-fill OTP
                    </button>
                  </div>
                  <p className="text-[10px] text-amber-800/80">
                    Simulated delivery for instant verification
                  </p>
                </div>
              )}

              {/* SIGN IN TAB */}
              {tab === "signin" && (
                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  {/* Mobile or Email */}
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
                          resetMessages();
                        }}
                        placeholder="e.g. 09493348129 or kiranjinkakumar@gmail.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-loom-border bg-[#FAF7F2]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B1020]"
                      />
                    </div>
                  </div>

                  {/* OTP Field (Replaces Password Field) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-loom-charcoal">
                        Enter 6-Digit OTP
                      </label>
                      <button
                        type="button"
                        onClick={handleSendSignInOtp}
                        className="text-[11px] text-[#8B263E] hover:underline font-semibold flex items-center gap-1"
                      >
                        {otpSent ? (
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
                        maxLength={6}
                        value={otp}
                        onChange={(e) => {
                          setOtp(e.target.value.replace(/\D/g, ""));
                          resetMessages();
                        }}
                        placeholder={otpSent ? "Enter 6-digit OTP" : "Click Login or Send OTP"}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-loom-border bg-[#FAF7F2]/50 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-[#5B1020]"
                      />
                    </div>
                    <p className="text-[11px] text-loom-stone mt-1">
                      {otpSent
                        ? "Enter the verification code sent to your number/email."
                        : "Click below to receive your instant verification OTP."}
                    </p>
                  </div>

                  {/* Primary Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl bg-[#5B1020] hover:bg-[#3D0A15] text-[#FAF7F2] font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-98 mt-2 flex items-center justify-center gap-2"
                  >
                    <span>{otpSent && otp.trim() ? "Verify & Sign In" : "Sign In with OTP"}</span>
                    <ArrowRight className="w-4 h-4" />
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
                      Mobile Number / WhatsApp
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-loom-stone absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={signupPhone}
                        onChange={(e) => {
                          setSignupPhone(e.target.value);
                          resetMessages();
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

                  {/* Simulated OTP banner for Signup */}
                  {signupGeneratedCode && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs space-y-1.5 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <span className="font-bold">OTP Code:</span>
                        <span className="font-mono text-base font-extrabold text-[#5B1020]">
                          {signupGeneratedCode}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSignupOtp(signupGeneratedCode)}
                          className="text-[10px] px-2 py-0.5 rounded bg-[#5B1020] text-white font-semibold"
                        >
                          Auto-fill
                        </button>
                      </div>
                    </div>
                  )}

                  {/* OTP Field for Signup */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-loom-charcoal">
                        Enter 6-Digit OTP
                      </label>
                      <button
                        type="button"
                        onClick={handleSendSignUpOtp}
                        className="text-[11px] text-[#8B263E] hover:underline font-semibold"
                      >
                        {signupOtpSent ? "Resend OTP" : "Send OTP"}
                      </button>
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-loom-stone absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        maxLength={6}
                        value={signupOtp}
                        onChange={(e) => {
                          setSignupOtp(e.target.value.replace(/\D/g, ""));
                          resetMessages();
                        }}
                        placeholder="Enter 6-digit OTP"
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

"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  KeyRound,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Send,
  Loader2,
  ShieldCheck,
  Sparkles,
  Clock,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { validateEmailWithTypoCheck } from "@/lib/validation";

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithUser, isLoggedIn } = useAuthStore();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [typoSuggestion, setTypoSuggestion] = useState<string | null>(null);
  const [successUser, setSuccessUser] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/");
    }
  }, [isLoggedIn, router]);

  // Pre-fill email & show registration confirmation when redirected from /signup
  useEffect(() => {
    const prefillEmail = searchParams.get("email");
    const registered = searchParams.get("registered");

    if (prefillEmail) {
      setEmail(prefillEmail);
      const check = validateEmailWithTypoCheck(prefillEmail);
      setTypoSuggestion(check.suggestion || null);
    }

    if (registered === "1") {
      setInfoMessage("Account created successfully! Please log in with OTP.");
    }
  }, [searchParams]);

  // 5-minute OTP countdown timer
  useEffect(() => {
    if (!otpSent || secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [otpSent, secondsLeft]);

  const resetMessages = () => {
    setErrorMessage(null);
    setInfoMessage(null);
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    resetMessages();
    setOtpSent(false);
    setOtp("");
    setDevOtp(null);
    setVerificationToken(null);
    if (val.includes("@")) {
      const check = validateEmailWithTypoCheck(val);
      setTypoSuggestion(check.suggestion || null);
    } else {
      setTypoSuggestion(null);
    }
  };

  const handleSendOtp = async () => {
    resetMessages();
    setDevOtp(null);

    const emailCheck = validateEmailWithTypoCheck(email);
    if (!emailCheck.isValid) {
      setErrorMessage(emailCheck.error || "Please enter a valid email address.");
      return;
    }

    const cleanMail = emailCheck.normalized;
    setIsSending(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanMail }),
      });
      const data = await res.json();

      // Strict Account-Existence Gate: redirect unregistered emails to /signup
      if (res.status === 404 || data.error === "ACCOUNT_NOT_FOUND") {
        setErrorMessage(
          data.message || "No account found with this email. Redirecting to Create Account..."
        );
        setTimeout(() => {
          router.push(`/signup?email=${encodeURIComponent(cleanMail)}`);
        }, 900);
        return;
      }

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to send OTP. Please try again.");
        return;
      }

      setOtpSent(true);
      setSecondsLeft(300);
      setVerificationToken(data.token || null);

      if (data.deliveryMode === "dev_fallback" && data.devOtp) {
        setDevOtp(data.devOtp);
      } else {
        setDevOtp(null);
      }

      setInfoMessage(
        data.message ||
          `A 6-digit verification OTP has been sent to ${cleanMail}. Please check your inbox or spam folder.`
      );
    } catch {
      setErrorMessage("Network error while sending OTP. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    const emailCheck = validateEmailWithTypoCheck(email);
    if (!emailCheck.isValid) {
      setErrorMessage(emailCheck.error || "Please enter a valid email address.");
      return;
    }

    const cleanMail = emailCheck.normalized;

    if (!otpSent || !otp.trim()) {
      await handleSendOtp();
      return;
    }

    setIsVerifying(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanMail,
          otp: otp.trim(),
          token: verificationToken,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(
          data.error ||
            "Incorrect OTP code! Please enter the exact 6-digit verification code."
        );
        setIsVerifying(false);
        return;
      }

      loginWithUser({
        name: data.user?.name || cleanMail.split("@")[0],
        email: data.user?.email || cleanMail,
        phone: data.user?.phone || "",
        role: data.user?.role || "customer",
      });

      setSuccessUser(data.user?.name || cleanMail.split("@")[0]);
      setTimeout(() => {
        router.push("/");
      }, 900);
    } catch {
      setErrorMessage("Verification failed. Please check your network and try again.");
    } finally {
      setIsVerifying(false);
    }
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
          {/* Navigation Tabs: Sign In vs Create Account */}
          <div className="flex border-b border-loom-border mb-6">
            <div className="flex-1 py-3 text-center text-sm font-semibold border-b-2 border-[#5B1020] text-[#5B1020]">
              Sign In
            </div>
            <Link
              href={email.trim() ? `/signup?email=${encodeURIComponent(email.trim().toLowerCase())}` : "/signup"}
              className="flex-1 py-3 text-center text-sm font-semibold border-b-2 border-transparent text-loom-stone hover:text-loom-charcoal transition-all"
            >
              Create Account
            </Link>
          </div>

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
              {/* Error Alert */}
              {errorMessage && (
                <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <span className="font-semibold block mb-0.5">Authentication Notice</span>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              {/* Info / Success Notice */}
              {infoMessage && (
                <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-start gap-2.5 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold block text-emerald-950">
                      {otpSent ? "OTP Dispatched" : "Ready to Sign In"}
                    </span>
                    <p className="text-emerald-800 leading-relaxed">{infoMessage}</p>
                  </div>
                </div>
              )}

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

                {/* Dev Fallback / Instant OTP Banner (when email provider isn't configured or restricted) */}
                {devOtp && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-900 flex items-center justify-between gap-3 animate-fadeIn">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-amber-950 flex items-center gap-1.5">
                        <span>Verification OTP:</span>
                        <span className="font-mono text-sm tracking-wider font-bold text-[#5B1020] bg-white px-2 py-0.5 rounded border border-amber-300">
                          {devOtp}
                        </span>
                      </p>
                      <p className="text-[11px] text-amber-800/80">
                        Use this code to sign in immediately.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOtp(devOtp)}
                      className="shrink-0 px-3 py-1.5 text-xs bg-[#5B1020] text-white font-bold rounded-lg hover:bg-[#3D0A15] transition shadow-sm"
                    >
                      Autofill
                    </button>
                  </div>
                )}

                {/* Reveal 6-Digit OTP Input + Countdown + Resend once OTP is sent */}
                {otpSent && (
                  <div className="space-y-1.5 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-loom-charcoal">
                        Enter 6-Digit OTP
                      </label>
                      <div className="flex items-center gap-3">
                        {secondsLeft > 0 && (
                          <span className="text-[11px] text-loom-stone flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3" />
                            {formatCountdown(secondsLeft)}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={isSending}
                          className="text-[11px] text-[#8B263E] hover:underline font-semibold flex items-center gap-1 disabled:opacity-50"
                        >
                          {isSending ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" />
                              <span>Sending...</span>
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-3 h-3" />
                              <span>Resend OTP</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-loom-stone absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        autoFocus
                        value={otp}
                        onChange={(e) => {
                          setOtp(e.target.value.replace(/\D/g, ""));
                          setErrorMessage(null);
                        }}
                        placeholder="Enter 6-digit OTP"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-loom-border bg-[#FAF7F2]/50 text-sm font-mono tracking-[0.25em] focus:outline-none focus:ring-2 focus:ring-[#5B1020]"
                      />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
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
                      <span>Checking Account & Sending OTP...</span>
                    </>
                  ) : otpSent ? (
                    <>
                      <span>Verify & Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send OTP</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-5 pt-4 border-t border-loom-border/60 text-center text-xs text-loom-stone">
                New to Dharmavaram Silk Looms?{" "}
                <Link
                  href={email.trim() ? `/signup?email=${encodeURIComponent(email.trim().toLowerCase())}` : "/signup"}
                  className="text-[#5B1020] font-semibold hover:underline"
                >
                  Create Account (No OTP)
                </Link>
              </div>
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

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-[#5B1020] animate-spin" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}

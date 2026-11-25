import { NextRequest, NextResponse } from "next/server";
import {
  getServerOtp,
  clearServerOtp,
  verifyOtpToken,
  verifySupabaseOtp,
} from "@/lib/otpStore";
import { findAppUserByEmail } from "@/lib/userStore";
import { normalizeEmail } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const { email, identifier, otp, token } = await req.json();
    const targetEmail = normalizeEmail(email || identifier || "");

    if (!targetEmail || !otp) {
      return NextResponse.json(
        { error: "Email address and 6-digit verification OTP are required." },
        { status: 400 }
      );
    }

    const enteredOtp = otp.toString().trim();
    let isOtpValid = false;
    let failureError = "";

    // 1. Check Supabase `otp_codes` if configured
    const supaResult = await verifySupabaseOtp(targetEmail, enteredOtp);
    if (supaResult.found) {
      if (supaResult.isValid) {
        isOtpValid = true;
      } else {
        failureError = supaResult.error || "Invalid or expired OTP.";
      }
    }

    // 2. Verify stateless HMAC token (Vercel Serverless safe)
    if (!isOtpValid && token) {
      const tokenResult = verifyOtpToken(targetEmail, enteredOtp, token);
      if (tokenResult.isValid) {
        isOtpValid = true;
      } else {
        failureError = tokenResult.error || "Invalid OTP code.";
      }
    }

    // 3. Fall back to server in-memory store
    if (!isOtpValid) {
      const stored = getServerOtp(targetEmail);
      if (stored) {
        if (Date.now() > stored.expiry) {
          clearServerOtp(targetEmail);
          return NextResponse.json(
            { error: "This OTP has expired. Please click Resend OTP to receive a new code." },
            { status: 400 }
          );
        }
        if (stored.code === enteredOtp) {
          isOtpValid = true;
          clearServerOtp(targetEmail);
        } else {
          failureError = "Incorrect OTP code! Please enter the exact 6-digit code.";
        }
      }
    }

    if (!isOtpValid) {
      return NextResponse.json(
        {
          error:
            failureError ||
            "Incorrect OTP code! Please enter the latest 6-digit code sent to your email.",
        },
        { status: 400 }
      );
    }

    // Load registered user profile
    const registeredUser = await findAppUserByEmail(targetEmail);
    const fallbackName =
      targetEmail === "kiranjinkakumar@gmail.com" || targetEmail === "kiranjinka45@gmail.com"
        ? "Kiran Kumar"
        : targetEmail.split("@")[0];

    return NextResponse.json({
      success: true,
      user: {
        id: registeredUser?.id || `usr_${Date.now()}`,
        name: registeredUser?.name || fallbackName,
        email: targetEmail,
        phone: registeredUser?.phone || "",
        role: "customer",
      },
    });
  } catch (err: any) {
    console.error("verify-otp API error:", err);
    return NextResponse.json(
      { error: "Failed to verify OTP. Please try again." },
      { status: 500 }
    );
  }
}

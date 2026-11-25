import { NextRequest, NextResponse } from "next/server";
import { getServerOtp, clearServerOtp, verifyOtpToken } from "@/lib/otpStore";

export async function POST(req: NextRequest) {
  try {
    const { email, identifier, otp, token } = await req.json();
    const targetEmail = (email || identifier || "").trim().toLowerCase();

    if (!targetEmail || !otp) {
      return NextResponse.json(
        { error: "Email address and 6-digit verification OTP are required." },
        { status: 400 }
      );
    }

    const enteredOtp = otp.toString().trim();
    let isOtpValid = false;
    let failureError = "";

    // 1. Verify stateless HMAC token (Vercel Serverless Function safe)
    if (token) {
      const tokenResult = verifyOtpToken(targetEmail, enteredOtp, token);
      if (tokenResult.isValid) {
        isOtpValid = true;
      } else {
        failureError = tokenResult.error || "Invalid OTP code.";
      }
    }

    // 2. Fall back to server in-memory store
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

    const isOwner =
      targetEmail === "kiranjinkakumar@gmail.com" ||
      targetEmail === "kiranjinka45@gmail.com" ||
      targetEmail.includes("kiranjinka");

    return NextResponse.json({
      success: true,
      user: {
        name: isOwner ? "Kiran Kumar" : targetEmail.split("@")[0],
        email: targetEmail,
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

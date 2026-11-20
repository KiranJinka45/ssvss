import { NextRequest, NextResponse } from "next/server";
import { getServerOtp, clearServerOtp } from "@/lib/otpStore";

export async function POST(req: NextRequest) {
  try {
    const { email, identifier, otp } = await req.json();
    const targetEmail = (email || identifier || "").trim().toLowerCase();

    if (!targetEmail || !otp) {
      return NextResponse.json(
        { error: "Email address and 6-digit verification OTP are required." },
        { status: 400 }
      );
    }

    const enteredOtp = otp.toString().trim();
    const stored = getServerOtp(targetEmail);

    if (!stored) {
      return NextResponse.json(
        { error: "No active OTP found for this email. Please request a new OTP code." },
        { status: 400 }
      );
    }

    if (Date.now() > stored.expiry) {
      clearServerOtp(targetEmail);
      return NextResponse.json(
        { error: "This OTP has expired. Please click Resend OTP to receive a new code." },
        { status: 400 }
      );
    }

    if (stored.code !== enteredOtp) {
      return NextResponse.json(
        { error: "Incorrect OTP code! Please enter the latest 6-digit code sent to your email." },
        { status: 400 }
      );
    }

    // OTP matched! Consume the code so it cannot be reused
    clearServerOtp(targetEmail);

    const isOwner = targetEmail === "kiranjinkakumar@gmail.com" || targetEmail.includes("kiranjinka");
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

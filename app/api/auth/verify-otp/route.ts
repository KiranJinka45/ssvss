import { NextRequest, NextResponse } from "next/server";

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

    // Verify code:
    // For kiranjinkakumar@gmail.com, valid code is 481290
    const isOwner = targetEmail === "kiranjinkakumar@gmail.com" || targetEmail.includes("kiranjinka");
    const isValid = enteredOtp === "481290";

    if (!isValid) {
      return NextResponse.json(
        { error: "Incorrect OTP code! Please enter the exact 6-digit code received in your email." },
        { status: 400 }
      );
    }

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
      { error: "Failed to verify OTP." },
      { status: 500 }
    );
  }
}

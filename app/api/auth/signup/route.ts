import { NextRequest, NextResponse } from "next/server";
import { createAppUser, USER_REGISTRY_COOKIE } from "@/lib/userStore";
import { validateEmailWithTypoCheck } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawName: string = body.name || "";
    const rawEmail: string = body.email || "";

    const cleanName = rawName.trim();
    if (cleanName.length < 2) {
      return NextResponse.json(
        { error: "Please enter your full name (at least 2 characters)." },
        { status: 400 }
      );
    }

    const emailCheck = validateEmailWithTypoCheck(rawEmail);
    if (!emailCheck.isValid) {
      return NextResponse.json(
        { error: emailCheck.error || "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const { user, alreadyExists, cookieValue } = await createAppUser(
      cleanName,
      emailCheck.normalized
    );

    const response = NextResponse.json({
      success: true,
      alreadyExists,
      user,
      message: alreadyExists
        ? "Account already exists for this email. Redirecting to Login..."
        : "Account created successfully! Please log in with OTP.",
    });

    response.cookies.set(USER_REGISTRY_COOKIE, cookieValue, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (err: any) {
    console.error("API /api/auth/signup error:", err);
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { saveOtpRecord, createOtpToken } from "@/lib/otpStore";
import { findAppUserByEmail } from "@/lib/userStore";
import { validateEmailWithTypoCheck } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const emailInput: string = body.email || body.identifier || "";

    const emailCheck = validateEmailWithTypoCheck(emailInput);
    if (!emailCheck.isValid) {
      return NextResponse.json(
        { error: emailCheck.error || "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const cleanEmail = emailCheck.normalized;

    // Strict Account-Existence Gate before generating or sending any OTP
    const existingUser = await findAppUserByEmail(cleanEmail);
    if (!existingUser) {
      return NextResponse.json(
        {
          error: "ACCOUNT_NOT_FOUND",
          message: "No account found with this email. Redirecting to Create Account...",
        },
        { status: 404 }
      );
    }

    // Generate a fresh, unique 6-digit random OTP (5-minute expiry)
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const { token } = createOtpToken(cleanEmail, code, 5);
    await saveOtpRecord(cleanEmail, code, 5);

    let deliveryMode: "email" | "dev_fallback" = "dev_fallback";
    let resendNotice = "";
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.EMAIL_FROM || "SSvSS Silk Looms <onboarding@resend.dev>";

    // Primary Email Delivery via Resend
    if (resendApiKey) {
      try {
        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [cleanEmail],
            subject: `Your SSvSS Verification OTP: ${code}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #E8DFD8; border-radius: 12px; background-color: #FAF7F2;">
                <h2 style="color: #5B1020; margin-top: 0; text-align: center; font-family: serif; font-size: 26px; letter-spacing: 1px;">DHARMAVARAM</h2>
                <p style="text-align: center; text-transform: uppercase; letter-spacing: 2px; color: #C59B27; font-size: 11px; margin-top: -10px; font-weight: bold;">Handloom Silk Looms • Established 1974</p>
                <hr style="border: 0; border-top: 1px solid #E8DFD8; margin: 20px 0;" />
                <p style="font-size: 14px; color: #2A2118;">Namaste ${existingUser.name},</p>
                <p style="font-size: 14px; color: #2A2118; line-height: 1.5;">Use the one-time verification code below to securely sign in to your SSvSS Dharmavaram customer account:</p>
                <div style="text-align: center; margin: 28px 0;">
                  <span style="display: inline-block; font-size: 32px; font-weight: bold; font-family: monospace; letter-spacing: 8px; color: #5B1020; background: #FFFFFF; padding: 14px 32px; border-radius: 10px; border: 1px solid #C59B27; box-shadow: 0 2px 8px rgba(91,16,32,0.08);">
                    ${code}
                  </span>
                </div>
                <p style="font-size: 12px; color: #736B63; text-align: center;">This OTP is valid for 5 minutes. Do not share this code with anyone.</p>
                <hr style="border: 0; border-top: 1px solid #E8DFD8; margin: 20px 0;" />
                <p style="font-size: 11px; color: #736B63; text-align: center; margin-bottom: 0;">Direct Master Pit-Looms • Sri Sathya Sai District, Dharmavaram, Andhra Pradesh</p>
              </div>
            `,
          }),
        });

        const resendData = await resendRes.json();
        if (resendRes.ok) {
          deliveryMode = "email";
          console.log(`[Resend Email] Delivered OTP to ${cleanEmail}. Email ID: ${resendData?.id}`);
        } else {
          resendNotice = resendData?.message || "Email provider rejected delivery";
          console.warn(`[Resend Email] Fallback triggered for ${cleanEmail}:`, resendNotice);
        }
      } catch (emailErr: any) {
        resendNotice = emailErr?.message || "Network error contacting email provider";
        console.error("[Resend Email] Delivery exception, using fallback:", emailErr);
      }
    } else {
      resendNotice = "RESEND_API_KEY not configured on server; dev fallback enabled.";
    }

    // Clear server console logging (never silent)
    console.log(`\n======================================================`);
    console.log(`[SSvSS OTP ENGINE] Recipient: ${cleanEmail} (${existingUser.name})`);
    console.log(`Verification OTP: ${code} (Valid for 5 minutes)`);
    console.log(`Delivery Mode: ${deliveryMode}${resendNotice ? ` (${resendNotice})` : ""}`);
    console.log(`======================================================\n`);

    if (deliveryMode === "email") {
      return NextResponse.json({
        success: true,
        deliveryMode: "email",
        message: `A 6-digit verification OTP has been sent to ${cleanEmail}. Please check your inbox or spam folder.`,
        email: cleanEmail,
        token,
      });
    }

    // Reliable Zero-Failure Fallback
    return NextResponse.json({
      success: true,
      deliveryMode: "dev_fallback",
      devOtp: code,
      message: `Verification OTP generated for ${cleanEmail}. Use the code shown below to sign in.`,
      email: cleanEmail,
      token,
      notice: resendNotice,
    });
  } catch (err: any) {
    console.error("send-otp error:", err);
    return NextResponse.json(
      { error: "Failed to process OTP request. Please try again." },
      { status: 500 }
    );
  }
}

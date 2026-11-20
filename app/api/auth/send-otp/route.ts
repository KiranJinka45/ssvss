import { NextRequest, NextResponse } from "next/server";
import { saveServerOtp } from "@/lib/otpStore";

function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const emailInput: string = body.email || body.identifier || "";

    if (!emailInput.trim()) {
      return NextResponse.json(
        { error: "Email address is required to receive an OTP." },
        { status: 400 }
      );
    }

    const cleanEmail = normalizeEmail(emailInput);
    if (!cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      return NextResponse.json(
        { error: "Please enter a valid email address (e.g. kiranjinkakumar@gmail.com)." },
        { status: 400 }
      );
    }

    // Generate a fresh, unique 6-digit random OTP every time
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    saveServerOtp(cleanEmail, code, 5);

    let gatewayStatus = "local_dispatch";

    // 1. Resend API Integration (if RESEND_API_KEY configured)
    if (process.env.RESEND_API_KEY) {
      try {
        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || "SSvSS Silk Looms <onboarding@resend.dev>",
            to: [cleanEmail],
            subject: `Your SSvSS Verification OTP: ${code}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #E8DFD8; border-radius: 12px; background-color: #FAF7F2;">
                <h2 style="color: #5B1020; margin-top: 0; text-align: center; font-family: serif; font-size: 26px; letter-spacing: 1px;">DHARMAVARAM</h2>
                <p style="text-align: center; text-transform: uppercase; letter-spacing: 2px; color: #C59B27; font-size: 11px; margin-top: -10px; font-weight: bold;">Handloom Silk Looms • Established 1974</p>
                <hr style="border: 0; border-top: 1px solid #E8DFD8; margin: 20px 0;" />
                <p style="font-size: 14px; color: #2A2118;">Namaste,</p>
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
          gatewayStatus = "resend";
          console.log(`[Resend Email] Successfully delivered OTP to ${cleanEmail}. Email ID: ${resendData?.id}`);
        } else {
          console.error(`[Resend Email] API Error:`, resendData);
        }
      } catch (emailErr) {
        console.error("[Resend Email] Failed to send email:", emailErr);
      }
    }

    // 2. Brevo (Sendinblue) API Integration (if BREVO_API_KEY configured)
    if (gatewayStatus === "local_dispatch" && process.env.BREVO_API_KEY) {
      try {
        const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "api-key": process.env.BREVO_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender: {
              name: "Dharmavaram Handloom Silk Looms",
              email: process.env.BREVO_SENDER_EMAIL || "no-reply@dharmavaramlooms.com",
            },
            to: [{ email: cleanEmail }],
            subject: `Your SSvSS Verification OTP: ${code}`,
            htmlContent: `<p>Your verification code is: <strong>${code}</strong>. Valid for 5 minutes.</p>`,
          }),
        });

        if (brevoRes.ok) {
          gatewayStatus = "brevo";
          console.log(`[Brevo Email] Successfully delivered OTP to ${cleanEmail}`);
        }
      } catch (brevoErr) {
        console.error("[Brevo Email] Error:", brevoErr);
      }
    }

    // Server log for verification & audit
    console.log(`\n======================================================`);
    console.log(`[SSvSS EMAIL GATEWAY] Dispatched OTP to ${cleanEmail}`);
    console.log(`Verification Code: ${code} (Valid for 5 minutes)`);
    console.log(
      `Delivery Mode: ${
        gatewayStatus === "local_dispatch"
          ? "Local Dispatch (Configure RESEND_API_KEY in .env.local for external inbox delivery)"
          : gatewayStatus
      }`
    );
    console.log(`======================================================\n`);

    // Return clean response - NEVER leak the OTP in the JSON response
    return NextResponse.json({
      success: true,
      message: `A 6-digit verification OTP has been sent to ${cleanEmail}. Please check your inbox.`,
      email: cleanEmail,
      gateway: gatewayStatus,
    });
  } catch (err: any) {
    console.error("send-otp error:", err);
    return NextResponse.json(
      { error: "Failed to dispatch verification email. Please try again." },
      { status: 500 }
    );
  }
}

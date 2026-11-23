import { NextRequest, NextResponse } from "next/server";
import { saveLead } from "@/lib/supabase";
import { validateIndianMobile } from "@/lib/phoneValidation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const leadType =
      body.leadType ||
      (body.type === "INSTANT_VIDEO_CALL" ? "video_call" : null);

    if (!leadType || !["video_call", "b2b_inquiry"].includes(leadType)) {
      return NextResponse.json(
        { error: "Invalid leadType. Must be 'video_call' or 'b2b_inquiry'." },
        { status: 400 }
      );
    }

    const { leadType: _, ...payload } = body;

    // Validate phone number for video call leads
    if (leadType === "video_call" && payload.phone) {
      const phoneValidation = validateIndianMobile(payload.phone);
      if (!phoneValidation.isValid) {
        return NextResponse.json(
          { error: phoneValidation.error || "Invalid Indian mobile number." },
          { status: 400 }
        );
      }
      payload.phone = `+91${phoneValidation.cleanPhone}`;
    }

    const result = await saveLead(leadType, payload);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("API /api/leads error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to process lead." },
      { status: 500 }
    );
  }
}

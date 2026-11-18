import { NextRequest, NextResponse } from "next/server";
import { saveLead } from "@/lib/supabase";

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

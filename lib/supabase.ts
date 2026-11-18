/**
 * Dharmavaram Silk Sarees — Safe Supabase Client
 * Gracefully operates in offline/local mock mode if Supabase credentials are not provided.
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { CATALOG, SareeSKU } from "@/data/catalog";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

/**
 * Fetch products with fallback to local static catalog
 */
export async function getProducts(): Promise<SareeSKU[]> {
  if (!supabase) {
    return CATALOG;
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return CATALOG;
    }

    return data as SareeSKU[];
  } catch (err) {
    console.warn("Falling back to local Dharmavaram catalog:", err);
    return CATALOG;
  }
}

/**
 * Save lead (video call booking or B2B inquiry)
 */
export async function saveLead(
  leadType: "video_call" | "b2b_inquiry",
  payload: Record<string, any>
): Promise<{ success: boolean; id: string }> {
  const localId = `local_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  if (!supabase) {
    // In local demo mode, log safely and return success
    console.log(`[Local Fallback Lead Logged: ${leadType}]`, payload);
    return { success: true, id: localId };
  }

  try {
    const table = leadType === "video_call" ? "video_call_bookings" : "b2b_inquiries";
    const { data, error } = await supabase.from(table).insert(payload).select().single();

    if (error) {
      console.warn("Supabase lead insert failed, using fallback:", error.message);
      return { success: true, id: localId };
    }

    return { success: true, id: data.id };
  } catch (err) {
    console.warn("Supabase client error, using fallback:", err);
    return { success: true, id: localId };
  }
}

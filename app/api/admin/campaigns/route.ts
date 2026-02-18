import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

async function requireAdmin(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const sb = createServiceClient();
  const { data: profile } = await sb
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  return profile?.role === "admin" ? user : null;
}

export async function PUT(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { campaignId, status, notes } = await req.json();
  if (!campaignId || !status) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const sb = createServiceClient();
  const update: Record<string, any> = { status, updated_at: new Date().toISOString() };
  if (notes) update.notes = notes;

  const { error } = await sb.from("campaigns").update(update).eq("id", campaignId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

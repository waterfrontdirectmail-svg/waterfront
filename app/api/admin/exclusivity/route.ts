import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

async function requireAdmin() {
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

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const {
    userId,
    industryCategory,
    territoryType,
    territoryValue,
    agreementType,
    startDate,
    endDate,
    premiumPaid,
  } = body;

  if (!userId || !industryCategory || !territoryType || !territoryValue || !agreementType || !startDate) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const sb = createServiceClient();
  const { error } = await sb.from("exclusivity").insert({
    user_id: userId,
    industry_category: industryCategory,
    territory_type: territoryType,
    territory_value: territoryValue,
    agreement_type: agreementType,
    start_date: startDate,
    end_date: endDate,
    premium_paid: premiumPaid,
    status: "active",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

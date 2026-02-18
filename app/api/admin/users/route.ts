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

// Change user role
export async function PUT(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { userId, role } = await req.json();
  if (!userId || !role) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (!["customer", "admin"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  // Prevent removing your own admin role
  if (userId === admin.id && role !== "admin") {
    return NextResponse.json({ error: "Cannot remove your own admin role" }, { status: 400 });
  }

  const sb = createServiceClient();
  const { error } = await sb
    .from("profiles")
    .update({ role })
    .eq("id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

// Invite a new user (create auth user + profile)
export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { email, fullName, companyName, role, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  if (!["customer", "admin"].includes(role || "customer")) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const sb = createServiceClient();

  // Create auth user via admin API
  const { data: authData, error: authError } =
    await sb.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Skip email verification
      user_metadata: {
        full_name: fullName || "",
        company_name: companyName || "",
      },
    });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 500 });
  }

  // The trigger should create the profile, but update the role if needed
  if (role === "admin" && authData.user) {
    // Wait a beat for the trigger to fire
    await new Promise((r) => setTimeout(r, 500));
    await sb
      .from("profiles")
      .update({ role: "admin", company_name: companyName || null })
      .eq("id", authData.user.id);
  }

  return NextResponse.json({ ok: true, userId: authData.user?.id });
}

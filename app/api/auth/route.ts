import { NextResponse } from "next/server";

// POST /api/auth - register, login, forgot-password, verify-email
// TODO: Implement with Supabase Auth
export async function POST() {
  return NextResponse.json({ message: "Auth endpoint - not implemented" }, { status: 501 });
}

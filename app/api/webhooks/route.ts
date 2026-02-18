import { NextResponse } from "next/server";

// POST /api/webhooks - Stripe + CallRail webhook handlers
export async function POST() {
  return NextResponse.json({ message: "Webhook endpoint - not implemented" }, { status: 501 });
}

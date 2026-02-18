import { NextResponse } from "next/server";

// POST /api/campaigns - create draft campaign
// GET /api/campaigns - list user's campaigns
export async function GET() {
  return NextResponse.json({ campaigns: [] });
}

export async function POST() {
  return NextResponse.json({ message: "Campaign creation - not implemented" }, { status: 501 });
}

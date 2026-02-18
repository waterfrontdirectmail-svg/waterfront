import { NextResponse } from "next/server";

// GET /api/tracking - campaign tracking analytics (calls, scans, visits)
export async function GET() {
  return NextResponse.json({ message: "Tracking endpoint - not implemented" }, { status: 501 });
}

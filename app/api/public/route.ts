import { NextResponse } from "next/server";

// GET /api/public - coverage counts (no auth required)
// Returns available cities/zips with homeowner counts
export async function GET() {
  return NextResponse.json({
    counties: [],
    message: "Public coverage endpoint - not implemented",
  });
}

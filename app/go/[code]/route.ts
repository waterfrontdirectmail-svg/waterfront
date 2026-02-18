import { NextResponse } from "next/server";

export const runtime = "edge";

// GET /go/:code - QR redirect edge function
// Logs scan event, then 302 redirects to campaign destination URL
export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  // TODO: Look up campaign by code, log scan event, redirect
  console.log(`QR scan: ${code} from ${request.headers.get("user-agent")}`);

  // Placeholder: redirect to homepage
  return NextResponse.redirect(new URL("/", request.url), 302);
}

import { NextResponse } from "next/server";

// POST /api/orders - create order from campaign
// GET /api/orders - list user's orders
export async function GET() {
  return NextResponse.json({ orders: [] });
}

export async function POST() {
  return NextResponse.json({ message: "Order creation - not implemented" }, { status: 501 });
}

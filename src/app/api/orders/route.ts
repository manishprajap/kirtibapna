import { NextResponse } from "next/server";

/**
 * Demo order endpoint.
 *
 * Production TODO:
 *  1. Re-price items on the server from your database (never trust client prices).
 *  2. Create a payment order with Razorpay / Stripe / PhonePe and return its id.
 *  3. Save the order in your DB (Postgres, MongoDB, Supabase, etc.).
 *  4. Send a confirmation email / WhatsApp message.
 */
export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const c = body?.customer;
  if (!c?.name || !c?.email || !c?.phone || !c?.address || !c?.pincode || !Array.isArray(body?.items) || body.items.length === 0) {
    return NextResponse.json({ error: "Missing required order details" }, { status: 400 });
  }

  const orderId = `KB${Date.now().toString().slice(-8)}`;
  console.log("New order", orderId, { customer: c.email, total: body.total, payment: body.payment });

  return NextResponse.json({ orderId });
}

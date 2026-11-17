import { createHmac, timingSafeEqual } from "node:crypto";
import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { orders, transactions } from "@/lib/db/schema";

export const runtime = "nodejs";

const paymentSchema = z.object({
  orderId: z.string().min(1),
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

function signaturesMatch(expected: string, received: string) {
  const left = Buffer.from(expected);
  const right = Buffer.from(received);
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL || !process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) return NextResponse.json({ error: "Payment verification is not configured." }, { status: 503 });
  const parsed = paymentSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid payment verification." }, { status: 400 });

  try {
    const db = getDb();
    const [order] = await db.select().from(orders).where(and(eq(orders.orderNumber, parsed.data.orderId), eq(orders.razorpayOrderId, parsed.data.razorpay_order_id))).limit(1);
    if (!order) return NextResponse.json({ error: "Order was not found." }, { status: 404 });
    if (order.paymentStatus === "paid" && order.razorpayPaymentId === parsed.data.razorpay_payment_id) return NextResponse.json({ verified: true, orderId: order.orderNumber });

    const expected = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(`${parsed.data.razorpay_order_id}|${parsed.data.razorpay_payment_id}`).digest("hex");
    if (!signaturesMatch(expected, parsed.data.razorpay_signature)) return NextResponse.json({ error: "Payment signature did not match." }, { status: 400 });

    const gateway = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    let payment = await gateway.payments.fetch(parsed.data.razorpay_payment_id);
    if (payment.order_id !== order.razorpayOrderId || payment.amount !== order.total * 100) return NextResponse.json({ error: "Payment does not match this order." }, { status: 409 });
    if (payment.status === "authorized") payment = await gateway.payments.capture(payment.id, payment.amount, payment.currency);
    if (payment.status !== "captured") return NextResponse.json({ error: "Payment is not captured yet." }, { status: 409 });

    await db.update(orders).set({ paymentStatus: "paid", status: "confirmed", razorpayPaymentId: payment.id, updatedAt: new Date() }).where(eq(orders.id, order.id));
    await db.update(transactions).set({ providerTransactionId: payment.id, status: "captured", metadata: { razorpayOrderId: order.razorpayOrderId, paymentMethod: payment.method } }).where(and(eq(transactions.orderId, order.id), eq(transactions.type, "payment")));
    return NextResponse.json({ verified: true, orderId: order.orderNumber });
  } catch (error) {
    console.error("Payment verification failed", error);
    return NextResponse.json({ error: "Could not verify payment." }, { status: 500 });
  }
}
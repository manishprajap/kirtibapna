import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { and, eq, inArray } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { hasAdminSession } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import { orders, refunds, transactions } from "@/lib/db/schema";

export const runtime = "nodejs";
type Context = { params: { id: string } };

export async function POST(request: Request, { params }: Context) {
  if (!hasAdminSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) return NextResponse.json({ error: "Razorpay is not configured." }, { status: 503 });

  let input: { amount?: number; reason?: string };
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!Number.isInteger(input.amount) || (input.amount ?? 0) <= 0 || !input.reason?.trim()) {
    return NextResponse.json({ error: "Enter a positive refund amount in rupees and a reason." }, { status: 400 });
  }
  const amount = input.amount as number;
  const reason = input.reason.trim();

  const db = getDb();
  const [order] = await db.select().from(orders).where(eq(orders.id, params.id)).limit(1);
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  if (!order.razorpayPaymentId || order.paymentStatus === "pending" || order.paymentStatus === "failed") {
    return NextResponse.json({ error: "This order does not have a captured Razorpay payment to refund." }, { status: 409 });
  }

  const [payment] = await db.select().from(transactions).where(and(eq(transactions.orderId, order.id), eq(transactions.type, "payment"), eq(transactions.status, "captured"))).limit(1);
  if (!payment) return NextResponse.json({ error: "Captured payment transaction was not found." }, { status: 409 });
  const existingRefunds = await db.select({ amount: refunds.amount }).from(refunds).where(and(eq(refunds.orderId, order.id), inArray(refunds.status, ["pending", "processed"])));
  const remaining = payment.amount - existingRefunds.reduce((sum, refund) => sum + refund.amount, 0);
  if (amount > remaining) return NextResponse.json({ error: `Refund amount exceeds the remaining refundable balance of ${remaining} rupees.` }, { status: 400 });

  const refundId = randomUUID();
  await db.insert(refunds).values({ id: refundId, orderId: order.id, transactionId: payment.id, amount, reason: reason.slice(0, 500), status: "pending" });

  let gatewayRefund: { id: string };
  try {
    const gateway = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    gatewayRefund = await gateway.payments.refund(order.razorpayPaymentId, {
      amount: amount * 100,
      notes: { orderNumber: order.orderNumber, reason: reason.slice(0, 200) },
    });
  } catch (error) {
    console.error("Razorpay refund failed", error);
    return NextResponse.json({ error: "Razorpay refund status is not confirmed. Check the Razorpay dashboard before retrying." }, { status: 502 });
  }

  try {
    const refunded = remaining === amount;
    await db.transaction(async (tx) => {
      await tx.update(refunds).set({ providerRefundId: gatewayRefund.id, status: "processed", updatedAt: new Date() }).where(eq(refunds.id, refundId));
      await tx.insert(transactions).values({
        id: randomUUID(),
        orderId: order.id,
        provider: "razorpay",
        type: "refund",
        providerTransactionId: gatewayRefund.id,
        amount,
        status: "processed",
        metadata: { reason: reason.slice(0, 500) },
      });
      await tx.update(orders).set({ paymentStatus: refunded ? "refunded" : "partially_refunded", status: refunded ? "refunded" : order.status, updatedAt: new Date() }).where(eq(orders.id, order.id));
    });
    return NextResponse.json({ refunded: true, refundId: gatewayRefund.id, amount });
  } catch (error) {
    console.error("Razorpay refund was accepted but local records need reconciliation", error);
    return NextResponse.json({ error: "Razorpay accepted the refund, but the local record could not be updated. Reconcile this refund in the Razorpay dashboard before retrying." }, { status: 503 });
  }
}
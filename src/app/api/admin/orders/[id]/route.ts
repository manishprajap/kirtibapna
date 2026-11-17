import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { hasAdminSession } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import { orders, transactions } from "@/lib/db/schema";

export const runtime = "nodejs";
type Context = { params: { id: string } };
const statuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"] as const;

export async function PATCH(request: Request, { params }: Context) {
  if (!hasAdminSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let input: { status?: string; paymentStatus?: string; notes?: string };
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (input.status !== undefined && !statuses.includes(input.status as (typeof statuses)[number])) return NextResponse.json({ error: "Invalid order status." }, { status: 400 });
  if (input.paymentStatus !== undefined && !["pending", "paid"].includes(input.paymentStatus)) return NextResponse.json({ error: "Invalid payment status." }, { status: 400 });
  if (input.status === undefined && input.paymentStatus === undefined && input.notes === undefined) return NextResponse.json({ error: "No order changes were provided." }, { status: 400 });

  try {
    const db = getDb();
    const [order] = await db.select({ id: orders.id, paymentStatus: orders.paymentStatus, paymentMethod: orders.paymentMethod }).from(orders).where(eq(orders.id, params.id)).limit(1);
    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    if (input.paymentStatus && order.paymentMethod !== "cod") return NextResponse.json({ error: "Online payment status is updated by the payment gateway only." }, { status: 409 });
    if (input.status === "cancelled" && ["paid", "partially_refunded"].includes(order.paymentStatus)) {
      return NextResponse.json({ error: "Issue the required refund before cancelling a paid order." }, { status: 409 });
    }
    await db.update(orders).set({
      ...(input.status ? { status: input.status as (typeof statuses)[number] } : {}),
      ...(input.paymentStatus ? { paymentStatus: input.paymentStatus as "pending" | "paid" } : {}),
      ...(input.notes !== undefined ? { notes: input.notes.trim().slice(0, 4000) } : {}),
      updatedAt: new Date(),
    }).where(eq(orders.id, params.id));
    if (input.paymentStatus) {
      await db.update(transactions).set({ status: input.paymentStatus === "paid" ? "captured" : "pending" }).where(and(eq(transactions.orderId, params.id), eq(transactions.provider, "cod"), eq(transactions.type, "payment")));
    }
    return NextResponse.json({ updated: true });
  } catch (error) {
    console.error("Order update failed", error);
    return NextResponse.json({ error: "Could not update order." }, { status: 500 });
  }
}
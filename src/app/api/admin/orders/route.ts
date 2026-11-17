import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { hasAdminSession } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import { orders, transactions } from "@/lib/db/schema";

export const runtime = "nodejs";

export async function GET() {
  if (!hasAdminSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 503 });

  try {
    const db = getDb();
    const orderRows = await db.select().from(orders).orderBy(desc(orders.createdAt));
    const transactionRows = await db.select({ transaction: transactions, orderNumber: orders.orderNumber }).from(transactions).leftJoin(orders, eq(transactions.orderId, orders.id)).orderBy(desc(transactions.createdAt));
    const byOrder = new Map<string, (typeof transactionRows[number])[]>();
    transactionRows.forEach((row) => byOrder.set(row.transaction.orderId, [...(byOrder.get(row.transaction.orderId) ?? []), row]));
    return NextResponse.json({ orders: orderRows.map((order) => {
      const related = byOrder.get(order.id) ?? [];
      const orderTransactions = related.map((row) => ({ ...row.transaction, orderNumber: row.orderNumber }));
      const refunded = orderTransactions.filter((transaction) => transaction.type === "refund" && transaction.status === "processed").reduce((sum, transaction) => sum + transaction.amount, 0);
      return { ...order, transactions: orderTransactions, refundableAmount: Math.max(0, order.total - refunded) };
    }) });
  } catch (error) {
    console.error("Admin orders read failed", error);
    return NextResponse.json({ error: "Could not load orders." }, { status: 500 });
  }
}
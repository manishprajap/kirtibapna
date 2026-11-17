import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { hasAdminSession } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import { orders, transactions } from "@/lib/db/schema";

export const runtime = "nodejs";

export async function GET() {
  if (!hasAdminSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const rows = await getDb().select({ transaction: transactions, orderNumber: orders.orderNumber }).from(transactions).leftJoin(orders, eq(transactions.orderId, orders.id)).orderBy(desc(transactions.createdAt));
    return NextResponse.json({ transactions: rows.map((row) => ({ ...row.transaction, orderNumber: row.orderNumber })) });
  } catch (error) {
    console.error("Transaction list failed", error);
    return NextResponse.json({ error: "Could not load transactions." }, { status: 500 });
  }
}
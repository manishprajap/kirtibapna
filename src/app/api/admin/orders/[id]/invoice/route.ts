import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { hasAdminSession } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { formatPrice } from "@/lib/products";

export const runtime = "nodejs";
type Context = { params: { id: string } };
const escapeHtml = (value: unknown) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] ?? char);

export async function GET(_request: Request, { params }: Context) {
  if (!hasAdminSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const db = getDb();
    const [order] = await db.select().from(orders).where(eq(orders.id, params.id)).limit(1);
    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    const customer = order.customer;
    const rows = order.items.map((item) => `<tr><td>${escapeHtml(item.name)}<small>${escapeHtml(item.size)} · ${escapeHtml(item.color)}</small></td><td>${item.qty}</td><td>${formatPrice(item.price)}</td><td>${formatPrice(item.price * item.qty)}</td></tr>`).join("");
    const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Invoice ${escapeHtml(order.invoiceNumber)}</title><style>*{box-sizing:border-box}body{margin:0;padding:40px;color:#2a1a21;font:14px/1.5 Arial,sans-serif}.invoice{max-width:760px;margin:0 auto}.top{display:flex;justify-content:space-between;border-bottom:2px solid #a4164d;padding-bottom:24px}.brand{color:#a4164d;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase}h1{margin:8px 0;font:32px Georgia,serif}.muted{color:#756b6d}.details{display:grid;grid-template-columns:1fr 1fr;gap:24px;padding:26px 0}table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:12px 8px;border-bottom:1px solid #e9e5e3}th{font-size:11px;text-transform:uppercase;color:#756b6d}.totals{margin:18px 0 0 auto;width:260px}.total{display:flex;justify-content:space-between;padding:6px 0}.grand{border-top:1px solid #a4164d;margin-top:8px;padding-top:12px;font-size:18px;font-weight:bold}small{display:block;color:#756b6d}.print{margin-top:24px;padding:10px 16px;border:0;border-radius:4px;background:#a4164d;color:white;cursor:pointer}@media print{body{padding:0}.print{display:none}}</style><body><main class="invoice"><header class="top"><div><div class="brand">Kriti Bapna</div><h1>Tax Invoice</h1><div class="muted">Designer womenswear</div></div><div><strong>Invoice ${escapeHtml(order.invoiceNumber)}</strong><br><span class="muted">Order ${escapeHtml(order.orderNumber)}<br>${new Date(order.createdAt).toLocaleDateString("en-IN")}</span></div></header><section class="details"><div><strong>Bill to</strong><br>${escapeHtml(customer.name)}<br>${escapeHtml(customer.email)}<br>${escapeHtml(customer.phone)}</div><div><strong>Ship to</strong><br>${escapeHtml(customer.address)}<br>${escapeHtml(customer.city)}, ${escapeHtml(customer.state)} ${escapeHtml(customer.pincode)}</div></section><table><thead><tr><th>Item</th><th>Qty</th><th>Unit price</th><th>Amount</th></tr></thead><tbody>${rows}</tbody></table><section class="totals"><div class="total"><span>Subtotal</span><span>${formatPrice(order.subtotal)}</span></div><div class="total"><span>Shipping</span><span>${order.shipping ? formatPrice(order.shipping) : "Free"}</span></div><div class="total grand"><span>Total</span><span>${formatPrice(order.total)}</span></div></section><p class="muted">Payment: ${escapeHtml(order.paymentMethod)} · ${escapeHtml(order.paymentStatus)}</p><button class="print" onclick="window.print()">Print / Save as PDF</button></main></body></html>`;
    return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Content-Disposition": `inline; filename="${order.invoiceNumber}.html"`, "X-Content-Type-Options": "nosniff" } });
  } catch (error) {
    console.error("Invoice generation failed", error);
    return NextResponse.json({ error: "Could not generate invoice." }, { status: 500 });
  }
}
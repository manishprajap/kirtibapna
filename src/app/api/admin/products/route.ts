import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { hasAdminSession } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import { parseProductInput } from "@/lib/db/product-input";
import { categories, products } from "@/lib/db/schema";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!hasAdminSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const parsed = parseProductInput(input);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid product details." }, { status: 400 });

  try {
    const db = getDb();
    const [category] = await db.select({ id: categories.id, active: categories.active }).from(categories).where(eq(categories.id, parsed.data.categoryId)).limit(1);
    if (!category?.active) return NextResponse.json({ error: "Select an active category." }, { status: 400 });
    const [duplicate] = await db.select({ id: products.id }).from(products).where(eq(products.slug, parsed.data.slug)).limit(1);
    if (duplicate) return NextResponse.json({ error: "That product URL already exists." }, { status: 409 });

    const id = randomUUID();
    await db.insert(products).values({ id, ...parsed.data, fabric: parsed.data.fabric || null, tag: parsed.data.tag || null });
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error("Product create failed", error);
    return NextResponse.json({ error: "Could not create product." }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { and, eq, ne } from "drizzle-orm";
import { hasAdminSession } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import { parseProductInput } from "@/lib/db/product-input";
import { categories, products } from "@/lib/db/schema";

export const runtime = "nodejs";
type Context = { params: { id: string } };

export async function PATCH(request: Request, { params }: Context) {
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
    const [current] = await db.select({ id: products.id }).from(products).where(eq(products.id, params.id)).limit(1);
    if (!current) return NextResponse.json({ error: "Product not found." }, { status: 404 });
    const [category] = await db.select({ id: categories.id, active: categories.active }).from(categories).where(eq(categories.id, parsed.data.categoryId)).limit(1);
    if (!category?.active) return NextResponse.json({ error: "Select an active category." }, { status: 400 });
    const [duplicate] = await db.select({ id: products.id }).from(products).where(and(eq(products.slug, parsed.data.slug), ne(products.id, params.id))).limit(1);
    if (duplicate) return NextResponse.json({ error: "That product URL already exists." }, { status: 409 });

    await db.update(products).set({ ...parsed.data, fabric: parsed.data.fabric || null, tag: parsed.data.tag || null, updatedAt: new Date() }).where(eq(products.id, params.id));
    return NextResponse.json({ updated: true });
  } catch (error) {
    console.error("Product update failed", error);
    return NextResponse.json({ error: "Could not update product." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  if (!hasAdminSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const db = getDb();
    await db.delete(products).where(eq(products.id, params.id));
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("Product delete failed", error);
    return NextResponse.json({ error: "Could not delete product." }, { status: 500 });
  }
}